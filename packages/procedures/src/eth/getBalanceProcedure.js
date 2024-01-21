import { getBalanceHandler } from '@tevm/actions'
import { numberToHex } from 'viem'

/**
 * @param {Parameters<typeof getBalanceHandler>[0]} options
 * @returns {import('@tevm/procedures-types').EthGetBalanceJsonRpcProcedure}
 */
export const getBalanceProcedure =
	({ stateManager, forkUrl }) =>
	async (req) => ({
		...(req.id ? { id: req.id } : {}),
		jsonrpc: '2.0',
		method: req.method,
		result: numberToHex(
			await getBalanceHandler({ stateManager, forkUrl })({
				address: req.params[0],
				...(req.params[1].startsWith('0x')
					? { blockNumber: BigInt(req.params[1]) }
					: {
							blockTag: /** @type {import('viem').BlockTag}*/ (req.params[1]),
					  }),
			}),
		),
	})
