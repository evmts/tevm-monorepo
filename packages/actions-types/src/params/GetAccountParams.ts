import type { Address } from '../common/index.js'

/**
 * Tevm params to get an account
 * @example
 * const getAccountParams: import('@tevm/api').GetAccountParams = {
 *   address: '0x...',
 * }
 */
export type GetAccountParams<TThrowOnFail extends boolean = boolean> = {
	/**
	 * Whether to throw on errors or return errors as value on the 'errors' property
	 * Defaults to `true`
	 */
	throwOnFail?: TThrowOnFail
	/**
	 * Address of account
	 */
	address: Address
}
