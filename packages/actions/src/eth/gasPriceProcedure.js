import { numberToHex } from '@tevm/utils'
import { gasPriceHandler } from './gasPriceHandler.js'

/**
 * @param {Parameters<typeof gasPriceHandler>[0]} options
 * @returns {import('./EthProcedure.js').EthGasPriceJsonRpcProcedure}
 */
export const gasPriceProcedure =
	({ getVm, forkTransport }) =>
	async (req) => {
		try {
			// TODO pass in a client instead
			const result = await gasPriceHandler(/** @type any*/ ({ getVm, forkTransport }))({}).then(numberToHex)
			return {
				...(req.id ? { id: req.id } : {}),
				jsonrpc: '2.0',
				method: req.method,
				result,
			}
		} catch (error) {
			return {
				...(req.id ? { id: req.id } : {}),
				jsonrpc: '2.0',
				method: req.method,
				error: {
					code: -32000,
					message: error instanceof Error ? error.message : String(error),
				},
			}
		}
	}
