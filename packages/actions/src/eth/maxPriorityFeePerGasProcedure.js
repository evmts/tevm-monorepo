import { numberToHex } from '@tevm/utils'
import { maxPriorityFeePerGasHandler } from './maxPriorityFeePerGasHandler.js'

/**
 * JSON-RPC procedure for `eth_maxPriorityFeePerGas`.
 * @param {Parameters<typeof maxPriorityFeePerGasHandler>[0]} options
 * @returns {import('./EthProcedure.js').EthMaxPriorityFeePerGasJsonRpcProcedure}
 */
export const maxPriorityFeePerGasProcedure =
	({ getVm, forkTransport }) =>
	async (req) => ({
		...(req.id !== undefined ? { id: req.id } : {}),
		jsonrpc: '2.0',
		method: req.method,
		result: await maxPriorityFeePerGasHandler(/** @type any*/ ({ getVm, forkTransport }))({}).then(numberToHex),
	})
