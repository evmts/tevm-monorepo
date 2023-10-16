import { createRequire } from 'module'

/**
 * Gets the solc version of node_modules
 * @returns {string} version 
 * @example
 * getDefaultSolcVersion() // "0.8.16"
 */
export const getDefaultSolcVersion = () => {
	const moduleRequire = createRequire(import.meta.url ?? __dirname)
	const solc = moduleRequire('solc')
	const version = solc?.version
	if (!version) {
		console.error(
			'Failed to get solc version! Please install it or specify a version in your config',
		)
	}
	return solc?.version
}
