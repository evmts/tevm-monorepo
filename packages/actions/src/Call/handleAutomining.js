import { mineHandler } from '../Mine/mineHandler.js'

/**
 * @internal
 * Runs the mining logic if the client is set to automine or gas mining threshold is reached
 * @param {import("@tevm/node").TevmNode} client
 * @param {import("viem").Hex} [txHash]
 * @param {boolean} [isGasMining] Whether this is being triggered by gas mining
 * @returns {Promise<{blockHashes?: undefined, errors?: import('../Mine/TevmMineError.js').TevmMineError[]} | undefined>} undefined if noop, errors if automining fails, blockHashes if automining succeeds
 * @throws {never} returns errors as values
 */
export const handleAutomining = async (client, txHash, isGasMining = false) => {
	// Check if auto mining is enabled or if this is a gas mining request
	if (client.miningConfig.type === 'auto' || isGasMining) {
		client.logger.debug(`${client.miningConfig.type === 'auto' ? 'Automining' : 'Gas mining'} transaction ${txHash}...`)

		// For gas mining mode, determine number of blocks to mine
		const blocks = 1
		if (isGasMining && client.miningConfig.type === 'gas' && client.miningConfig.limit) {
			// In gas mining mode, we can optionally use the limit parameter to determine how many blocks to mine
			// The limit is a BigInt representing gas threshold, but we could also use it to determine block count
			// For simplicity, we're mining just one block here, but this could be extended to use the limit
			client.logger.debug(`Gas mining mode with limit ${client.miningConfig.limit}`)
		}

		// Mine the specified number of blocks
		const mineRes = await mineHandler(client)({
			throwOnFail: false,
			blockCount: blocks,
		})

		if (mineRes.errors?.length) {
			return mineRes
		}
		client.logger.debug(mineRes, 'Transaction successfully mined')
	}
	return undefined
}
