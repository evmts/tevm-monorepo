import { defaults } from './defaults.js'
import { ShadowValidationError } from './errors.js'

/**
 * Verify that shadow options are consistent with the source language and return defaults if acceptable in this case
 * @param {import('../CompileSourceWithShadowOptions.js').CompileSourceWithShadowOptions} options - The options to validate
 * @param {import('@tevm/solc').SolcLanguage} sourceLanguage - The language of the source code
 * @param {import('@tevm/logger').Logger} logger - The logger
 * @returns {import('./ValidatedShadowOptions.js').ValidatedShadowOptions} The validated options
 */
export const validateShadowOptions = (options, sourceLanguage, logger) => {
	// 1. If source is AST we need both path and name
	// 2. Otherwise just warn
	if (sourceLanguage === 'SolidityAST' && (!options.injectIntoContractPath || !options.injectIntoContractName)) {
		const err = new ShadowValidationError(
			'Both injectIntoContractPath and injectIntoContractName are required when using AST source',
			{
				meta: {
					code: 'missing_inject_options',
					providedPath: options.injectIntoContractPath,
					providedName: options.injectIntoContractName,
				},
			},
		)
		logger.error(err.message)
		throw err
	}

	if (!options.injectIntoContractName) {
		logger.warn(
			'No injectIntoContractName provided; if the source compilation results in exactly one contract, this is safe, otherwise it will throw an error',
		)
	}

	return {
		sourceLanguage,
		shadowLanguage: options.shadowLanguage ?? defaults.language,
		injectIntoContractPath: options.injectIntoContractPath ?? defaults.anonymousSourcePath,
		injectIntoContractName: options.injectIntoContractName,
	}
}
