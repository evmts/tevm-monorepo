import { MissingAccountError } from './ethSignHandler.js'

/**
 * Creates a handler for the `eth_signTransaction` JSON-RPC method that signs transactions using the specified accounts
 *
 * This handler enables signing Ethereum transactions without broadcasting them to the network. It creates an EIP-2930
 * transaction signature using the private key of the specified account. The handler automatically retrieves the
 * current chain ID from the node.
 *
 * @param {object} options - Configuration options for the handler
 * @param {ReadonlyArray<import('@tevm/utils').HDAccount | import('@tevm/utils').NativeHDAccount>} options.accounts - Array of HD accounts that can be used for signing
 * @param {() => Promise<number>} options.getChainId - Function to retrieve the current chain ID
 * @returns {import('./EthHandler.js').EthSignTransactionHandler} A handler function for eth_signTransaction requests
 * @throws {MissingAccountError} If the requested account (from address) is not found in the provided accounts list
 *
 * @example
 * ```javascript
 * import { ethSignTransactionHandler } from '@tevm/actions'
 * import { nativeMnemonicToAccount, parseGwei } from '@tevm/utils'
 *
 * // Create accounts from a mnemonic
 * const mnemonic = 'test test test test test test test test test test test junk'
 * const accounts = Array.from(Array(10).keys()).map(
 *   (i) => nativeMnemonicToAccount(mnemonic, { addressIndex: i })
 * )
 *
 * // Create the handler
 * const handler = ethSignTransactionHandler({
 *   accounts,
 *   getChainId: async () => 1 // Mainnet
 * })
 *
 * // Sign a transaction
 * try {
 *   const signedTx = await handler({
 *     from: accounts[0].address,
 *     to: '0x1234567890123456789012345678901234567890',
 *     value: 1000000000000000000n, // 1 ETH
 *     gas: 21000n,
 *     gasPrice: parseGwei('20'),
 *     nonce: 0n,
 *     data: '0x'
 *   })
 *
 *   console.log('Signed transaction:', signedTx)
 *   // Can be used with eth_sendRawTransaction
 * } catch (error) {
 *   if (error.name === 'MissingAccountError') {
 *     console.error('Account not found:', error.message)
 *   } else {
 *     console.error('Unexpected error:', error)
 *   }
 * }
 * ```
 */
export const ethSignTransactionHandler = ({ getChainId, accounts }) => {
	const accountsByAddress = Object.fromEntries(accounts.map((account) => [account.address, account]))

	return async ({ nonce, ...params }) => {
		// TODO validate params with zod
		const account = accountsByAddress[params.from]
		if (!account) {
			throw new MissingAccountError(`Account ${params.from} not found`)
		}
		return account.signTransaction({
			...params,
			type: 'eip2930',
			chainId: Number(await getChainId()),
			...(typeof nonce === 'bigint' ? { nonce: Number(nonce) } : {}),
		})
	}
}
