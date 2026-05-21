#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { promises as fs } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const defaultRegistry = 'https://registry.npmjs.org'

const usage = `Configure npm Trusted Publishing for Tevm packages.

Usage:
  node scripts/configure-npm-trusted-publishers.mjs [options]

Authentication:
  For real runs, the script starts npm's browser login flow before configuring
  packages. Set NPM_TOKEN or NODE_AUTH_TOKEN to skip browser login and use that
  token instead. Set NPM_OTP if your npm account requires an OTP for trust API
  writes; otherwise the script prompts before the first trust API request.

Options:
  --repo <owner/repo>        GitHub repository claim. Default: evmts/tevm-monorepo
  --file <workflow.yml>      GitHub workflow filename. Default: prerelease.yml
  --environment <name>       Optional GitHub environment claim.
  --package <name>           Configure one package. May be repeated.
  --packages-file <path>     Newline-delimited package names to configure.
  --registry <url>           npm registry. Default: ${defaultRegistry}
  --replace                  Delete different existing trust configs first.
  --dry-run                  Print the package list and planned requests only.
  --skip-login               Do not start npm browser login before API calls.
  --yes                      Do not ask for confirmation.
  --help                     Show this help.
`

const options = parseArgs(process.argv.slice(2))

if (options.help) {
	console.log(usage)
	process.exit(0)
}

let rl

try {
	const packages = await resolvePackages(options)

	if (packages.length === 0) {
		throw new Error('No packages found to configure.')
	}

	console.log(`Repository: ${options.repo}`)
	console.log(`Workflow:   ${options.file}`)
	if (options.environment) {
		console.log(`Environment: ${options.environment}`)
	}
	console.log(`Registry:   ${options.registry}`)
	console.log(`Packages:   ${packages.length}`)

	for (const packageName of packages) {
		console.log(`  - ${packageName}`)
	}

	if (options.dryRun) {
		console.log('\nDry run only; no npm API calls were made.')
		process.exit(0)
	}

	if (!options.yes) {
		const answer = await prompt('Configure trusted publishing for these packages? [y/N] ')
		if (!/^y(es)?$/i.test(answer.trim())) {
			console.log('Aborted.')
			process.exit(1)
		}
	}

	await ensureNpmBrowserLogin(options)

	const token = await resolveToken(options)
	let otp = options.otp || process.env.NPM_OTP || ''
	if (!otp) {
		otp = await promptOptionalOtp()
	}
	otp = await verifyTrustApiAccess(packages[0], token, otp, options)

	const results = {
		configured: [],
		skipped: [],
		replaced: [],
		failed: [],
	}

	for (const packageName of packages) {
		try {
			const result = await configurePackage(packageName, token, otp, options)
			if (result.refreshedOtp) {
				otp = result.refreshedOtp
			}
			results[result.status].push(packageName)
			console.log(`${labelFor(result.status)} ${packageName}${result.reason ? ` - ${result.reason}` : ''}`)
		} catch (error) {
			results.failed.push(packageName)
			console.error(`FAIL ${packageName} - ${error.message}`)
		}
	}

	console.log('\nSummary:')
	console.log(`  configured: ${results.configured.length}`)
	console.log(`  skipped:    ${results.skipped.length}`)
	console.log(`  replaced:   ${results.replaced.length}`)
	console.log(`  failed:     ${results.failed.length}`)

	if (results.failed.length > 0) {
		console.log('\nFailed packages:')
		for (const packageName of results.failed) {
			console.log(`  - ${packageName}`)
		}
		process.exit(1)
	}
} catch (error) {
	console.error(error.message)
	process.exitCode = 1
} finally {
	rl?.close()
}

