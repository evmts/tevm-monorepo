import { gasPriceHandler } from '@tevm/actions'
import { numberToHex } from '@tevm/utils'

/**
 * @param {Parameters<typeof gasPriceHandler>[0]} options
 * @returns {import('@tevm/procedures').EthGasPriceJsonRpcProcedure}
 */
export const gasPriceProcedure =
	({ getVm, forkTransport }) =>
	async (req) => ({
		...(req.id ? { id: req.id } : {}),
		jsonrpc: '2.0',
		method: req.method,
		// TODO pass in a client instead
		result: await gasPriceHandler(/** @type any*/ ({ getVm, forkTransport }))({}).then(numberToHex),
	})
