import { setAccountHandler } from '@tevm/actions'

/**
 * Tree-shakeable `tevmSetAccount` action. Directly sets account balance, nonce, bytecode, and/or
 * storage without a transaction — useful for test fixtures and edge-case setups.
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {import('@tevm/actions').SetAccountParams} params - Parameters for setting the account.
 * @returns {Promise<import('@tevm/actions').SetAccountResult>} Result of the set-account operation.
 *
 * @example
 * ```typescript
 * import { tevmSetAccount } from 'tevm/actions'
 * import { createClient, parseEther } from 'viem'
 * import { createTevmTransport } from 'tevm'
 *
 * const client = createClient({ transport: createTevmTransport() })
 * await tevmSetAccount(client, {
 *   address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
 *   balance: parseEther('100'),
 *   nonce: 0n,
 * })
 * ```
 *
 * @throws Will throw if the address or hex inputs (bytecode, storage keys/values) are invalid.
 *
 * @see [SetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountparams/)
 * @see [SetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountresult/)
 */
export const tevmSetAccount = async (client, params) => {
	return setAccountHandler(client.transport.tevm)(params)
}
