import type { Address } from 'abitype'

/**
 * Tevm params to get an account
 * @example
 * const getAccountParams: import('@tevm/api').GetAccountParams = {
 *   address: '0x...',
 * }
 */
export type GetAccountParams = {
	/**
	 * Address of account
	 */
	address: Address
}
