import { NoForkUrlSetError } from '@tevm/errors'
import { createJsonRpcFetcher } from '@tevm/jsonrpc'
import { numberToHex } from '@tevm/utils'

/**
 * Handler for the `eth_getProof` RPC method.
 * Returns the account and storage values of the specified account including the Merkle-proof.
 * Currently only works in forked mode as TEVM does not merklelize state locally.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthHandler.js').EthGetProofHandler}
 */
export const ethGetProofHandler = (client) => {
	const { forkTransport } = client
	return async (params) => {
		const { address, storageKeys, blockTag = 'latest' } = params

		// Currently only works in forked mode since TEVM doesn't merkelize state locally
		if (!forkTransport) {
			throw new NoForkUrlSetError(
				'eth_getProof is only supported in fork mode. TEVM does not merkelize local state currently.',
			)
		}

		const fetcher = createJsonRpcFetcher(forkTransport)

		// Convert blockTag to hex if it's a bigint
		const blockParam = typeof blockTag === 'bigint' ? numberToHex(blockTag) : blockTag

		const result = await fetcher.request({
			method: 'eth_getProof',
			params: [address, [...storageKeys], blockParam],
			jsonrpc: '2.0',
			id: 1,
		})

		if (result.error) {
			throw new Error(result.error.message)
		}

		const proofResult = /** @type {{
			address: import('@tevm/utils').Address,
			accountProof: import('@tevm/utils').Hex[],
			balance: import('@tevm/utils').Hex,
			codeHash: import('@tevm/utils').Hex,
			nonce: import('@tevm/utils').Hex,
			storageHash: import('@tevm/utils').Hex,
			storageProof: Array<{
				key: import('@tevm/utils').Hex,
				value: import('@tevm/utils').Hex,
				proof: import('@tevm/utils').Hex[]
			}>
		}} */ (result.result)

		return {
			address: proofResult.address,
			accountProof: proofResult.accountProof,
			balance: proofResult.balance,
			codeHash: proofResult.codeHash,
			nonce: proofResult.nonce,
			storageHash: proofResult.storageHash,
			storageProof: proofResult.storageProof.map((sp) => ({
				key: sp.key,
				value: sp.value,
				proof: sp.proof,
			})),
		}
	}
}
