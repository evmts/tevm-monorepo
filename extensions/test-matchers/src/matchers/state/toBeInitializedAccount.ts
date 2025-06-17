import { getAccountHandler } from '@tevm/actions'
import { type TevmNode, createTevmNode } from '@tevm/node'
import { type Address, type Client, isAddress } from 'viem'
import type { ContainsAddress } from '../../common/types.js'

/**
 * Checks if an account is initialized in the TEVM state.
 * An account is considered initialized if it has a nonce, balance, storage root, or code hash.
 *
 * @param {Address | ContainsAddress} received The address or an object containing the address to check.
 * @param {Client} client The TEVM client instance.
 * @returns {Promise<MatcherResult>} The matcher result.
 */
export const toBeInitializedAccount = async (received: Address | ContainsAddress, client: Client | TevmNode) => {
	const address = typeof received === 'string' ? received : received.address
	if (!isAddress(address)) throw new Error(`Invalid address: ${address}`)

	const node = 'request' in client ? createTevmNode({ fork: { transport: client } }) : client
	const account = await getAccountHandler(node, { throwOnFail: false })({ address })

	const pass = account.errors === undefined

	return {
		pass,
		message: () =>
			pass
				? `Expected account ${address} not to be initialized`
				: `Expected account ${address} to be initialized but received:\n\n${account.errors?.[0]?.message}`,
		actual: account,
	}
}
