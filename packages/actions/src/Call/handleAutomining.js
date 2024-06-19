import { mineHandler } from '../Mine/mineHandler.js'

/**
 * @param {import("@tevm/base-client").BaseClient} client
 * @param {import("viem").Hex} [txHash]
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
