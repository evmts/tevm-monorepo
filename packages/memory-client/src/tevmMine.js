import { mineHandler } from '@tevm/actions'

/**
 * A tree shakeable version of the tevmMine action for viem.
 * Mines blocks in TEVM.
 *
 * @param {import('viem').Client<import('./TevmTransport.js').TevmTransport<string>>} client
 * @param {import('@tevm/actions').MineParams} [params]
 * @returns {Promise<import('@tevm/actions').MineResult>} The result of mining blocks.
 */
export const tevmMine = async (client, params) => {
	return mineHandler(client.transport.tevm)(params)
}
