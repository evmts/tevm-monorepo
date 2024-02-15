import { gasPriceHandler } from '@tevm/actions'
import { numberToHex } from '@tevm/utils'

/**
 * @param {Parameters<typeof gasPriceHandler>[0]} options
 * @returns {import('@tevm/procedures-types').EthGasPriceJsonRpcProcedure}
 */
export const gasPriceProcedure =
	({ vm, forkUrl }) =>
	async (req) => ({
		...(req.id ? { id: req.id } : {}),
		jsonrpc: '2.0',
		method: req.method,
		result: await gasPriceHandler({ vm, forkUrl })({}).then(numberToHex),
	})
