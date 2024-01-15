import { bytesToHex, toHex } from 'viem'
import { dumpStateHandler } from '../index.js'

/**
 * Creates a DumpState JSON-RPC Procedure for handling dumpState requests with Ethereumjs EVM
 * @param {import('@tevm/state').TevmStateManager} stateManager
 * @returns {import('@tevm/api').DumpStateJsonRpcProcedure}
 */
export const dumpStateProcedure = (stateManager) => async (request) => {
	const { errors = [], ...result } = await dumpStateHandler(stateManager)()

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
			storageRoot: bytesToHex(storageRoot),
			codeHash: bytesToHex(codeHash),
		}
	}

	if (errors.length > 0) {
		const error = /** @type {import('@tevm/api').DumpStateError}*/ (errors[0])
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
