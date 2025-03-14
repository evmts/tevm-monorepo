import { mineHandler } from '../Mine/mineHandler.js'

/**
 * @internal
 * Handle gas mining based on gas threshold configuration
 * @param {import("@tevm/node").TevmNode} client
 * @param {import("viem").Hex} txHash Transaction hash that triggered gas mining
 * @returns {Promise<{blockHashes?: undefined, errors?: import('../Mine/TevmMineError.js').TevmMineError[]} | undefined>}
 * @throws {never} returns errors as values
 */
export const handleGasMining = async (client, txHash) => {
	if (client.miningConfig.type === 'gas') {
		client.logger.debug(`Gas mining transaction ${txHash}...`)
		const mineRes = await mineHandler(client)({ throwOnFail: false })
		if (mineRes.errors?.length) {
			return mineRes
		}
		client.logger.debug(mineRes, 'Transaction successfully mined via gas mining')
	}
	return undefined
}
