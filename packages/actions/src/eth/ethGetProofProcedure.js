import { ethGetProofHandler } from './ethGetProofHandler.js'

/**
 * JSON-RPC procedure for `eth_getProof`.
 * Returns the account and storage values of the specified account including the Merkle-proof.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthGetProofJsonRpcProcedure}
 * @example
 * ```javascript
 * import { createTevmNode } from '@tevm/node'
 * import { ethGetProofProcedure } from '@tevm/actions'
 *
 * const node = createTevmNode({
 *   fork: { transport: http('https://mainnet.optimism.io') }
 * })
 * const procedure = ethGetProofProcedure(node)
 * const response = await procedure({
 *   jsonrpc: '2.0',
 *   method: 'eth_getProof',
 *   id: 1,
 *   params: [
 *     '0x1234567890123456789012345678901234567890',
 *     ['0x0000000000000000000000000000000000000000000000000000000000000000'],
 *     'latest'
 *   ],
 * })
 * console.log(response.result)
 * // {
 * //   address: '0x1234567890123456789012345678901234567890',
 * //   accountProof: ['0x...', ...],
 * //   balance: '0x0',
 * //   ...
 * // }
 * ```
 */
export const ethGetProofProcedure = (client) => {
	const handler = ethGetProofHandler(client)
	return async (req) => {
		const [address, storageKeys, blockTag] = req.params

		// Parse blockTag - could be a hex number or a tag like "latest"
		/** @type {import('@tevm/utils').BlockTag | bigint} */
		const blockTagParam =
			blockTag.startsWith('0x') && blockTag.length > 10
				? BigInt(blockTag)
				: /** @type {import('@tevm/utils').BlockTag} */ (blockTag)

		try {
			const result = await handler({
				address,
				storageKeys,
				blockTag: blockTagParam,
			})

			return /** @type {import('./EthJsonRpcResponse.js').EthGetProofJsonRpcResponse}*/ ({
				...(req.id !== undefined ? { id: req.id } : {}),
				jsonrpc: '2.0',
				method: req.method,
				result: {
					address: result.address,
					accountProof: result.accountProof,
					balance: result.balance,
					codeHash: result.codeHash,
					nonce: result.nonce,
					storageHash: result.storageHash,
					storageProof: result.storageProof,
				},
			})
		} catch (e) {
			const error = /** @type {Error} */ (e)
			return /** @type {import('./EthJsonRpcResponse.js').EthGetProofJsonRpcResponse}*/ ({
				...(req.id !== undefined ? { id: req.id } : {}),
				jsonrpc: '2.0',
				method: req.method,
				error: {
					code: -32603,
					message: error.message,
				},
			})
		}
	}
}
