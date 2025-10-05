import { mineHandler } from '../Mine/mineHandler.js'

/**
 * @internal
 * Runs the mining logic if the client is set to automine
 * @param {import("@tevm/node").TevmNode} client
 * @param {import("viem").Hex} [txHash]
 * @param {boolean} [mineAllTx] Whether to mine all transactions or just the specific one
 * @returns {Promise<{blockHashes?: undefined, errors?: import('../Mine/TevmMineError.js').TevmMineError[]} | undefined>} undefined if noop, errors if automining fails, blockHashes if automining succeeds
 * @throws {never} returns errors as values
 */
export const handleAutomining = async (client, txHash, mineAllTx = true) => {
	// Check if auto mining is enabled
	client.logger.debug(`Automining transaction ${txHash}...`)

	// Mine one block for auto mining
	const blocks = 1

	// Mine the specified number of blocks
	const mineRes = await mineHandler(client)({
		...(mineAllTx || txHash === undefined ? {} : { tx: txHash }),
		throwOnFail: false,
		blockCount: blocks,
	})

	if (mineRes.errors?.length) {
		return mineRes
	}
	client.logger.debug(mineRes, 'Transaction successfully mined')
	return undefined
}
