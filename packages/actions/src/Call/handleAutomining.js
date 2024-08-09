import { mineHandler } from '../Mine/mineHandler.js'

/**
 * @internal
 * Runs the mining logic if the client is set to automine
 * @param {import("@tevm/node").TevmNode} client
 * @param {import("viem").Hex} [txHash]
 * @returns {Promise<{blockHashes?: undefined, errors?: import('../Mine/TevmMineError.js').TevmMineError[]} | undefined>} undefined if noop, errors if automining fails, blockHashes if automining succeeds
 * @throws {never} returns errors as values
 */
export const handleAutomining = async (client, txHash) => {
	if (client.miningConfig.type === 'auto') {
		client.logger.debug(`Automining transaction ${txHash}...`)
		const mineRes = await mineHandler(client)({ throwOnFail: false })
		if (mineRes.errors?.length) {
			return mineRes
		}
		client.logger.debug(mineRes, 'Transaction successfully mined')
	}
	return undefined
}
