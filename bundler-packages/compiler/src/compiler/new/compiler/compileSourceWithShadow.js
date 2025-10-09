import { createLogger } from '@tevm/logger'
import { compileSourceInternal } from './compileSource.js'
import { extractContractsFromAstNodes } from './extractContractsFromAstNodes.js'
import { compileContracts } from './internal/compileContracts.js'
import { defaults } from './internal/defaults.js'
import { AstParseError, CompilerOutputError } from './internal/errors.js'
import { getSolc } from './internal/getSolc.js'
import { instrumentAst } from './internal/instrumentAst.js'
import { validateBaseOptions } from './internal/validateBaseOptions.js'
import { validateShadowOptions } from './internal/validateShadowOptions.js'
import { solcSourcesToAstNodes } from './solcSourcesToAstNodes.js'

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
	let astSource =
		validatedOptions.language === 'SolidityAST' ? /** @type {import('@tevm/solc').SolcAst} */ (source) : undefined
	// If the source is a string (single file containing one or multiple contracts) we need to compile it
	if (!astSource) {
		const { compilationResult } = compileContracts(
			solc,
			{ [defaults.injectIntoContractPath]: source },
			{ ...validatedOptions, compilationOutput: ['ast'], throwOnCompilationError: true },
			logger,
		)
		astSource = compilationResult[defaults.injectIntoContractPath]?.ast
		// This should not happen, otherwise a compilation error would have been thrown
		if (!astSource) {
			const err = new CompilerOutputError('Source output not found', {
				meta: { code: 'missing_source_output' },
			})
			logger.error(err.message)
			throw err
		}
	}

	const astSourceNodes = solcSourcesToAstNodes(
		{ [astSource.absolutePath]: { ast: astSource, id: astSource.id } },
		logger,
	)
	const validatedShadowOptions = validateShadowOptions(
		astSourceNodes,
		shadowOptions,
		validatedOptions.language,
		false, // don't validate path as we're using a single source
		logger,
	)
	const astSourceNode = /** @type {import('solc-typed-ast').SourceUnit} */ (astSourceNodes[0])

	const soliditySourceCode =
		validatedOptions.language === 'SolidityAST'
			? extractContractsFromAstNodes([astSourceNode], validatedOptions).sources[astSourceNode.absolutePath]
			: /** @type {string} */ (source)
	if (!soliditySourceCode) {
		const err = new CompilerOutputError('Source output not found', {
			meta: { code: 'missing_source_output' },
		})
		logger.error(err.message)
		throw err
	}

	// Get the target contract's last child node to know where to inject the shadow code
	const lastChildNode = astSourceNode.vContracts.find(
		(contract) => contract.name === validatedShadowOptions.injectIntoContractName,
	)?.lastChild

	if (!lastChildNode) {
		const err = new AstParseError('Source contract does not contain any children', {
			meta: { code: 'invalid_source_ast' },
		})
		logger.error(err.message)
		throw err
	}

	if (validatedShadowOptions.shadowMergeStrategy === 'safe') {
		// Here the contract is unmodified so we can inject into the original source locations
		const lastChildNodeEnd = lastChildNode.sourceInfo.offset + lastChildNode.sourceInfo.length
		const shadowedSoliditySource = `${soliditySourceCode.slice(0, lastChildNodeEnd)}\n\n${shadow}\n\n${soliditySourceCode.slice(lastChildNodeEnd)}`

		logger.debug(`Compiling source with shadow code injected in safe mode`)
		return compileSourceInternal(solc, shadowedSoliditySource, { ...validatedOptions, language: 'Solidity' }, logger)
	}

	// shadowMergeStrategy = 'replace'
	// Instrument the source AST to make functions overrideable by shadow methods
	const instrumentedSourceAst = instrumentAst(
		astSourceNode,
		{
			markFunctionsAsVirtual: true,
			contractFilter: validatedShadowOptions.injectIntoContractName,
		},
		logger,
	)

	const { sources, sourceMaps } = extractContractsFromAstNodes([instrumentedSourceAst], {
		...validatedOptions,
		withSourceMap: true,
	})

	const instrumentedSoliditySource = sources[instrumentedSourceAst.absolutePath]
	const instrumentedMap = sourceMaps[instrumentedSourceAst.absolutePath]
	if (!instrumentedSoliditySource || !instrumentedMap) {
		const err = new CompilerOutputError('Source output not found', {
			meta: { code: 'missing_source_output' },
		})
		logger.error(err.message)
		throw err
	}

	// Look up the lastChild node in the instrumented map to get its new location
	const instrumentedLocation = instrumentedMap.get(lastChildNode)
	if (!instrumentedLocation) {
		const err = new AstParseError('Failed to locate injection point in instrumented code', {
			meta: { code: 'invalid_instrumented_ast' },
		})
		logger.error(err.message)
		throw err
	}

	// Now we can safely inject shadow code at the correct location
	const lastChildNodeEnd = instrumentedLocation[0] + instrumentedLocation[1]
	const shadowedSoliditySource = `${instrumentedSoliditySource.slice(0, lastChildNodeEnd)}\n\n${shadow}\n\n${instrumentedSoliditySource.slice(lastChildNodeEnd)}`
	return compileSourceInternal(solc, shadowedSoliditySource, { ...validatedOptions, language: 'Solidity' }, logger)

	// Wrap the shadow body into a temporary contract that inherits from the target contract so it can be compiled to
	// get an AST we can manipulate for correctly actually merging into the contract directly
	// Otherwise, we couldn't compile the shadow body on its own and access the target contract nodes
	// const shadowSource = createShadowContract(
	// 	shadow,
	// 	validatedShadowOptions.injectIntoContractPath,
	// 	validatedShadowOptions.injectIntoContractName,
	// )

	// There are multiple ways to inject the shadow contract into the target contract:
	// 1. Use regex to retrieve the end of the contract and inject shadow code in there
	//   - this one is pretty unreliable and inelegant
	// 2. Wrap the shadow code into a temporary contract that inherits the target contract, compile to get the AST,
	// then use solc-typed-ast to reliably insert the shadow code into the target contract, then convert the target contract
	// back to code and compile it to get the actual target with inlined shadow code
	//   - the issue here is that the behavior in an inherited contract is different that inside the contract, e.g. we cannot access
	//   internal variables/functions, we cannot replace or inject into existing methods, etc.
	//   - but this is the correct way of doing things reliably with convenient manipulation, and the only way to have a merge strategy,
	//   e.g. replacing a method or injecting into its body
	// 3. Compile the source code to get the AST and use it to figure out reliably the location of the last child in the target contract,
	// then inject shadow code directly after it
	//   - the issue is without the shadow-related AST we cannot have any complex merge strategy
	//   - but this is the only way to have an identical behavior as if the code was directly inside the target contract, which is the
	//   way this is presented and expected from the consumer
	// 4?. or maybe:
	// - compile the source ast
	//   - make all private stuff public
	//   - mark all functions as virtual
	//   - note/warn that we can only inject in a contract, no library (can't inherit)
	//   - tell in documentation to add override if using any other strategy than safe
	//   - if there is a collision AND strategy is not safe log a warning 'did you forget to add an override on a shadow function that needs a special merging strategy'
	// - compile the new instrumentated source with shadow stuff so it wont error and we'll correctly get
	//   - the target normal ast we had originally into which we'll actually inject using
	//   - the shadow related stuff (any new ids?) that we can add/replace/insert whatever it is into the above
}
