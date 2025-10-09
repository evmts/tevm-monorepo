import { createLogger } from '@tevm/logger'
import { compileSourcesWithShadowInternal } from './compileSourcesWithShadow.js'
import { defaults } from './internal/defaults.js'
import { CompilerOutputError } from './internal/errors.js'
import { getSolc } from './internal/getSolc.js'
import { validateBaseOptions } from './internal/validateBaseOptions.js'

/**
 * Compile a source with injected shadow code
 *
 * This function allows merging shadow contract code into the main source before compilation.
 *
 * Steps:
 * 1. Get/compile source AST
 * 2. Validate shadow options & find target contract
 * 3. Find injection point (last child node of target contract)
 * 4. Inject shadow code:
 *    - Safe mode: inject at original source location
 *    - Replace mode: instrument AST (mark functions virtual) → inject at instrumented location
 * 5. Compile the shadowed source
 *
 * Note: if the compiled source doesn't result in exactly one source file and no source path is provided this will throw an error as we cannot guess where to inject the shadow code.
 * The same exact limitation applies if there are multiple contracts in the file and no contract name is provided.
 * We cannot try to guess as it might accidentally compile with an incorrect mapping and result in inconsistencies that would be awful to debug.
 *
 * Correct usage is roughly:
 * - if using an AST source that might result in multiple files, provide the target contract's path
 * - if using an AST source that might result in multiple contracts in the target file, provide the target contract's name
 * - if using a Solidity/Yul source that includes multiple contracts, provide the contract's name (there is no file path here)
 * - if using a Solidity/Yul source that includes a single contract: you can safely omit the path and name (or provide the name for validation)
 * @template {import('@tevm/solc').SolcLanguage} TSourceLanguage
 * @template {import('./CompilationOutputOption.js').CompilationOutputOption[] | undefined} TCompilationOutput
 * @param {TSourceLanguage extends 'SolidityAST' ? import('@tevm/solc').SolcAst : string} source - The main source code or AST to compile
 * @param {string} shadow - The shadow code to merge into the source
 * @param {Omit<import('./CompileBaseOptions.js').CompileBaseOptions<TSourceLanguage, TCompilationOutput>, 'language'> & import('./CompileSourceWithShadowOptions.js').CompileSourceWithShadowOptions<TSourceLanguage>} [options]
 * @returns {Promise<import('./CompileSourceResult.js').CompileSourceResult<TCompilationOutput>>}
 * @example
 * const result = await compileSourceWithShadow(
 *   'contract Main { uint256 private value; }', // main source with a private variable
 *   'function getValue() external view returns (uint256) { return value; }', // shadow method that returns the otherwise inaccessible private variable
 *   { sourceLanguage: 'Solidity', shadowLanguage: 'Solidity', injectIntoContractName: 'Main' } // here specifically all of these are unnecessary (using defaults and only one contract)
 * )
 */
export const compileSourceWithShadow = async (source, shadow, options) => {
	const logger = createLogger({ name: '@tevm/compiler', level: options?.loggingLevel ?? defaults.loggingLevel })
	const { sourceLanguage, shadowLanguage, injectIntoContractPath, injectIntoContractName, ...baseOptions } =
		options ?? {}
	const validatedOptions = validateBaseOptions(source, { ...baseOptions, language: sourceLanguage }, logger)
	const solc = await getSolc(validatedOptions.solcVersion, logger)

	return compileSourceWithShadowInternal(
		solc,
		source,
		shadow,
		validatedOptions,
		{ shadowLanguage, injectIntoContractPath, injectIntoContractName },
		logger,
	)
}

/**
 * Internal compilation function for source with shadow code injection
 *
 * This function handles the core shadow injection logic, accepting pre-validated options.
 * Used by both compileSourceWithShadow and potentially by compiler instances.
 *
 * @template {import('@tevm/solc').SolcLanguage} TLanguage
 * @template {import('./CompilationOutputOption.js').CompilationOutputOption[] | undefined} TCompilationOutput
 * @param {import('@tevm/solc').Solc} solc - Solc instance
 * @param {TLanguage extends 'SolidityAST' ? import('@tevm/solc').SolcAst : string} source - The source code or AST
 * @param {string} shadow - The shadow code to inject
 * @param {import('./internal/ValidatedCompileBaseOptions.js').ValidatedCompileBaseOptions<TLanguage, TCompilationOutput>} validatedOptions - Validated compilation options
 * @param {Pick<import('./CompileSourceWithShadowOptions.js').CompileSourceWithShadowOptions, 'shadowLanguage' | 'injectIntoContractPath' | 'injectIntoContractName'>} shadowOptions - Shadow-specific options
 * @param {import('@tevm/logger').Logger} logger - Logger instance
 * @returns {import('./CompileSourceResult.js').CompileSourceResult<TCompilationOutput>}
 */
export const compileSourceWithShadowInternal = (solc, source, shadow, validatedOptions, shadowOptions, logger) => {
	// We compile the source with an anonymous source file path that will be stripped out from the result
	const { compilationResult, ...output } = compileSourcesWithShadowInternal(
		solc,
		{ [defaults.injectIntoContractPath]: source },
		shadow,
		validatedOptions,
		shadowOptions,
		logger,
	)

	// Get the first (and only) compilation result
	const sourceCompilationResult = Object.values(compilationResult)[0]
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
