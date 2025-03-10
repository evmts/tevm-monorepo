// TODO move this to errors package
export class MissingAccountError extends Error {
	/**
	 * @type {'MissingAccountError'}
	 */
	_tag = 'MissingAccountError'
	/**
	 * @type {'MissingAccountError'}
	 * @override
	 */
	name = 'MissingAccountError'
}

/**
 * Creates a handler for the `eth_sign` JSON-RPC method that signs messages using the specified accounts
 * 
 * This handler implements personal message signing as defined in EIP-191. It signs a message with the
 * private key of the specified account. The message is prefixed with "\x19Ethereum Signed Message:\n"
 * followed by the length of the message.
 * 
 * @param {{accounts: ReadonlyArray<import('@tevm/utils').HDAccount>}} params - Configuration options
 * @param {ReadonlyArray<import('@tevm/utils').HDAccount>} params.accounts - Array of HD accounts that can be used for signing
 * @returns {import('./EthHandler.js').EthSignHandler} A handler function for eth_sign requests
 * @throws {MissingAccountError} If the requested account is not found in the provided accounts list
 * 
 * @example
 * ```javascript
 * import { ethSignHandler } from '@tevm/actions'
 * import { mnemonicToAccount } from '@tevm/utils'
 * 
 * // Create accounts from a mnemonic
 * const mnemonic = 'test test test test test test test test test test test junk'
 * const accounts = Array.from(Array(10).keys()).map(
 *   (i) => mnemonicToAccount(mnemonic, { addressIndex: i })
 * )
 * 
 * // Create the handler
 * const handler = ethSignHandler({ accounts })
 * 
 * // Sign a message
 * try {
 *   const signature = await handler({
 *     address: accounts[0].address,
 *     data: '0x48656c6c6f20576f726c64' // "Hello World" in hex
 *   })
 *   
 *   console.log('Signature:', signature)
 *   // e.g., 0x8f35e1622e7afb386db48cfca2c2ee0bc34a7d23c0d7d4a270cdf8e405a4b4a72d03884954a56f119d190875f7c2b064c41f361ef7a54deeba88c4c7ce793bc81c
 * } catch (error) {
 *   if (error.name === 'MissingAccountError') {
 *     console.error('Account not found:', error.message)
 *   } else {
 *     console.error('Unexpected error:', error)
 *   }
 * }
 * ```
 */
export const ethSignHandler = ({ accounts }) => {
	const accountsByAddress = Object.fromEntries(accounts.map((account) => [account.address, account]))

	return async (params) => {
		// TODO validate params with zod
		const account = accountsByAddress[params.address]
		if (!account) {
			throw new MissingAccountError(`Account ${params.address} not found`)
		}
		return account.signMessage({ message: params.data })
	}
}
