import { createAddress } from '@tevm/address'
import { createAccount, hexToBytes, fromRlp } from '@tevm/utils'

/**
 * Request handler for anvil_loadState JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilLoadStateProcedure}
 */
export const anvilLoadStateJsonRpcProcedure = (client) => {
	return async (request) => {
		const loadStateRequest = /** @type {import('./AnvilJsonRpcRequest.js').AnvilLoadStateJsonRpcRequest}*/ (request)

		const vm = await client.getVm()

		return Promise.all(
			Object.entries(loadStateRequest.params[0].state).map(([address, rlpEncodedAccount]) => {
				const rlpBytes = hexToBytes(rlpEncodedAccount)
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
				return vm.stateManager.putAccount(
					createAddress(address),
					account,
				)
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
