import { InternalError } from '@tevm/errors'
import { hexToNumber } from '@tevm/utils'
import { mineHandler } from './mineHandler.js'

/**
 * Creates an Mine JSON-RPC Procedure for handling tevm_mine requests with Ethereumjs VM
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./MineJsonRpcProcedure.js').MineJsonRpcProcedure}
 */
export const mineProcedure = (client) => async (request) => {
	const { errors = [], ...result } = await mineHandler(client)({
		throwOnFail: false,
		interval: hexToNumber(request.params[1] ?? '0x0'),
		blockCount: hexToNumber(request.params[0] ?? '0x1'),
	})
	if (errors.length > 0) {
		const error = /** @type {import('./TevmMineError.js').TevmMineError}*/ (errors[0])
		return {
			jsonrpc: '2.0',
			error: {
				code: error.code,
				message: error.message,
				data: {
					errors: errors.map(({ message }) => message),
				},
			},
			method: 'tevm_mine',
			...(request.id === undefined ? {} : { id: request.id }),
		}
	}
	if (!result.blockHashes?.length) {
		const error = new InternalError('No blocks were mined')
		return {
			jsonrpc: '2.0',
			error: {
				code: error.code,
				message: error.message,
			},
			method: 'tevm_mine',
			...(request.id === undefined ? {} : { id: request.id }),
		}
	}
	return {
		jsonrpc: '2.0',
		result: {
			blockHashes: result.blockHashes ?? [],
		},
		method: 'tevm_mine',
		...(request.id === undefined ? {} : { id: request.id }),
	}
}
