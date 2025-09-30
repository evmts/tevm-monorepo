import { createSolc } from '@tevm/solc'

/**
 * Instantiate a solc instance with a given version if not already instantiated
 * @param {import('@tevm/solc').SolcVersions} version - Solc version to load
 * @param {import('../../types.js').Logger} [logger] - The logger
 * @returns {Promise<import('@tevm/solc').Solc>}
 */
export const getSolc = async (version, logger = console) => {
	try {
		const solcInstance = await createSolc(version)
		logger.debug(`Successfully loaded solc instance for version ${version}`)
		return solcInstance
	} catch (error) {
		// TODO: typed error
		logger.error(`Failed to instantiate solc instance for version ${version}`)
		throw new Error(`Failed to instantiate solc instance for version ${version}`, { cause: error })
	}
}
