import { defaults } from './defaults.js'
import { NotSupportedError, ShadowValidationError } from './errors.js'

/**
 * Verify that shadow options are consistent with the source language and return defaults if acceptable in this case
 * @param {import('../CompileSourceWithShadowOptions.js').CompileSourceWithShadowOptions} options - The options to validate
 * @param {import('./CompileContractsResult.js').CompileContractsResult['compilationResult']} sourcesCompilationResult - The compiled sources
 * @param {import('@tevm/solc').SolcLanguage} sourceLanguage - The language of the source code
 * @param {import('@tevm/logger').Logger} logger - The logger
 * @returns {import('./ValidatedShadowOptions.js').ValidatedShadowOptions} The validated options
 */
export const validateShadowOptions = (options, sourcesCompilationResult, sourceLanguage, logger) => {
	if (options.sourceLanguage === 'Yul') {
		const err = new NotSupportedError('Yul is not supported yet', {
			meta: { code: 'yul_not_supported' },
		})
		logger.error(err.message)
		throw err
	}

	const contractPaths = Object.keys(sourcesCompilationResult)
	if (contractPaths.length > 1 && !options.injectIntoContractPath) {
		const err = new ShadowValidationError(
			'injectIntoContractPath is required when using AST source with multiple contract files',
			{
				meta: {
					code: 'missing_inject_path',
					sourceFilePaths: contractPaths,
				},
			},
		)
		logger.error(err.message)
		throw err
	}
	if (contractPaths.length === 0) {
		const err = new ShadowValidationError('Source compilation resulted in no contract files', {
			meta: { code: 'missing_contract_files' },
		})
		logger.error(err.message)
		throw err
	}
	if (options.injectIntoContractPath && !contractPaths.includes(options.injectIntoContractPath)) {
		const err = new ShadowValidationError('injectIntoContractPath is not a valid contract file', {
			meta: { code: 'invalid_inject_path', providedPath: options.injectIntoContractPath },
		})
		logger.error(err.message)
		throw err
	}
	if (!options.injectIntoContractPath) {
		logger.warn('No injectIntoContractPath provided; using the first contract file')
	}
	const injectIntoContractPath = options.injectIntoContractPath ?? /** @type {string} */ (contractPaths[0])
	logger.debug(`Using contract at path ${injectIntoContractPath} to inject shadow code`)

	const contractNames = Object.keys(
		/** @type {import('./CompiledSource.js').CompiledSource} */ (sourcesCompilationResult[injectIntoContractPath])
			.contract,
	)
	if (contractNames.length > 1 && !options.injectIntoContractName) {
		const err = new ShadowValidationError(
			'injectIntoContractName is required when using AST source with multiple contracts in the target file',
			{
				meta: {
					code: 'missing_inject_name',
					sourceContractNames: contractNames,
				},
			},
		)
		logger.error(err.message)
		throw err
	}
	if (contractNames.length === 0) {
		const err = new ShadowValidationError('Source compilation resulted in no contracts', {
			meta: { code: 'missing_contracts' },
		})
		logger.error(err.message)
		throw err
	}
	const injectIntoContractName = options.injectIntoContractName ?? /** @type {string} */ (contractNames[0])
	logger.debug(`Using contract ${injectIntoContractName} to inject shadow code`)

	if (options.shadowLanguage === 'SolidityAST') {
		const err = new ShadowValidationError('Shadow language cannot be AST - must be Solidity or Yul', {
			meta: { code: 'invalid_shadow_language' },
		})
		logger.error(err.message)
		throw err
	}

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
