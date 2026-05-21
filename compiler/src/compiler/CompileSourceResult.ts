import type { CompilationOutputOption } from './CompilationOutputOption.js'
import type { CompileBaseResult } from './CompileBaseResult.js'
import type { CompiledSource } from './internal/CompiledSource.js'

export interface CompileSourceResult<
	TCompilationOutput extends CompilationOutputOption[] | undefined = CompilationOutputOption[] | undefined,
> extends CompileBaseResult {
	compilationResult: CompiledSource<TCompilationOutput>
}
