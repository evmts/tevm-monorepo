import type { CompileSourceWithShadowOptions } from '../CompileSourceWithShadowOptions.js'

export type ValidatedShadowOptions = RequiredNonNullable<
	CompileSourceWithShadowOptions,
	'sourceLanguage' | 'shadowLanguage' | 'injectIntoContractPath'
>

type RequiredNonNullable<T, K extends keyof T> = Omit<T, K> & {
	[P in K]-?: NonNullable<T[P]>
}
