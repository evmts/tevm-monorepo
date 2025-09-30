import { releases } from '@tevm/solc'
import { defaults } from './defaults.js'
import { extractCompatibleSolcVersions } from './extractCompatibleSolcVersions.js'

/**
 * Validates the solc version against the source code, provided and default versions
 * @template TLanguage extends import('@tevm/solc').SolcLanguage
 * @param {TLanguage extends 'SolidityAST' ? import('../../types.js').SolcAst | import('solc-typed-ast').ASTNode : string} source - The source code to validate
 * @param {import('../../types.js').CompileBaseOptions} options - The compilation options
 * @param {import('../../types.js').Logger} [logger] - The logger
 * @returns {keyof import('@tevm/solc').Releases} The validated solc version
 */
export const validateSolcVersion = (source, options, logger = console) => {
	// AST or Yul need either the provided version or the default version, we have no way to validate or guess
	if (options.language === 'SolidityAST' || options.language === 'Yul') {
		if (!options.solcVersion) {
			logger.debug(`No solc version provided, using default: ${defaults.solcVersion}`)
		}
		return options.solcVersion ?? defaults.solcVersion
	}

	// Extract compatible versions from the source, which will be used either as a default or to
	// compare against provided version for debugging
	// If throwOnVersionMismatch is true, we will throw in these cases:
	// 1. The provided version is not included in the compatible versions
	// 2. No version is provided and no compatible version is found
	const compatibleVersions = extractCompatibleSolcVersions(source, logger)

	if (compatibleVersions.length === 0) {
		if (options.throwOnVersionMismatch) {
			logger.error(`No compatible solc versions found for the source code`)
			throw new Error(`No compatible solc versions found for the source code`)
		}

		if (options.solcVersion) {
			logger.warn(`Provided solc version ${options.solcVersion} is not compatible with the source code`)
			return options.solcVersion
		}

		logger.warn(`No compatible solc versions found for the source code, using default: ${defaults.solcVersion}`)
		return defaults.solcVersion
	}

	const latestCompatibleVersion = /** @type {keyof import('@tevm/solc').Releases} */ (compatibleVersions[0])
	const versions = Object.keys(releases)
	if (options.solcVersion && versions.indexOf(options.solcVersion) > versions.indexOf(latestCompatibleVersion)) {
		logger.debug(
			`Provided solc version ${options.solcVersion} is not the latest compatible version: ${latestCompatibleVersion}`,
		)
		return options.solcVersion
	}

	if (options.solcVersion && !compatibleVersions.includes(options.solcVersion)) {
		if (options.throwOnVersionMismatch) {
			logger.error(
				`Provided solc version ${options.solcVersion} is not compatible with the source code; compatible versions: ${compatibleVersions.join(', ')}`,
			)
			throw new Error(`Provided solc version ${options.solcVersion} is not compatible with the source code`)
		}

		logger.warn(
			`Provided solc version ${options.solcVersion} is not compatible with the source code; compatible versions: ${compatibleVersions.join(', ')}`,
		)
		return options.solcVersion
	}

	if (options.solcVersion && compatibleVersions.includes(options.solcVersion)) {
		logger.debug(`Provided solc version ${options.solcVersion} is compatible with the source code`)
		return options.solcVersion
	}

	logger.debug(`No solc version was provided, using the latest compatible version: ${latestCompatibleVersion}`)
	return latestCompatibleVersion
}
