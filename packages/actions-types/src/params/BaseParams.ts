/**
 * The base parameters shared across all actions
 */
export type BaseParams<TThrowOnFail extends boolean = boolean> = {
	/**
	 * Whether to throw on errors or return errors as value on the 'errors' property
	 * Defaults to `true`
	 */
	throwOnFail?: TThrowOnFail
}
