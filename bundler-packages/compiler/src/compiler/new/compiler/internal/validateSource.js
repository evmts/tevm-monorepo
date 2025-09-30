import { defaults } from './defaults.js'
import { validateSolcVersion } from './validateSolcVersion.js'

/**
 * Validates the source code
 * @template TLanguage extends import('@tevm/solc').SolcLanguage
 * @param {TLanguage extends 'SolidityAST' ? import('../../types.js').SolcAst | import('solc-typed-ast').ASTNode : string} source - The source code to validate
 * @param {import('../../types.js').CompileBaseOptions} options - The compilation options
 * @param {import('../../types.js').Logger} [logger] - The logger
 * @returns {import('../../types.js').ValidatedCompileBaseOptions} The validated source code
 */
export const validateSource = (source, options, logger = console) => {
	// Set required settings in case they are left undefined (language, output and latest stable hardfork)
	const language = options.language ?? defaults.language
	if (!options.language) {
		logger.debug(`No language provided, using default: ${language}`)
	}
	const hardfork = options.hardfork ?? defaults.hardfork
	if (!options.hardfork) {
		logger.debug(`No hardfork provided, using default: ${hardfork}`)
	}
	const compilationOutput = options.compilationOutput ?? defaults.compilationOutput
	if (!options.compilationOutput) {
		logger.debug(`No compilation output selection, using default fields: ${compilationOutput}`)
	}

	// For Solidity source, we extract compatible versions either as a default or to compare against provided version
	// For Yul and AST we use either the provided or the default (latest) version
	const solcVersion = validateSolcVersion(source, options, logger)

	logger.debug(`Validated source code with language: ${language}, hardfork: ${hardfork}, solc version: ${solcVersion}`)

	return {
		...options,
		language,
		hardfork,
		compilationOutput,
		solcVersion,
	}
}
