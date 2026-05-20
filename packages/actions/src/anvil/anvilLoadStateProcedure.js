import { createAddress } from '@tevm/address'
import { createAccount, fromRlp, hexToBytes } from '@tevm/utils'

/**
 * Request handler for anvil_loadState JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilLoadStateProcedure}
 */
export const anvilLoadStateJsonRpcProcedure = (client) => {
	return async (request) => {
		const loadStateRequest = /** @type {import('./AnvilJsonRpcRequest.js').AnvilLoadStateJsonRpcRequest}*/ (request)
		const blob = /** @type {any} */ (loadStateRequest.params[0])
		const zevmBlob = blob && typeof blob === 'object' ? blob['zevmState'] : undefined
		const stateRecord = blob?.state ?? zevmBlob
		if (!blob || typeof blob !== 'object' || typeof stateRecord !== 'object' || Array.isArray(stateRecord)) {
			return {
				jsonrpc: '2.0',
				method: loadStateRequest.method,
				...(loadStateRequest.id ? { id: loadStateRequest.id } : {}),
				error: {
					code: /** @type any*/ (-32602),
					message: 'Invalid state blob. Expected object with a state record.',
				},
			}
		}

		const vm = await client.getVm()

		return Promise.all(
			Object.entries(stateRecord).map(([address, rlpEncodedAccount]) => {
				if (!address.startsWith('0x')) {
					throw new Error('Invalid account address')
				}
				if (typeof rlpEncodedAccount !== 'string' || !rlpEncodedAccount.startsWith('0x')) {
					throw new Error('Invalid RLP encoded account value')
				}
				const rlpBytes = hexToBytes(/** @type {import('@tevm/utils').Hex} */ (rlpEncodedAccount))
				const decoded = fromRlp(rlpBytes)
				if (!Array.isArray(decoded) || decoded.length !== 4) {
					throw new Error('Invalid RLP serialized account')
				}
				const [nonce, balance, storageRoot, codeHash] = decoded
				const account = createAccount({
					nonce,
					balance,
					storageRoot,
					codeHash,
				})
				return vm.stateManager.putAccount(createAddress(/** @type {import('@tevm/utils').Hex} */ (address)), account)
			}),
		)
			.then(() => {
				/**
				 * @type {import('./AnvilJsonRpcResponse.js').AnvilLoadStateJsonRpcResponse}
				 */
				const response = {
					jsonrpc: '2.0',
					method: loadStateRequest.method,
					result: null,
					...(loadStateRequest.id ? { id: loadStateRequest.id } : {}),
				}
				return response
			})
			.catch((e) => {
				/**
				 * @type {import('./AnvilJsonRpcResponse.js').AnvilLoadStateJsonRpcResponse}
				 */
				const response = {
					jsonrpc: '2.0',
					method: loadStateRequest.method,
					...(loadStateRequest.id ? { id: loadStateRequest.id } : {}),
					error: {
						// TODO use @tevm/errors
						code: /** @type any*/ (-32602),
						message: e.message,
					},
				}
				return response
			})
	}
}
