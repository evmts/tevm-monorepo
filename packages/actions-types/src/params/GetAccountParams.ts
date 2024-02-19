import type { Address } from '../common/index.js'
import type { BaseParams } from './BaseParams.js'

/**
 * Tevm params to get an account
 * @example
 * const getAccountParams: import('@tevm/api').GetAccountParams = {
 *   address: '0x...',
 * }
 */
export type GetAccountParams<TThrowOnFail extends boolean = boolean> =
	BaseParams<TThrowOnFail> & {
		/**
		 * Address of account
		 */
		address: Address
	}