function parseArgs(args) {
	const parsed = {
		repo: 'evmts/tevm-monorepo',
		file: 'prerelease.yml',
		environment: '',
		registry: defaultRegistry,
		packages: [],
		packageFiles: [],
		replace: false,
		dryRun: false,
		skipLogin: false,
		yes: false,
		help: false,
		otp: '',
	}

	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index]
		switch (arg) {
			case '--repo':
			case '--repository':
				parsed.repo = requireValue(args, ++index, arg)
				break
			case '--file':
			case '--workflow':
				parsed.file = requireValue(args, ++index, arg)
				break
			case '--environment':
			case '--env':
				parsed.environment = requireValue(args, ++index, arg)
				break
			case '--registry':
				parsed.registry = requireValue(args, ++index, arg).replace(/\/$/, '')
				break
			case '--package':
				parsed.packages.push(requireValue(args, ++index, arg))
				break
			case '--packages-file':
				parsed.packageFiles.push(requireValue(args, ++index, arg))
				break
			case '--otp':
				parsed.otp = requireValue(args, ++index, arg)
				break
			case '--replace':
				parsed.replace = true
				break
			case '--dry-run':
				parsed.dryRun = true
				break
			case '--skip-login':
				parsed.skipLogin = true
				break
			case '--yes':
			case '-y':
				parsed.yes = true
				break
			case '--help':
			case '-h':
				parsed.help = true
				break
			default:
				throw new Error(`Unknown argument: ${arg}\n\n${usage}`)
		}
	}

	return parsed
}

function requireValue(args, index, flag) {
	const value = args[index]
	if (!value || value.startsWith('--')) {
		throw new Error(`${flag} requires a value.`)
	}
	return value
}

async function resolvePackages(opts) {
	const explicit = new Set(opts.packages)

	for (const file of opts.packageFiles) {
		const text = await fs.readFile(path.resolve(repoRoot, file), 'utf8')
		for (const line of text.split(/\r?\n/)) {
			const packageName = line.trim()
			if (packageName && !packageName.startsWith('#')) {
				explicit.add(packageName)
			}
		}
	}

	if (explicit.size > 0) {
		return [...explicit].sort((a, b) => a.localeCompare(b))
	}

	const ignored = await loadChangesetIgnorePatterns()
	const packageNames = new Set()
	await visitPackageJsons(repoRoot, async (packageJsonPath) => {
		const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
		const packageName = packageJson.name

		if (packageJson.private === true || typeof packageName !== 'string') {
			return
		}
		if (!isTevmPublishCandidate(packageName)) {
			return
		}
		if (matchesAnyPattern(packageName, ignored)) {
			return
		}

		packageNames.add(packageName)
	})

	return [...packageNames].sort((a, b) => a.localeCompare(b))
}

async function loadChangesetIgnorePatterns() {
	try {
		const config = JSON.parse(await fs.readFile(path.join(repoRoot, '.changeset/config.json'), 'utf8'))
		return Array.isArray(config.ignore) ? config.ignore : []
	} catch {
		return []
	}
}

async function visitPackageJsons(directory, onPackageJson) {
	const entries = await fs.readdir(directory, { withFileTypes: true })

	for (const entry of entries) {
		const fullPath = path.join(directory, entry.name)

		if (entry.isDirectory()) {
			if (shouldSkipDirectory(entry.name)) {
				continue
			}
			await visitPackageJsons(fullPath, onPackageJson)
			continue
		}

		if (entry.isFile() && entry.name === 'package.json') {
			await onPackageJson(fullPath)
		}
	}
}

function shouldSkipDirectory(name) {
	return ['.git', '.nx', '.turbo', '.worktrees', 'coverage', 'dist', 'node_modules', 'types'].includes(name)
}

function isTevmPublishCandidate(packageName) {
	return packageName === 'tevm' || packageName === 'tevm-run' || packageName.startsWith('@tevm/')
}

function matchesAnyPattern(packageName, patterns) {
	return patterns.some((pattern) => {
		if (!pattern.includes('*')) {
			return packageName === pattern
		}
		const regex = new RegExp(`^${pattern.split('*').map(escapeRegex).join('.*')}$`)
		return regex.test(packageName)
	})
}

