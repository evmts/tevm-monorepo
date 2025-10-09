import { defaults } from './defaults.js'
import { NotSupportedError, ShadowValidationError } from './errors.js'

/**
 * Verify that shadow options are consistent with the source language and return defaults if acceptable in this case
 *
 * When using compileWithShadowSource, we pass only a single source so we don't need to validate the path of the target
 *
 * @param {import('solc-typed-ast').SourceUnit[]} astSourceNodes - The source units of the compiled source(s)
 * @param {import('../CompileSourceWithShadowOptions.js').CompileSourceWithShadowOptions} options - The options to validate
 * @param {import('@tevm/solc').SolcLanguage} sourceLanguage - The language of the source code
 * @param {boolean} validatePath - Whether to validate the path of the target
 * @param {import('@tevm/logger').Logger} logger - The logger
 * @returns {import('./ValidatedShadowOptions.js').ValidatedShadowOptions} The validated options
 */
export const validateShadowOptions = (astSourceNodes, options, sourceLanguage, validatePath, logger) => {
	if (options.sourceLanguage === 'Yul') {
		const err = new NotSupportedError('Yul is not supported yet', {
			meta: { code: 'yul_not_supported' },
		})
		logger.error(err.message)
		throw err
	}

	if (options.shadowLanguage === 'SolidityAST') {
		const err = new ShadowValidationError('Shadow language cannot be AST - must be Solidity or Yul', {
			meta: { code: 'invalid_shadow_language' },
		})
		logger.error(err.message)
		throw err
	}

	const { injectIntoContractPath, injectIntoContractName } = resolveContractLocation(
		astSourceNodes,
		options.injectIntoContractPath,
		options.injectIntoContractName,
		validatePath,
		logger,
	)

	if (!options.shadowMergeStrategy) {
		logger.debug(
			'No shadowMergeStrategy provided; using default "safe", which will throw an error if a shadow function name conflicts with an existing one',
		)
	}

	return {
		sourceLanguage,
		shadowLanguage: options.shadowLanguage ?? defaults.language,
		injectIntoContractPath,
		injectIntoContractName,
		shadowMergeStrategy: options.shadowMergeStrategy ?? 'safe',
	}
}

/**
 * Resolve contract location (path and name) based on provided options
 * @param {import('solc-typed-ast').SourceUnit[]} astSources - The compiled sources ast
 * @param {string | undefined} injectIntoContractPath - The contract path to inject the shadow code into
 * @param {string | undefined} injectIntoContractName - The contract name to inject the shadow code into
 * @param {boolean} validatePath - Whether to validate the path of the target
 * @param {import('@tevm/logger').Logger} logger - The logger
 * @returns {{injectIntoContractPath: string, injectIntoContractName: string}} The resolved path and name
 */
