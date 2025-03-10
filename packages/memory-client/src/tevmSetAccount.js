import { setAccountHandler } from '@tevm/actions'

/**
 * A tree-shakeable version of the `tevmSetAccount` action for viem.
 * Sets the account in TEVM.
 *
 * This function allows you to set various properties of an account in TEVM, such as its balance, nonce, contract deployedBytecode, and storage state.
 * It is a powerful tool for setting up test environments and manipulating accounts for advanced scenarios.
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client - The viem client configured with TEVM transport.
 * @param {import('@tevm/actions').SetAccountParams} params - Parameters for setting the account.
 * @returns {Promise<import('@tevm/actions').SetAccountResult>} The result of setting the account.
 *
 * @example
 * ```typescript
 * import { tevmSetAccount } from 'tevm/actions'
 * import { createClient, http } from 'viem'
 * import { optimism } from 'tevm/common'
 * import { createTevmTransport } from 'tevm'
 * import { numberToHex } from '@tevm/utils'
 * import { SimpleContract } from 'tevm/contract'
 *
 * const client = createClient({
 *   transport: createTevmTransport({
 *     fork: { transport: http('https://mainnet.optimism.io')({}) }
 *   }),
 *   chain: optimism,
 * })
 *
 * async function example() {
 *   await tevmSetAccount(client, {
 *     address: `0x${'0123'.repeat(10)}`,
 *     balance: 100n,
 *     nonce: 1n,
 *     deployedBytecode: SimpleContract.deployedBytecode,
 *     state: {
 *       [`0x${'0'.repeat(64)}`]: numberToHex(420n),
 *     },
 *   })
 *   console.log('Account set')
 * }
 *
 * example()
 * ```
 *
 * @see [SetAccountParams](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountparams/) for options reference.
 * @see [SetAccountResult](https://tevm.sh/reference/tevm/actions/type-aliases/setaccountresult/) for return values reference.
 * @see [TEVM Actions Guide](https://tevm.sh/learn/actions/)
 */
export const tevmSetAccount = async (client, params) => {
	return setAccountHandler(client.transport.tevm)(params)
}