function escapeRegex(value) {
	return value.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
}

async function resolveToken(opts) {
	const token = process.env.NPM_TOKEN || process.env.NODE_AUTH_TOKEN || (await readTokenFromNpmrc(opts.registry))

	if (!token) {
		throw new Error(
			'No npm auth token found. Run `npm login --registry=https://registry.npmjs.org` or export NPM_TOKEN.',
		)
	}

	return token
}

async function readTokenFromNpmrc(registry) {
	const registryHost = new URL(registry).host
	const npmrcFiles = [path.join(repoRoot, '.npmrc'), path.join(os.homedir(), '.npmrc')]

	for (const npmrcFile of npmrcFiles) {
		let text
		try {
			text = await fs.readFile(npmrcFile, 'utf8')
		} catch {
			continue
		}

		const lines = text.split(/\r?\n/)
		for (const line of lines) {
			const trimmed = line.trim()
			const scopedPrefix = `//${registryHost}/:_authToken=`
			const unscopedPrefix = '_authToken='

			if (trimmed.startsWith(scopedPrefix)) {
				return expandEnv(trimmed.slice(scopedPrefix.length).trim())
			}
			if (trimmed.startsWith(unscopedPrefix)) {
				return expandEnv(trimmed.slice(unscopedPrefix.length).trim())
			}
		}
	}

	return ''
}

function expandEnv(value) {
	return value.replace(/\$\{([^}]+)\}/g, (_, name) => process.env[name] || '')
}

async function ensureNpmBrowserLogin(opts) {
	if (opts.skipLogin || process.env.NPM_TOKEN || process.env.NODE_AUTH_TOKEN) {
		return
	}

	console.log('\nStarting npm browser login...')
	const result = spawnSync('npm', ['login', '--auth-type=web', `--registry=${opts.registry}`], {
		cwd: repoRoot,
		env: process.env,
		stdio: 'inherit',
	})

	if (result.error) {
		throw result.error
	}
	if (result.status !== 0) {
		throw new Error(`npm browser login failed with exit code ${result.status}`)
	}
}

async function configurePackage(packageName, token, otp, opts) {
	const existing = await requestWithOtpRefresh({
		method: 'GET',
		packageName,
		token,
		otp,
		opts,
	})

	if (Array.isArray(existing.data) && existing.data.some((config) => isMatchingConfig(config, opts))) {
		return {
			status: 'skipped',
			reason: 'already configured',
			refreshedOtp: existing.otp,
		}
	}

	if (Array.isArray(existing.data) && existing.data.length > 0) {
		if (!opts.replace) {
			return {
				status: 'failed',
				reason: 'different trusted publisher exists; rerun with --replace to delete it first',
				refreshedOtp: existing.otp,
			}
		}

		for (const config of existing.data) {
			if (!config.id) {
				throw new Error('existing trusted publisher config has no id; cannot replace it')
			}
			const deleted = await requestWithOtpRefresh({
				method: 'DELETE',
				packageName,
				configId: config.id,
				token,
				otp: existing.otp,
				opts,
			})
			existing.otp = deleted.otp
		}
	}

	const created = await requestWithOtpRefresh({
		method: 'POST',
		packageName,
		token,
		otp: existing.otp,
		opts,
		body: [createGithubConfig(opts)],
	})

	return {
		status: Array.isArray(existing.data) && existing.data.length > 0 ? 'replaced' : 'configured',
		refreshedOtp: created.otp,
	}
}

async function verifyTrustApiAccess(packageName, token, otp, opts) {
	try {
		const response = await requestWithOtpRefresh({
			method: 'GET',
			packageName,
			token,
			otp,
			opts,
		})
		return response.otp || otp
	} catch (error) {
		if (/npm registry returned (401|403):/.test(error.message)) {
			throw new Error(`Unable to authorize npm trusted-publisher API for ${packageName}.

npm rejected the token or OTP for the trust API. Retry with a current npm OTP.
If it still returns 401, create a granular npm access token with read/write
access to the Tevm packages and rerun:

  NPM_TOKEN=... NPM_OTP=... node scripts/configure-npm-trusted-publishers.mjs --skip-login --yes

Original error: ${error.message}`)
		}
		throw error
	}
}

