import type { CompilationOutputOption } from '../CompilationOutputOption.js'
import type { CompileBaseOptions } from '../CompileBaseOptions.js'

export type ValidatedCompileBaseOptions<
	TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
> = RequiredNonNullable<
	CompileBaseOptions<TCompilationOutput>,
	'language' | 'compilationOutput' | 'hardfork' | 'solcVersion'
>

type RequiredNonNullable<T, K extends keyof T> = Omit<T, K> & {
	[P in K]-?: NonNullable<T[P]>
}
