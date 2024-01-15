import { gasPriceHandler } from '../../handlers/index.js'
import { numberToHex } from 'viem'

/**
 * @param {Parameters<typeof gasPriceHandler>[0]} options
 * @returns {import('@tevm/api').EthGasPriceJsonRpcProcedure}
 */
export const gasPriceProcedure =
	({ blockchain, forkUrl }) =>
	async (req) => ({
		...(req.id ? { id: req.id } : {}),
		jsonrpc: '2.0',
		method: req.method,
		result: await gasPriceHandler({ blockchain, forkUrl })({}).then(
			numberToHex,
		),
	})
