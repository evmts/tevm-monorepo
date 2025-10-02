import { createLogger } from '@tevm/logger'
import { extractContractsFromAst } from './extractContractsFromAst.js'
import { compileContracts } from './internal/compileContracts.js'
import { defaults } from './internal/defaults.js'
import { getSolc } from './internal/getSolc.js'
import { validateBaseOptions } from './internal/validateBaseOptions.js'
import { validateShadowOptions } from './internal/validateShadowOptions.js'

// TODO: we need a parallel compileFilesWithShadow just like compileSource/compileFiles
/**
 * Compile a source with injected shadow code
 *
 * This function allows merging shadow contract code into the main source before compilation.
 *
 * Note: if the compiled source doesn't result in exactly one source file and one contract, this will throw an error as we cannot guess where to inject the shadow code.
 * We technically _could_ try but then it might accidentally compile with an incorrect mapping and result in inconsistencies that would be awful to debug.
 *
 * Correct usage is roughly:
 * - if using an AST source: provide the resulting contract's path and name so we know precisely where to inject
 * - if using a Solidity/Yul source that includes multiple contracts: provide the contract's name (there is no file path)
 * - if using a Solidity/Yul source that includes a single contract: you can safely omit the path and name, or be explicit about the contract name
 * @template TSourceLanguage extends import('@tevm/solc').SolcLanguage
 * @param {TSourceLanguage extends 'SolidityAST' ? import('solc-typed-ast').ASTNode | import('@tevm/solc').SolcAst : string} source - The main source code or AST to compile
 * @param {string} shadow - The shadow code to merge into the source
 * @param {Omit<import('./CompileBaseOptions.js').CompileBaseOptions, 'language'> & import('./CompileSourceWithShadowOptions.js').CompileSourceWithShadowOptions} [options]
 * @returns {Promise<import('./CompileSourceWithShadowResult.js').CompileSourceWithShadowResult>}
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
	const validatedShadowOptions = validateShadowOptions(
		{ shadowLanguage, injectIntoContractPath, injectIntoContractName },
		validatedOptions.language,
		logger,
	)

	const solc = await getSolc(validatedOptions.solcVersion, logger)

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

/**
 * Merge two ASTs into a single AST
 *
 * @param {import('solc-typed-ast').ASTNode | import('@tevm/solc').SolcAst} sourceAst - The main AST
 * @param {import('solc-typed-ast').ASTNode | import('@tevm/solc').SolcAst} shadowAst - The shadow AST to merge
 * @param {import('./internal/ValidatedCompileBaseOptions.js').ValidatedCompileBaseOptions} options
 * @param {import('@tevm/logger').Logger} logger - The logger
 * @returns {import('solc-typed-ast').ASTNode} The merged AST
 */
const mergeAsts = (sourceAst, shadowAst, options, logger) => {
	// TODO: Implement AST merging logic
	// This should:
	// 1. Parse both ASTs into universal format if needed (using ASTReader)
	// 2. Extract nodes from shadow AST (contracts, libraries, interfaces, etc.)
	// 3. Merge shadow nodes into source AST, handling:
	//    - Name conflicts: this should be a merge conflict strategy option like
	// 			shadowMergeStrategy:
	// 				'override'/'replace' |
	// 				'extend'/'safe' (rename to unique name) |
	// 				'insertBefore' (add inside the function at beginning) |
	// 				'insertAfter' (add inside the function at end but need to figure out how to do correctly in case there is a return or just put it before and that's it) |
	//				'insert' (and also pass a precise location to but the function body? but would need to accept pieces of code that's probably overkill)
	// 4. Return the merged AST
	return sourceAst
}
