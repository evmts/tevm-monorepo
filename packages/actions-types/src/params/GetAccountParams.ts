import type { Address } from '../common/index.js'
import type { BaseParams } from './BaseParams.js'

/**
 * Tevm params to get an account
 * @example
 * const getAccountParams: import('@tevm/api').GetAccountParams = {
 *   address: '0x...',
 * }
 */
export type GetAccountParams<TThrowOnFail extends boolean = boolean> = BaseParams<TThrowOnFail> & {
	/**
	 * Address of account
	 */
	address: Address
	/**
	 * If true the handler will return the contract storage
	 * It only returns storage that happens to be cached in the vm
	 * In fork mode if storage hasn't yet been cached it will not be returned
	 * This defaults to false
	 * Be aware that this can be very expensive if a contract has a lot of storage
	 */
	returnStorage?: boolean
}