function createGithubConfig(opts) {
	const claims = {
		repository: opts.repo,
		workflow_ref: {
			file: opts.file,
		},
	}

	if (opts.environment) {
		claims.environment = opts.environment
	}

	return {
		type: 'github',
		claims,
		permissions: ['createPackage'],
	}
}

function isMatchingConfig(config, opts) {
	const claims = config.claims || {}
	const permissions = Array.isArray(config.permissions) ? config.permissions : []

	if (config.type !== 'github') {
		return false
	}
	if (claims.repository !== opts.repo) {
		return false
	}
	if (claims.workflow_ref?.file !== opts.file) {
		return false
	}
	if ((claims.environment || '') !== (opts.environment || '')) {
		return false
	}
	return permissions.includes('createPackage')
}

async function requestWithOtpRefresh(request) {
	let response = await registryRequest(request)
	if (!response.needsFreshOtp) {
		return response
	}

	const nextOtp = await promptSecret(`npm OTP expired or required for ${request.packageName}; enter a new OTP: `)
	response = await registryRequest({ ...request, otp: nextOtp })
	response.otp = nextOtp
	return response
}

async function registryRequest({ method, packageName, configId, token, otp, opts, body }) {
	const url = trustUrl(opts.registry, packageName, configId)
	const headers = {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json',
	}
	if (otp) {
		headers['npm-otp'] = otp
	}
	const response = await fetch(url, {
		method,
		headers,
		body: body === undefined ? undefined : JSON.stringify(body),
	})

	if (response.status === 204) {
		return { data: null, otp }
	}

	const text = await response.text()
	const data = parseJsonOrText(text)

	if (response.ok) {
		return { data, otp }
	}

	if ((response.status === 401 || response.status === 403) && looksLikeOtpFailure(data)) {
		return { data, otp, needsFreshOtp: true }
	}

	if (response.status === 409) {
		throw new Error('trusted publisher config already exists')
	}

	throw new Error(formatRegistryError(response.status, data))
}

function trustUrl(registry, packageName, configId) {
	const encodedPackageName = encodeURIComponent(packageName)
	const base = `${registry}/-/package/${encodedPackageName}/trust`
	return configId ? `${base}/${encodeURIComponent(configId)}` : base
}

function parseJsonOrText(text) {
	if (!text) {
		return null
	}
	try {
		return JSON.parse(text)
	} catch {
		return text
	}
}

function looksLikeOtpFailure(data) {
	const text = typeof data === 'string' ? data : JSON.stringify(data)
	return /otp|one-time|2fa|two.factor|multifactor/i.test(text)
}

function formatRegistryError(status, data) {
	const message = typeof data === 'string' ? data : data?.error || data?.message || data?.reason || JSON.stringify(data)
	return `npm registry returned ${status}: ${message}`
}

function labelFor(status) {
	switch (status) {
		case 'configured':
			return 'OK'
		case 'skipped':
			return 'SKIP'
		case 'replaced':
			return 'REPLACE'
		default:
			return 'FAIL'
	}
}

async function prompt(question) {
	rl ||= createInterface({ input: process.stdin, output: process.stdout })
	return rl.question(question)
}

async function promptOptionalOtp() {
	if (!process.stdin.isTTY) {
		return ''
	}
	return promptSecret('npm OTP for trusted-publisher API (press Enter if not required): ')
}

async function promptSecret(question) {
	if (!process.stdin.isTTY) {
		throw new Error('NPM_OTP is required when stdin is not interactive.')
	}
	return prompt(question)
}
