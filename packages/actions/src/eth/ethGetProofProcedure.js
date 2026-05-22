import { ethGetProofHandler } from './ethGetProofHandler.js'

/**
 * JSON-RPC procedure for `eth_getProof`.
 * Returns the account and storage values of the specified account including the Merkle-proof.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthGetProofJsonRpcProcedure}
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
