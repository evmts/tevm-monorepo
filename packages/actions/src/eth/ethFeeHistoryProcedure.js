import { ethFeeHistoryHandler } from './ethFeeHistoryHandler.js'

/**
 * @param {Parameters<typeof ethFeeHistoryHandler>[0]} options
 * @returns {import('./EthProcedure.js').EthFeeHistoryJsonRpcProcedure}
 */
export const ethFeeHistoryProcedure =
	({ getVm, forkTransport }) =>
	async (req) => {
		const [blockCount, newestBlock, rewardPercentiles] = req.params

		return {
			...(req.id ? { id: req.id } : {}),
			jsonrpc: '2.0',
			method: req.method,
			result: await ethFeeHistoryHandler({ getVm, forkTransport })({
				blockCount,
				newestBlock,
				rewardPercentiles,
			}),
		}
	}