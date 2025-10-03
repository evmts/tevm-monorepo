import type { SolcLanguage } from '@tevm/solc'
import type { CompilationOutputOption } from '../CompilationOutputOption.js'
import type { CompileBaseOptions } from '../CompileBaseOptions.js'

export type ValidatedCompileBaseOptions<
	TLanguage extends SolcLanguage = SolcLanguage,
	TCompilationOutput extends CompilationOutputOption[] = CompilationOutputOption[],
> = RequiredNonNullable<
	CompileBaseOptions<TLanguage, TCompilationOutput>,
	'language' | 'compilationOutput' | 'hardfork' | 'solcVersion' | 'throwOnVersionMismatch' | 'throwOnCompilationError'
>

type RequiredNonNullable<T, K extends keyof T> = Omit<T, K> & {
	[P in K]-?: NonNullable<T[P]>
}
