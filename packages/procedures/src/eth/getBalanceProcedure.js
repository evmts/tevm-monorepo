import { getBalanceHandler } from '@tevm/actions'
import { numberToHex } from '@tevm/utils'

/**
 * @param {Parameters<typeof getBalanceHandler>[0]} baseClient
 * @returns {import('./EthProcedure.js').EthGetBalanceJsonRpcProcedure}
 */
export const getBalanceProcedure = (baseClient) => async (req) => {
	if (!req.params[1]) {
		throw new Error(
			'getBalanceProcedure received invalid parameters: Block parameter (req.params[1]) is missing or invalid. Expected a hex string or block tag (e.g., "latest", "earliest").',
		)
	}
	return {
		...(req.id ? { id: req.id } : {}),
		jsonrpc: '2.0',
		method: req.method,
		result: numberToHex(
			await getBalanceHandler(baseClient)({
				address: req.params[0],
				...(req.params[1].startsWith('0x')
					? { blockNumber: BigInt(req.params[1]) }
					: {
							blockTag: /** @type {import('@tevm/utils').BlockTag}*/ (req.params[1]),
						}),
			}),
		),
	}
}
