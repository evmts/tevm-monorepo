import { dumpStateHandler } from '@tevm/actions'
import { toHex } from '@tevm/utils'

/**
 * Creates a DumpState JSON-RPC Procedure for handling dumpState requests with Ethereumjs EVM
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('@tevm/procedures-types').DumpStateJsonRpcProcedure}
 */
export const dumpStateProcedure = (client) => async (request) => {
	const { errors = [], ...result } = await dumpStateHandler(client)({
		throwOnFail: false,
	})

	/**
	 * @type {import('@tevm/state').ParameterizedTevmState}
	 */
	const parsedState = {}

	for (const [k, v] of Object.entries(result.state)) {
		const { nonce, balance, storageRoot, codeHash } = v
		parsedState[k] = {
			...v,
			nonce: toHex(nonce),
			balance: toHex(balance),
			storageRoot: storageRoot,
			codeHash: codeHash,
		}
	}

	if (errors.length > 0) {
		const error = /** @type {import('@tevm/errors').DumpStateError}*/ (
			errors[0]
		)
		return {
			jsonrpc: '2.0',
			error: {
				code: error._tag,
				message: error.message,
				data: {
					errors: errors.map(({ message }) => message),
				},
			},
			method: 'tevm_dumpState',
			...(request.id === undefined ? {} : { id: request.id }),
		}
	} else {
		return {
			jsonrpc: '2.0',
			result: {
				state: parsedState,
			},
			method: 'tevm_dumpState',
			...(request.id === undefined ? {} : { id: request.id }),
		}
	}
}
