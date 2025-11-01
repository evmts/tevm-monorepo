import { createLogger } from '@tevm/logger'
import { compileContracts } from './internal/compileContracts.js'
import { defaults } from './internal/defaults.js'
import { getSolc } from './internal/getSolc.js'
import { validateBaseOptions } from './internal/validateBaseOptions.js'

/**
 * Compile multiple sources with arbitrary paths
 *
 * This function compiles a mapping of source paths to source code/AST.
 * Unlike compileFiles, the paths do not need to correspond to filesystem paths.
 *
 * All sources must be the same language (Solidity, Yul, or SolidityAST).
 *
 * @template {import('@tevm/solc').SolcLanguage} TLanguage
 * @template {import('./CompilationOutputOption.js').CompilationOutputOption[] | undefined} TCompilationOutput
 * @param {Record<string, TLanguage extends 'SolidityAST' ? import('@tevm/solc').SolcAst : string>} sources - Mapping of source paths to source code/AST
 * @param {import('./CompileBaseOptions.js').CompileBaseOptions<TLanguage, TCompilationOutput>} [options]
 * @returns {Promise<import('./CompileSourcesResult.js').CompileSourcesResult<TCompilationOutput>>}
 *
 * @example
 * import { compileSources } from '@tevm/compiler'
 *
 * const result = await compileSources({
 *   'contracts/Token.sol': 'contract Token { uint256 public totalSupply; }',
 *   'contracts/Library.sol': 'library Math { function add(uint a, uint b) internal pure returns (uint) { return a + b; } }'
 * }, {
 *   language: 'Solidity',
 *   solcVersion: '0.8.20',
 *   compilationOutput: ['abi', 'evm.bytecode']
 * })
 *
 * const tokenAbi = result.compilationResult['contracts/Token.sol'].contract['Token'].abi
 * const libraryBytecode = result.compilationResult['contracts/Library.sol'].contract['Math'].evm.bytecode
 *
 * @example
 * import { compileSources } from '@tevm/compiler'
 *
 * const result = await compileSources({
 *   'Main.sol': mainAst,
 *   'Helper.sol': helperAst
 * }, {
 *   language: 'SolidityAST',
 *   solcVersion: '0.8.20'
 * })
 *
 * const mainContracts = result.compilationResult['Main.sol'].contract
 */
export const compileSources = async (sources, options) => {
	const logger = createLogger({ name: '@tevm/compiler', level: options?.loggingLevel ?? defaults.loggingLevel })
	const validatedOptions = validateBaseOptions(Object.values(sources), options ?? {}, logger)
	const solc = await getSolc(validatedOptions.solcVersion, logger)

	return compileContracts(solc, sources, validatedOptions, logger)
}
