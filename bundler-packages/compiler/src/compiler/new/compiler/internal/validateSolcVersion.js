import { releases } from '@tevm/solc'
import { defaults } from './defaults.js'
import { VersionResolutionError } from './errors.js'
import { extractCompatibleSolcVersions } from './extractCompatibleSolcVersions.js'

/**
 * Validates the solc version against the source code, provided and default versions
 * @template {import('@tevm/solc').SolcLanguage} TLanguage
 * @param {TLanguage extends 'SolidityAST' ? import('../AstInput.js').AstInput | import('../AstInput.js').AstInput[] : string | string[]} source - The source code to validate
 * @param {import('../CompileBaseOptions.js').CompileBaseOptions<TLanguage>} options - The compilation options
 * @param {import('@tevm/logger').Logger} logger - The logger
 * @returns {keyof import('@tevm/solc').Releases} The validated solc version
 * @throws {VersionResolutionError} If the provided version is not compatible with the source code or if no compatible version is found
 */
export const validateSolcVersion = (source, options, logger) => {
	// Yul needs the provided version or the default version, we have no way to validate or guess
	if (options.language === 'Yul') {
		if (!options.solcVersion) {
			logger.debug(`No solc version provided, using default: ${defaults.solcVersion}`)
		}
		return options.solcVersion ?? defaults.solcVersion
	}

	// Extract compatible versions from the source code or AST, which will be used either as a default or to
	// compare against provided version for debugging
	// If throwOnVersionMismatch is true, we will throw in these cases:
	// 1. The provided version is not included in the compatible versions
	// 2. No version is provided and no compatible version is found
	/** @type {string | string[] | undefined} */
	let sourceOrSpecifiers
	if (options.language === 'SolidityAST') {
		const astSources = /** @type {import('../AstInput.js').AstInput[]} */ (Array.isArray(source) ? source : [source])
		const versionLiterals = astSources.flatMap((astSource) =>
			'vPragmaDirectives' in astSource
				? astSource.vPragmaDirectives.map((p) => p.literals)
				: astSource.nodes.map((n) => (n.nodeType === 'PragmaDirective' ? n.literals : [])),
		)
		sourceOrSpecifiers = versionLiterals.map((l) => l.slice(1).join(''))
	} else {
		const soliditySources = /** @type {string[]} */ (Array.isArray(source) ? source : [source])
		// We can roughly concatenate as the only usage of the source is for static analysis of the pragma statements
		sourceOrSpecifiers = soliditySources.join('\n')
	}
	const compatibleVersions = extractCompatibleSolcVersions(sourceOrSpecifiers, logger)

	if (compatibleVersions.length === 0) {
		if (options.throwOnVersionMismatch) {
			const err = new VersionResolutionError(`No compatible solc versions found for the source code`, {
				meta: {
					code: 'no_compatible_version',
					availableVersions: Object.keys(releases),
				},
			})
			logger.error(err.message)
			throw err
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
			const err = new VersionResolutionError(
				`Provided solc version ${options.solcVersion} is not compatible with the source code`,
				{
					meta: {
						code: 'version_mismatch',
						providedVersion: options.solcVersion,
						compatibleVersions,
					},
				},
			)
			logger.error(`${err.message}; compatible versions: ${compatibleVersions.join(', ')}`)
			throw err
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