const resolveContractLocation = (astSources, injectIntoContractPath, injectIntoContractName, validatePath, logger) => {
	/**
	 * @param {string} code
	 * @param {string} message
	 * @param {Record<string, any>} [meta]
	 */
	const failToResolve = (code, message, meta = {}) => {
		const err = new ShadowValidationError(message, { meta: { code: /** @type {any} */ (code), ...meta } })
		logger.error(err.message)
		throw err
	}

	if (astSources.length === 0)
		failToResolve('missing_contract_files', 'Source compilation resulted in no contract files')

	// Single source case: resolve name only, use default path
	if (!validatePath) {
		const ast = /** @type {import('solc-typed-ast').SourceUnit} */ (astSources[0])
		const contractNames = ast.vContracts.map((c) => c.name)
		if (contractNames.length === 0) failToResolve('missing_contracts', 'Source compilation resulted in no contracts')

		/** @type {string} */
		let resolvedName
		if (injectIntoContractName) {
			if (!contractNames.includes(injectIntoContractName)) {
				failToResolve('invalid_inject_path', `Contract '${injectIntoContractName}' not found in source`, {
					providedName: injectIntoContractName,
					sourceContractNames: contractNames,
				})
			}
			resolvedName = injectIntoContractName
		} else {
			if (contractNames.length > 1) {
				failToResolve(
					'missing_inject_name',
					'injectIntoContractName is required when using AST source with multiple contracts in the target file',
					{ sourceContractNames: contractNames },
				)
			}
			resolvedName = /** @type {string} */ (contractNames[0])
		}

		logger.debug(`Using contract ${resolvedName} to inject shadow code`)
		return { injectIntoContractPath: defaults.injectIntoContractPath, injectIntoContractName: resolvedName }
	}

	// Multiple sources case: resolve both path and name
	const contractPaths = astSources.map((ast) => ast.absolutePath)

	// Resolve path: search by name, use provided, or default to first
	/** @type {string} */
	let resolvedPath

	if (!injectIntoContractPath && injectIntoContractName) {
		// Name-only: search across all sources
		const matchingFiles = astSources
			.filter((ast) => ast.vContracts.some((c) => c.name === injectIntoContractName))
			.map((ast) => ast.absolutePath)

		if (matchingFiles.length === 0) {
			failToResolve('contract_not_found', `Contract '${injectIntoContractName}' not found in any source file`, {
				providedName: injectIntoContractName,
				searchedFiles: contractPaths,
			})
		}
		if (matchingFiles.length > 1) {
			failToResolve(
				'ambiguous_contract_name',
				`Contract '${injectIntoContractName}' found in multiple files. Please specify injectIntoContractPath.`,
				{ providedName: injectIntoContractName, matchingFiles },
			)
		}
		resolvedPath = /** @type {string} */ (matchingFiles[0])
		logger.debug(`Found contract '${injectIntoContractName}' in ${resolvedPath}`)
	} else {
		// Path provided or neither provided
		if (!injectIntoContractPath) {
			if (contractPaths.length > 1) {
				failToResolve(
					'missing_inject_path',
					'injectIntoContractPath is required when using AST source with multiple contract files',
					{ sourceFilePaths: contractPaths },
				)
			}
			logger.warn('No injectIntoContractPath provided; using the first contract file')
			resolvedPath = /** @type {string} */ (contractPaths[0])
		} else {
			resolvedPath = injectIntoContractPath
		}

		if (!contractPaths.includes(resolvedPath)) {
			failToResolve(
				'invalid_inject_path',
				'injectIntoContractPath is not a valid contract file or does not match the source file',
				{
					providedPath: resolvedPath,
					sourceFilePaths: contractPaths,
				},
			)
		}
	}

	// Resolve name from selected source (we've validated path exists above)
	const sourceAst = /** @type {import('solc-typed-ast').SourceUnit} */ (
		astSources.find((ast) => ast.absolutePath === resolvedPath)
	)

	const contractNames = sourceAst.vContracts.map((c) => c.name)
	if (contractNames.length === 0) failToResolve('missing_contracts', 'Source compilation resulted in no contracts')

	/** @type {string} */
	let resolvedName
	if (injectIntoContractName) {
		if (!contractNames.includes(injectIntoContractName)) {
			failToResolve('contract_not_found', `Contract '${injectIntoContractName}' not found in file '${resolvedPath}'`, {
				providedName: injectIntoContractName,
				filePath: resolvedPath,
				availableNames: contractNames,
			})
		}
		resolvedName = injectIntoContractName
	} else {
		if (contractNames.length > 1) {
			failToResolve(
				'missing_inject_name',
				'injectIntoContractName is required when using AST source with multiple contracts in the target file',
				{ sourceContractNames: contractNames },
			)
		}
		resolvedName = /** @type {string} */ (contractNames[0])
	}

	logger.debug(`Using contract ${resolvedName} in ${resolvedPath} to inject shadow code`)
	return { injectIntoContractPath: resolvedPath, injectIntoContractName: resolvedName }
}
