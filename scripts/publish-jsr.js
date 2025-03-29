#!/usr/bin/env node

/**
 * This script publishes the Tevm package to JSR (jsr.io)
 * It's designed to be used in the GitHub Actions workflow
 * and locally for testing with the --dry-run flag.
 */

import { execSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const rootDir = resolve(__dirname, '..')

// Parse command line arguments
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')

/**
 * Runs a command and returns the output
 * @param {string} command - The command to run
 * @param {object} options - Options for child_process.execSync
 * @returns {string} - The command output
 */
function runCommand(command, options = {}) {
	console.log(`> ${command}`)
	return execSync(command, {
		encoding: 'utf8',
		stdio: 'inherit',
		...options,
	})
}

/**
 * Publishes the package to JSR
 */
async function publishToJSR() {
	console.log('Publishing to JSR...')

	// Check if jsr.json exists in the tevm package directory
	const jsrConfigPath = resolve(rootDir, 'tevm', 'jsr.json')
	if (!existsSync(jsrConfigPath)) {
		console.error('Error: jsr.json not found in the tevm directory.')
		process.exit(1)
	}

	// Read the current version from main tevm package
	const tevmPackageJson = JSON.parse(readFileSync(resolve(rootDir, 'tevm', 'package.json'), 'utf8'))
	const version = tevmPackageJson.version
	console.log(`Current version: ${version}`)

	// Update jsr.json with the current version
	const jsrConfig = JSON.parse(readFileSync(jsrConfigPath, 'utf8'))
	jsrConfig.version = version

	// Write the updated jsr.json back
	const fs = await import('node:fs/promises')
	await fs.writeFile(jsrConfigPath, JSON.stringify(jsrConfig, null, 2), 'utf8')

	// Install JSR CLI if needed
	try {
		runCommand('jsr --version', { stdio: 'pipe' })
	} catch (error) {
		console.log('Installing JSR CLI...')
		runCommand('npm install -g jsr')
	}

	// Change to the tevm directory before publishing
	process.chdir(resolve(rootDir, 'tevm'))
	console.log('Changed to directory:', process.cwd())

	// Publish to JSR
	try {
		const publishCommand = `jsr publish${isDryRun ? ' --dry-run' : ''} --allow-slow-types`
		runCommand(publishCommand)
		console.log('JSR publish completed successfully!')
	} catch (error) {
		console.error('Error publishing to JSR:', error)
		process.exit(1)
	}
}

publishToJSR().catch((error) => {
	console.error('Unhandled error:', error)
	process.exit(1)
})
