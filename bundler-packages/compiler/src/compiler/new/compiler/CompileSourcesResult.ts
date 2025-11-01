import type { CompilationOutputOption } from './CompilationOutputOption.js'
import type { CompileContractsResult } from './internal/CompileContractsResult.js'

/**
 * Result of compiling multiple sources with arbitrary paths
 *
 * This is an alias for CompileContractsResult, providing a clearer semantic meaning
 * when used in the context of compileSources vs compileFiles (filesystem-based)
 *
 * @template TCompilationOutput - Array of compilation output options or undefined
 * @template TSourcePaths - Array of source path strings
 */
export interface CompileSourcesResult<
	TCompilationOutput extends CompilationOutputOption[] | undefined = CompilationOutputOption[] | undefined,
	TSourcePaths extends string[] = string[],
> extends CompileContractsResult<TCompilationOutput, TSourcePaths> {}
