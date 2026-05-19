import { mineHandler } from '../Mine/mineHandler.js'

/**
 * @internal
 * Runs the mining logic if the client is set to automine
 * @param {import("@tevm/node").TevmNode} client
 * @param {import("viem").Hex} [txHash]
 * @param {boolean} [_reserved] Reserved parameter for backwards compatibility
 * @param {boolean} [mineAllTx] Whether to mine all transactions in the pool
 * @returns {Promise<{blockHashes?: undefined, errors?: import('../Mine/TevmMineError.js').TevmMineError[]} | undefined>} undefined if noop, errors if automining fails, blockHashes if automining succeeds
 * @throws {never} returns errors as values
 */
export const handleAutomining = async (client, txHash, _reserved = false, mineAllTx = true) => {
	client.logger.debug(`${_reserved ? 'Gas mining' : 'Automining'} transaction ${txHash}...`)
	const miningConfig = /** @type {import('@tevm/node').MiningConfig | { type: 'gas', limit?: bigint }} */ (
		client.miningConfig
	)
	if (_reserved && miningConfig.type === 'gas' && 'limit' in miningConfig) {
		client.logger.debug(`Gas mining mode with limit ${miningConfig.limit}`)
	}

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
