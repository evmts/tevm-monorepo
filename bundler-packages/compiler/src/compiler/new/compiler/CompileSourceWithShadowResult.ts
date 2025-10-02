import type { CompilationOutputOption } from './CompilationOutputOption.js'
import type { CompileContractsResult } from './internal/CompileContractsResult.js'

export interface CompileSourceWithShadowResult<
	TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
> extends CompileContractsResult<TCompilationOutput> {}
