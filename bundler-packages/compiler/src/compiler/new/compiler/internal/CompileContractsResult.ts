import type { CompilationOutputOption } from '../CompilationOutputOption.js'
import type { CompileBaseResult } from '../CompileBaseResult.js'
import type { CompiledSource } from './CompiledSource.js'

/**
 * Result of compiling Solidity source code
 * - input: Map of file paths to source code (same as ExtractContractsFromAstResult)
 * - output: Nested structure with both per-file ASTs and per-contract artifacts
 *
 * @example
 * {
 *   "contracts/Main.sol": {
 *     ast: {...},
 *     id: 0,
 *     contract: {
 *       "Main": { abi: [...], bytecode: "0x..." }
 *     }
 *   },
 *   "contracts/Lib.sol": {
 *     ast: {...},
 *     id: 1,
 *     contract: {
 *       "Lib": { abi: [...], bytecode: "0x..." }
 *     }
 *   }
 * }
 */
export interface CompileContractsResult<
	TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
	TSourcePaths extends string[] = string[],
> extends CompileBaseResult {
	compilationResult: {
		[sourcePath in TSourcePaths & string]: CompiledSource<TCompilationOutput>
	}
}
