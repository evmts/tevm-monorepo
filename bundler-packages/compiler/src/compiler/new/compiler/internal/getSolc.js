import { createSolc } from '@tevm/solc'
import { SolcError } from './errors.js'

/**
 * Instantiate a solc instance with a given version if not already instantiated
 * @param {import('@tevm/solc').SolcVersions} version - Solc version to load
 * @param {import('@tevm/logger').Logger} logger - The logger
 * @returns {Promise<import('@tevm/solc').Solc>}
 * @throws {SolcError} If the solc instance fails to load
 */
export const getSolc = async (version, logger) => {
	try {
		const solcInstance = await createSolc(version)
		logger.debug(`Successfully loaded solc instance for version ${version}`)
		return solcInstance
	} catch (error) {
		const err = new SolcError(`Failed to load solc instance for version ${version}`, {
			cause: error,
			meta: { code: 'instantiation_failed', version },
		})
		logger.error(err.message)
		throw err
	}
}
