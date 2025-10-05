import { numberToHex } from '@tevm/utils'
import { ethMaxPriorityFeePerGasHandler } from './ethMaxPriorityFeePerGasHandler.js'

/**
 * @param {Parameters<typeof ethMaxPriorityFeePerGasHandler>[0]} options
 * @returns {import('./EthProcedure.js').EthMaxPriorityFeePerGasJsonRpcProcedure}
 */
export const ethMaxPriorityFeePerGasProcedure =
	({ getVm, forkTransport }) =>
	async (req) => ({
		...(req.id ? { id: req.id } : {}),
		jsonrpc: '2.0',
		method: req.method,
		// TODO pass in a client instead
		result: await ethMaxPriorityFeePerGasHandler(/** @type any*/ ({ getVm, forkTransport }))({}).then(numberToHex),
	})