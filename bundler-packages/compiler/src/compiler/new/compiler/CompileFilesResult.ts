import type { CompilationOutputOption } from './CompilationOutputOption.js'
import type { CompileContractsResult } from './internal/CompileContractsResult.js'

export interface CompileFilesResult<
	TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
	TFilePaths extends string[] = string[],
> extends CompileContractsResult<TCompilationOutput, TFilePaths> {}
