import { createLogger } from '@tevm/logger'
import { compileContracts } from './internal/compileContracts.js'
import { defaults } from './internal/defaults.js'
import { CompilerOutputError } from './internal/errors.js'
import { getSolc } from './internal/getSolc.js'
import { validateBaseOptions } from './internal/validateBaseOptions.js'

/**
 * Compile a single source code string or AST
 *
 * @template {import('@tevm/solc').SolcLanguage} TLanguage
 * @template {import('./CompilationOutputOption.js').CompilationOutputOption[] | undefined} TCompilationOutput
 * @param {TLanguage extends 'SolidityAST' ? import('@tevm/solc').SolcAst : string} source - The source code to compile
 * @param {import('./CompileBaseOptions.js').CompileBaseOptions<TLanguage, TCompilationOutput>} [options]
 * @returns {Promise<import('./CompileSourceResult.js').CompileSourceResult<TCompilationOutput>>}
 */
export const compileSource = async (source, options) => {
	const logger = createLogger({ name: '@tevm/compiler', level: options?.loggingLevel ?? defaults.loggingLevel })
	const validatedOptions = validateBaseOptions(source, options ?? {}, logger)
	const solc = await getSolc(validatedOptions.solcVersion, logger)

	return compileSourceInternal(solc, source, validatedOptions, logger)
}

/**
 * Compile a single source code string or AST
 *
 * @template {import('@tevm/solc').SolcLanguage} TLanguage
 * @template {import('./CompilationOutputOption.js').CompilationOutputOption[] | undefined} TCompilationOutput
 * @param {import('@tevm/solc').Solc} solc
 * @param {TLanguage extends 'SolidityAST' ? import('@tevm/solc').SolcAst : string} source
 * @param {import('./internal/ValidatedCompileBaseOptions.js').ValidatedCompileBaseOptions<TLanguage, TCompilationOutput>} validatedOptions
 * @param {import('@tevm/logger').Logger} logger
 * @returns {import('./CompileSourceResult.js').CompileSourceResult<TCompilationOutput>}
 */
export const compileSourceInternal = (solc, source, validatedOptions, logger) => {
	// We compile contracts with an anonymous source file path that will be stripped out from the result
	const { compilationResult, ...output } = compileContracts(
		solc,
		{ [defaults.injectIntoContractPath]: source },
		validatedOptions,
		logger,
	)
	const sourceCompilationResult = compilationResult[defaults.injectIntoContractPath]
	// This should never happen as any compilation error will still produce the output, just possibly with empty fields at the contract level
	if (!sourceCompilationResult) {
		const err = new CompilerOutputError('Source output not found', {
			meta: { code: 'missing_source_output' },
		})
		logger.error(err.message)
		throw err
	}

	return {
		...output,
		compilationResult: sourceCompilationResult,
	}
}
