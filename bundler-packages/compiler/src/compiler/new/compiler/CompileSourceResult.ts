import type { CompilationOutputOption } from './CompilationOutputOption.js'
import type { CompileContractsResult } from './internal/CompileContractsResult.js'

export interface CompileSourceResult<TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[]>
	extends CompileContractsResult<TCompilationOutput> {}
