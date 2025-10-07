import { defaults } from './defaults.js'
import { AstParseError } from './errors.js'
import { validateSolcVersion } from './validateSolcVersion.js'

/**
 * @template {import('@tevm/solc').SolcLanguage} TLanguage
 * @typedef {TLanguage extends 'SolidityAST' ? import('../AstInput.js').AstInput | import('../AstInput.js').AstInput[] | object | object[] : string | string[]} Source
 */
/**
 * @template {import('@tevm/solc').SolcLanguage} TLanguage
 * @typedef {TLanguage extends 'SolidityAST' ? import('../AstInput.js').AstInput | import('../AstInput.js').AstInput[] : string | string[]} ValidatedSource
 */

/**
 * Validates the source code
 *
 * We purposely don't validate AST (e.g. valid json) to let the AST reader validate and throw the appropriate errors
 * @template {import('@tevm/solc').SolcLanguage} TLanguage
 * @template {import('../CompilationOutputOption.js').CompilationOutputOption[]} TCompilationOutput
 * @param {Source<TLanguage>} source - The source code to validate
 * @param {import('../CompileBaseOptions.js').CompileBaseOptions<TLanguage> | undefined} options - The compilation options
 * @param {import('@tevm/logger').Logger} logger - The logger
 * @returns {import('./ValidatedCompileBaseOptions.js').ValidatedCompileBaseOptions<TLanguage, TCompilationOutput>} The validated source code
 */
export const validateBaseOptions = (source, options = {}, logger) => {
	// Set required settings in case they are left undefined (language, output and latest stable hardfork)
	const language = /** @type {TLanguage} */ (options.language ?? defaults.language)
	if (!options.language) {
		logger.debug(`No language provided, using default: ${language}`)
	}
	const hardfork = options.hardfork ?? defaults.hardfork
	if (!options.hardfork) {
		logger.debug(`No hardfork provided, using default: ${hardfork}`)
	}
	const compilationOutput = /** @type {TCompilationOutput} */ (options.compilationOutput ?? defaults.compilationOutput)
	if (!options.compilationOutput) {
		logger.debug(`No compilation output selection, using default fields: ${compilationOutput}`)
	}

	if (language === 'SolidityAST') {
		const isValidAstSource =
			typeof source === 'object' &&
			// modern syntax
			(('nodeType' in source && source.nodeType === 'SourceUnit') ||
				// legacy syntax
				('name' in source && source.name === 'SourceUnit'))
		if (!isValidAstSource) {
			const err = new AstParseError(`Invalid AST source, expected a SourceUnit`, {
				meta: { code: 'invalid_source_ast' },
			})
			logger.error(err.message)
			throw err
		}
	}

	// For Solidity source, we extract compatible versions either as a default or to compare against provided version
	// For Yul and AST we use either the provided or the default (latest) version
	const solcVersion = validateSolcVersion(/** @type {ValidatedSource<TLanguage>} */ (source), options, logger)

	logger.debug(`Validated source code with language: ${language}, hardfork: ${hardfork}, solc version: ${solcVersion}`)

	return {
		...options,
		language,
		hardfork,
		compilationOutput,
		solcVersion,
		throwOnVersionMismatch: options.throwOnVersionMismatch ?? defaults.throwOnVersionMismatch,
		throwOnCompilationError: options.throwOnCompilationError ?? defaults.throwOnCompilationError,
		loggingLevel: options.loggingLevel ?? defaults.loggingLevel,
	}
}
