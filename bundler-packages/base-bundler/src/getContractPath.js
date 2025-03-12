import { createRequire } from 'node:module'

/**
 * Array of possible contract package names to search for in the project
 * @type {readonly ['tevm/contract', '@tevm/contract']}
 */
const contractPackages = ['tevm/contract', '@tevm/contract']

/**
 * Detects which version of the contract package is installed in the project.
 * This function tries to resolve either 'tevm/contract' or '@tevm/contract'
 * from the given base path, and returns the first one it finds.
 *
 * @param {string} basePath - The base directory path to search from
 * @returns {'tevm/contract' | '@tevm/contract'} - The resolved contract package name
 * @throws {Error} - Doesn't throw, but logs a warning if neither package is found
 *
 * @example
 * ```javascript
 * import { getContractPath } from '@tevm/base-bundler'
 *
 * // Get the correct contract package for the current project
 * const contractPackage = getContractPath(process.cwd())
 * console.log(contractPackage) // 'tevm/contract' or '@tevm/contract'
 * ```
 */
export const getContractPath = (basePath) => {
	const require = createRequire(basePath.endsWith('/') ? basePath : `${basePath}/`)
	for (const contractPackage of contractPackages) {
		try {
			require.resolve(contractPackage)
			return contractPackage
		} catch (e) {}
	}
	console.warn(
		`Could not find tevm/contract or @tevm/contract in ${basePath}!. Please install it with \`npm i @tevm/contract\` \`pnpm i @tevm/contract\` or \`yarn add tevm/contract\`
Falling back to attempting tevm/contract`,
	)
	return 'tevm/contract'
}
