import { forkHandler } from '@tevm/actions'
import { toHex } from 'viem'

/**
 * Creates a Fork JSON-RPC Procedure for handling tevm_fork requests
 * @param {import('@tevm/actions').ForkOptions} forkOptions
 * @returns {import('@tevm/procedures-types').ForkJsonRpcProcedure}
 */
export const forkProcedure = (forkOptions) => async (request) => {
	const { errors = [], forkId } = await forkHandler(forkOptions)({
		url: request.params.url,
		// turn to blockNumber big int if it doesn't have the same length as a block hash
		blockTag:
			request.params.blockTag.startsWith('0x') &&
			request.params.blockTag.length !== 66
				? BigInt(request.params.blockTag)
				: request.params.blockTag,
	})

	if (!forkId) {
		const error = /** @type {import('@tevm/errors').ForkError}*/ (errors[0])
		return {
			jsonrpc: '2.0',
			error: {
				code: error._tag,
				message: error.message,
				data: {
					errors: errors.map(({ message }) => message),
				},
			},
			method: 'tevm_fork',
			...(request.id === undefined ? {} : { id: request.id }),
		}
	} else {
		return {
			jsonrpc: '2.0',
			result: {
				forkId: toHex(forkId),
			},
			method: 'tevm_fork',
			...(request.id === undefined ? {} : { id: request.id }),
		}
	}
}
