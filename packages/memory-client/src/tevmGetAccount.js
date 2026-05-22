import { getAccountHandler } from '@tevm/actions'

/**
 * Tree-shakeable `tevmGetAccount` action. Returns balance, nonce, code, and optionally storage.
 *
 * With `returnStorage: true`, only storage that's already cached locally is returned (in fork mode,
 * uncached slots won't appear). Skip storage for contracts with large state for performance.
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {import('@tevm/actions').GetAccountParams} params - Get-account parameters.
 * @returns {Promise<import('@tevm/actions').GetAccountResult>} Account info including address, balance, nonce, code, and optionally storage.
 *
 * @example
 * ```typescript
 * import { tevmGetAccount } from 'tevm/actions'
 * import { createClient } from 'viem'
 * import { createTevmTransport } from 'tevm'
 *
 * const client = createClient({ transport: createTevmTransport() })
 * const account = await tevmGetAccount(client, {
 *   address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
 *   returnStorage: true,
 * })
 * ```
 *
 * @see [GetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountparams/)
 * @see [GetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountresult/)
 */
export const tevmGetAccount = async (client, params) => {
	return getAccountHandler(client.transport.tevm)(params)
}
