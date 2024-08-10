import { mineHandler } from '../Mine/mineHandler.js'

/**
 * @param {import("@tevm/node").TevmNode} client
 * @returns {Promise<{pendingClient: import("@tevm/node").TevmNode, blockHashes: Array<import('../common/Hex.js').Hex>, errors?: never} | {errors: Array<import('../Mine/TevmMineError.js').TevmMineError>}>}
 */
export const getPendingClient = async (client) => {
	// TODO we can do this using fork way more efficiently
	const pendingClient = await client.deepCopy()
	const txPool = await pendingClient.getTxPool()
	/**
	 * @type {Array<import('../common/Hex.js').Hex>}
	 */
	const blockHashes = []
	while (txPool.txsInPool > 0) {
		const { errors, blockHashes: newBlockHashes } = await mineHandler(pendingClient)({ throwOnFail: false })
		if (errors !== undefined) {
			return { errors }
		}
		blockHashes.push(...newBlockHashes)
	}
	return { pendingClient, blockHashes }
}
