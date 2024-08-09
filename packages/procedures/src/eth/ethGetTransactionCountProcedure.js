import { createAddress } from '@tevm/address'
import { bytesToHex, getAddress, hexToBigInt, hexToBytes, numberToHex } from '@tevm/utils'

/**
 * Request handler for eth_getFilterLogs JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthProcedure.js').EthGetTransactionCountJsonRpcProcedure}
 */
export const ethGetTransactionCountProcedure = (client) => {
	return async (request) => {
		const [address, tag] = request.params

		const block = await (async () => {
			const vm = await client.getVm()
			if (tag.startsWith('0x') && tag.length === 66) {
				return vm.blockchain.getBlock(hexToBytes(/** @type {import('@tevm/utils').Hex}*/ (tag)))
			}
			if (tag.startsWith('0x')) {
				return vm.blockchain.getBlock(hexToBigInt(/** @type {import('@tevm/utils').Hex}*/ (tag)))
			}
			if (tag === 'pending') {
				// if pending just get latest we will get pending seperately
				return vm.blockchain.blocksByTag.get('latest')
			}
			if (tag === 'latest' || tag === 'safe' || tag === 'earliest' || tag === 'finalized') {
				return vm.blockchain.blocksByTag.get(tag)
			}
			return undefined
		})()
		if (!block) {
			return {
				...(request.id ? { id: request.id } : {}),
				method: request.method,
				jsonrpc: request.jsonrpc,
				error: {
					code: -32602,
					message: `Invalid block tag ${tag}`,
				},
			}
		}

		const pendingCount =
			tag === 'pending'
				? await (async () => {
						const txPool = await client.getTxPool()
						const pendingTx = await txPool.getBySenderAddress(createAddress(address))
						return BigInt(pendingTx.length)
					})()
				: 0n

		const includedCount = await (async () => {
			const vm = await client.getVm()
			// TODO we can optimize this by not deep copying once we are more confident it's safe
			const root = vm.stateManager._baseState.stateRoots.get(bytesToHex(block.header.stateRoot))
			if (!root) {
				// todo we might want to throw an error hre
				return 0n
			}
			return root[getAddress(address)]?.nonce ?? 0n
		})()

		return {
			...(request.id ? { id: request.id } : {}),
			method: request.method,
			jsonrpc: request.jsonrpc,
			result: numberToHex(pendingCount + includedCount),
		}
	}
}
