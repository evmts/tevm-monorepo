import { existsSync, globSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

if (process.env.GITHUB_ACTIONS !== 'true') {
	console.log('Skipping Changesets publish prep outside GitHub Actions')
	process.exit(0)
}

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const zevmRoot = join(repoRoot, '..', 'zevm', 'npm')

if (!existsSync(zevmRoot)) {
	console.log('Skipping Zevm publish prep because ../zevm/npm was not found')
	process.exit(0)
}

const packageJsonPaths = globSync('**/package.json', { cwd: zevmRoot }).map((path) => join(zevmRoot, path))

for (const packageJsonPath of packageJsonPaths) {
	const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
	if (typeof packageJson.name === 'string' && packageJson.name.startsWith('@evmts/')) {
		packageJson.private = true
		writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
		console.log(`Marked ${packageJson.name} private for Changesets publish`)
	}
}
