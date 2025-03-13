import { spawnSync } from 'node:child_process'
import { promises as fs } from 'node:fs'
import path from 'node:path'

// Order of packages to build in sequence (to avoid circular dependencies)
const buildOrder = [
	// Utils packages with minimum dependencies
	'@tevm/utils',
	'@tevm/common',
	'@tevm/address',
	'@tevm/client-types',

	// Core packages
	'@tevm/errors',
	'@tevm/evm',
	'@tevm/state',
	'@tevm/blockchain',
	'@tevm/tx',
	'@tevm/block',
	'@tevm/vm',

	// Extension packages
	'@tevm/predeploys',
	'@tevm/decorators',
	'@tevm/node',
	'@tevm/actions',
	'@tevm/memory-client',

	// Additional packages
	'@tevm/contract',
	'@tevm/trie',
	'@tevm/json-rpc',
	'@tevm/http-client',
	'@tevm/precompiles',
	'@tevm/server',
	'@tevm/txpool',

	// Root tevm package
	'tevm',
]

async function getPackageDirectories() {
	const packagesDir = path.join(process.cwd(), 'packages')
	const bundlersDir = path.join(process.cwd(), 'bundler-packages')

	const packages = await fs.readdir(packagesDir).then((dirs) => dirs.map((dir) => path.join(packagesDir, dir)))

	const bundlers = await fs.readdir(bundlersDir).then((dirs) => dirs.map((dir) => path.join(bundlersDir, dir)))

	return [...packages, ...bundlers]
}

async function buildPackage(packagePath: string) {
	console.log(`Building ${path.basename(packagePath)}...`)

	// Build dist
	spawnSync('bun', ['run', 'build:dist'], {
		cwd: packagePath,
		stdio: 'inherit',
	})

	// Build types
	spawnSync('bun', ['run', 'build:types'], {
		cwd: packagePath,
		stdio: 'inherit',
	})

	console.log(`✅ Finished building ${path.basename(packagePath)}`)
}

async function main() {
	const allPackageDirs = await getPackageDirectories()
	const packageMap = new Map<string, string>()

	// Create a map of package names to directories
	for (const dir of allPackageDirs) {
		try {
			const packageJsonPath = path.join(dir, 'package.json')
			const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'))
			packageMap.set(packageJson.name, dir)
		} catch (e) {
			console.warn(`Could not load package.json for ${dir}`)
		}
	}

	// Build packages in order
	for (const packageName of buildOrder) {
		const packageDir = packageMap.get(packageName)
		if (packageDir) {
			await buildPackage(packageDir)
			packageMap.delete(packageName)
		} else {
			console.warn(`Package ${packageName} not found, skipping...`)
		}
	}

	// Build remaining packages
	for (const [packageName, packageDir] of packageMap.entries()) {
		console.log(`Building remaining package ${packageName}...`)
		await buildPackage(packageDir)
	}

	// Run other nx targets
	console.log('Running remaining nx targets...')
	spawnSync('nx', ['run-many', '--targets=typecheck,generate:docs,test:coverage,lint:package,lint:deps,format'], {
		stdio: 'inherit',
	})
}

main().catch(console.error)
