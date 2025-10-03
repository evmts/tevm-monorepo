import { createLogger } from '@tevm/logger'
import { compileSourceInternal } from './compileSource.js'
import { extractContractsFromAst } from './extractContractsFromAst.js'
import { compileContracts } from './internal/compileContracts.js'
import { defaults } from './internal/defaults.js'
import { CompilerOutputError } from './internal/errors.js'
import { getSolc } from './internal/getSolc.js'
import { instrumentAst } from './internal/instrumentAst.js'
import { validateBaseOptions } from './internal/validateBaseOptions.js'
import { validateShadowOptions } from './internal/validateShadowOptions.js'

// TODO: we need a parallel compileFilesWithShadow just like compileSource/compileFiles
/**
 * Compile a source with injected shadow code
 *
 * This function allows merging shadow contract code into the main source before compilation.
 *
 * TODO: explain roughly the steps here
 *
 * TODO: this is 3 compilations which is too much (1. compile source to instrument it 2. compile source AND shadow together to be able to inject shadow ast into source ast 3. compile the new shadowed contract to return)
 * Easy way to avoid one compilation is to directly return after step 2, shadowed contract would be actually the shadow contract that inherits from the target contract
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
 * @template TSourceLanguage extends import('@tevm/solc').SolcLanguage
 * @param {TSourceLanguage extends 'SolidityAST' ? import('./AstInput.js').AstInput : string} source - The main source code or AST to compile
 * @param {string} shadow - The shadow code to merge into the source
 * @param {Omit<import('./CompileBaseOptions.js').CompileBaseOptions, 'language'> & import('./CompileSourceWithShadowOptions.js').CompileSourceWithShadowOptions} [options]
 * @returns {Promise<import('./CompileSourceResult.js').CompileSourceResult>}
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

	// First step is to get the source AST in order to instrument it (make internal stuff public, mark functions as virtual, etc.)
	let astSource =
		validatedOptions.language === 'SolidityAST' ? /** @type {import('./AstInput.js').AstInput} */ (source) : undefined
	// If the source is a string (single file containing one or multiple contracts) we need to compile it
	if (!astSource) {
		// TODO: comment this, see 4th solution in comment below
		const { compilationResult } = compileContracts(
			{ [defaults.injectIntoContractPath]: /** @type {string} */ (source) },
			solc,
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

	const validatedShadowOptions = validateShadowOptions(
		[astSource],
		{ shadowLanguage, injectIntoContractPath, injectIntoContractName },
		validatedOptions.language,
		false, // don't validate path as we're using a single source
		logger,
	)
	const astSourceNode = /** @type {import('solc-typed-ast').SourceUnit} */ (validatedShadowOptions.astSourceNodes[0])

	const soliditySourceCode =
		validatedOptions.language === 'SolidityAST'
			? extractContractsFromAst(astSource, validatedOptions)
			: /** @type {string} */ (source)

	// Get the precise location of the last child in the source contract
	const lastChildNodeInfo = astSourceNode.vContracts.find(
		(contract) => contract.name === validatedShadowOptions.injectIntoContractName,
	)?.lastChild?.sourceInfo
	if (!lastChildNodeInfo) {
		const err = new CompilerOutputError('Source contract does not contain any children', {
			meta: { code: 'missing_source_output' },
		})
		logger.error(err.message)
		throw err
	}
	const lastChildNodeEnd = lastChildNodeInfo.offset + lastChildNodeInfo.length

	if (validatedShadowOptions.shadowMergeStrategy === 'safe') {
		const shadowedSoliditySource = `${soliditySourceCode.slice(0, lastChildNodeEnd)}\n\n${shadow}\n\n${soliditySourceCode.slice(lastChildNodeEnd)}`
		return compileSourceInternal(solc, shadowedSoliditySource, validatedOptions, logger)
	}

	// shadowMergeStrategy = 'replace'
	// TODO: what we explained below in 4. & comment
	const instrumentedSourceAst = instrumentAst(
		astSourceNode,
		{
			markFunctionsAsVirtual: true,
			contractFilter: validatedShadowOptions.injectIntoContractName,
		},
		logger,
	)
	const instrumentedSoliditySource = extractContractsFromAst(instrumentedSourceAst, validatedOptions)
	// TODO: we absolutely can't do that, we need to map original code <-> instrumented code locations like scribble does
	const shadowedSoliditySource = `${instrumentedSoliditySource.slice(0, lastChildNodeEnd)}\n\n${shadow}\n\n${instrumentedSoliditySource.slice(lastChildNodeEnd)}`
	return compileSourceInternal(solc, shadowedSoliditySource, validatedOptions, logger)

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
	//   - TODO: we can mark all source functions as virtual BUT we'll need to mark shadow functions IF the collide as override, but how to know
	//   -> best way here probably is to
	//     - tell in documentation to add override if using any other strategy than safe
	//     - if there is a collision AND strategy is not safe log a warning 'did you forget to add an override on a shadow function that needs a special merging strategy'
	//   - ...?
	//   - get the source code back from this
	// - compile the new instrumentated source with shadow stuff so it wont error and we'll correctly get
	//   - the target normal ast we had originally into which we'll actually inject using
	//   - the shadow related stuff (any new ids?) that we can add/replace/insert whatever it is into the above
	// TODO: new
	// 1. Compile the sources
	// 2. Validate (including the contract name now that we know it)
	// 3. Insert shadow code at the end of the contract
	//  // Get the last child node
	//  const allChildren = targetContract.children;
	//  const lastChild = allChildren[allChildren.length - 1];

	//  // Parse the src property: "startIndex:length:fileIndex"
	//  const [startStr, lengthStr] = lastChild.src.split(':');
	//  const start = parseInt(startStr, 10);
	//  const length = parseInt(lengthStr, 10);
	//  const endPosition = start + length;

	//  // Inject after the last child (still inside the contract)
	//  const originalSource = /* read original file */;
	//  const modifiedSource =
	// 		 originalSource.slice(0, endPosition) +
	// 		 '\n\n' + shadowCodeString + '\n' +
	// 		 originalSource.slice(endPosition);
	// 4. Compile everything...

	// const solc = await getSolc(validatedOptions.solcVersion, logger)
	// Here we compile the shadow contract alongside the sources with the target as a base contract inherited
	// by the shadow wrapper
	// This way, the shadow code can access and use any function or variable internal to this
	// const { compilationResult } = compileContracts(
	// 	{ ...soliditySources, ...shadowSource },
	// 	solc,
	// 	validatedOptions,
	// 	logger,
	// )
	// const contract = compilationResult[validatedShadowOptions.injectIntoContractPath]

	// 1. Compile source to ast if needed
	// 2. Check if there are multiple contract files & error if no source path provided initially
	// 3. Check if there are multiple contracts & error if no contract name provided initially
	// 4. TODO: how do we compile the ast of the shadow method(s) as it's not a full contract?
	// 5. Merge ASTs
	// 6. Generate Solidity source from merged AST
	// 7. Compile the merged source
	// 8. We should try to understand some possible errors to provide a friendly error message,
	// e.g. if using a variable that does not exist (how can we detect error kinds, see in solc docs) add a hint "did you want to inject a new state variable?"
}
