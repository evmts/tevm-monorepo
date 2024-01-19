import type { GetAccountParams, GetAccountResult } from '../index.js'

/**
 * Gets the state of a specific ethereum address
 * @example
 * const res = tevm.getAccount({address: '0x123...'})
 * console.log(res.deployedBytecode)
 * console.log(res.nonce)
 * console.log(res.balance)
 */
export type GetAccountHandler = (
	params: GetAccountParams,
) => Promise<GetAccountResult>
