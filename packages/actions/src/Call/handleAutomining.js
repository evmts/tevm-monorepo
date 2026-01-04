import { mineHandler } from '../Mine/mineHandler.js'

/**
 * @internal
 * Runs the mining logic if the client is set to automine
 * @param {import("@tevm/node").TevmNode} client
 * @param {import("@tevm/utils").Hex} [txHash]
 * @param {boolean} [_reserved] Reserved parameter for backwards compatibility
 * @param {boolean} [mineAllTx] Whether to mine all transactions in the pool
 * @returns {Promise<{blockHashes?: undefined, errors?: import('../Mine/TevmMineError.js').TevmMineError[]} | undefined>} undefined if noop, errors if automining fails, blockHashes if automining succeeds
 * @throws {never} returns errors as values
 */
export const handleAutomining = async (client, txHash, _reserved = false, mineAllTx = true) => {
	client.logger.debug(`Automining transaction ${txHash}...`)

	// Mine a single block
	const mineRes = await mineHandler(client)({
		...(mineAllTx || txHash === undefined ? {} : { tx: txHash }),
		throwOnFail: false,
		blockCount: 1,
	})

	if (mineRes.errors?.length) {
		return mineRes
	}
	client.logger.debug(mineRes, 'Transaction successfully mined')
	return undefined
}
