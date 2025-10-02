import { releases } from '@tevm/solc'
import { extractSpecifiersFromSource, getCompilerVersionsBySpecifiers } from 'solc-typed-ast'

/**
 * Extracts the compatible solc versions from the source Solidity code
 * @param {string} source - The inline Solidity source
 * @param {import('@tevm/logger').Logger} logger - The logger
 * @returns {(keyof import('@tevm/solc').Releases)[]} The compatible compiler versions
 */
export const extractCompatibleSolcVersions = (source, logger) => {
	const specifiers = extractSpecifiersFromSource(source)
	if (specifiers.length === 0) {
		logger.warn('Could not extract Solidity version from pragma statements in the source code')
	}

	const versions = Object.keys(releases)
	const compatibleVersions = /** @type {(keyof import('@tevm/solc').Releases)[]} */ (
		getCompilerVersionsBySpecifiers(specifiers, versions)
	)
	if (compatibleVersions.length === 0) {
		logger.warn('Could not find a compatible version for the pragma specifiers in the source code')
	}

	return compatibleVersions
}
