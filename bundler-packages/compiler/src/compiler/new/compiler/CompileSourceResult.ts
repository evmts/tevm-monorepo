import type { CompilationOutputOption } from './CompilationOutputOption.js'
import type { CompileBaseResult } from './CompileBaseResult.js'
import type { CompiledSource } from './internal/CompiledSource.js'

export interface CompileSourceResult<TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[]>
	extends CompileBaseResult {
	compilationResult: CompiledSource<TCompilationOutput>
}
