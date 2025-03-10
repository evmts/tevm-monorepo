import { getAccountHandler } from '@tevm/actions'

/**
 * A tree-shakeable version of the `tevmGetAccount` action for viem.
 * Retrieves the account information from TEVM.
 *
 * This function allows you to retrieve information about an account, including its address and optionally its contract storage.
 * The `returnStorage` parameter determines whether the contract storage should be returned. Note that it only returns the storage that is cached in the VM.
 * In fork mode, if the storage hasn't been cached yet, it will not be returned. This defaults to `false`.
 * Be aware that returning storage can be very expensive if a contract has a lot of storage.
 *
 * @param {import from "./MemoryClient.js"').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {import('@tevm/actions').GetAccountParams} params - Parameters for retrieving the account information.
 * @returns {Promise<import('@tevm/actions').GetAccountResult>} The account information.
 *
 * @example
 * ```typescript
 * import { tevmGetAccount } from 'tevm/actions'
 * import { createClient, http } from 'viem'
 * import { optimism } from 'tevm/common'
 * import { createTevmTransport } from 'tevm'
 *
 * const client = createClient({
 *   transport: createTevmTransport({
 *     fork: { transport: http('https://mainnet.optimism.io')({}) }
 *   }),
 *   chain: optimism,
 * })
 *
 * async function example() {
 *   const account = await tevmGetAccount(client, {
 *     address: '0x123...',
 *     returnStorage: true,
 *   })
 *   console.log(account)
 * }
 *
 * example()
 * ```
 *
 * @see [GetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountparams/) for options reference.
 * @see [GetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/getaccountresult/) for return values reference.
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 */
export const tevmGetAccount = async (client, params) => {
	return getAccountHandler(client.transport.tevm)(params)
}
