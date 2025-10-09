import type { CompilationOutputOption } from './CompilationOutputOption.js'
import type { CompileContractsResult } from './internal/CompileContractsResult.js'

export interface CompileFilesResult<
	TCompilationOutput extends CompilationOutputOption[] | undefined = CompilationOutputOption[] | undefined,
	TFilePaths extends string[] = string[],
> extends CompileContractsResult<TCompilationOutput, TFilePaths> {}
