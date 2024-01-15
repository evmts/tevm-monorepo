import { hexToBigInt, hexToBytes } from 'viem'
import { loadStateHandler } from '../index.js'

/**
 * Creates a DumpState JSON-RPC Procedure for handling dumpState requests with Ethereumjs EVM
 * @param {import('@tevm/state').TevmStateManager} stateManager
 * @returns {import('@tevm/api').LoadStateJsonRpcProcedure}
 */
export const loadStateProcedure = (stateManager) => async (request) => {
	const {
		params: { state },
	} = request

	/**
	 * @type {import('@tevm/state').SerializableTevmState}
	 */
	const parsedState = {}

	for (const [k, v] of Object.entries(state)) {
		const { nonce, balance, storageRoot, codeHash } = v
		parsedState[k] = {
			...v,
			nonce: hexToBigInt(nonce),
			balance: hexToBigInt(balance),
			storageRoot: hexToBytes(storageRoot),
			codeHash: hexToBytes(codeHash),
		}
	}
	const { errors = [] } = await loadStateHandler(stateManager)({
		state: parsedState,
	})

	if (errors.length > 0) {
		const error = /** @type {import('@tevm/api').LoadStateError}*/ (errors[0])
		return {
			jsonrpc: '2.0',
			error: {
				code: error._tag,
				message: error.message,
				data: {
					errors: errors.map(({ message }) => message),
				},
			},
			method: 'tevm_loadState',
			...(request.id === undefined ? {} : { id: request.id }),
		}
	} else {
		return {
			jsonrpc: '2.0',
			result: {},
			method: 'tevm_loadState',
			...(request.id === undefined ? {} : { id: request.id }),
		}
	}
}
