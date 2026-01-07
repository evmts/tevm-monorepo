import { createAddress } from '@tevm/address'
import { ForkError, InternalEvmError } from '@tevm/errors'
import { hexToBigInt, hexToBytes, numberToHex } from '@tevm/utils'

/**
 * Request handler for eth_getFilterLogs JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} node
 * @returns {import('./EthProcedure.js').EthGetTransactionCountJsonRpcProcedure}
 */
export const ethGetTransactionCountProcedure = (node) => {
	return async (request) => {
		const [address, tag] = request.params

		const block = await (async () => {
			const vm = await node.getVm()
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
						const txPool = await node.getTxPool()
						const pendingTx = await txPool.getBySenderAddress(createAddress(address))
						return BigInt(pendingTx.length)
					})()
				: 0n

		const includedCount = await (async () => {
			const vm = await node.getVm()
			if (!(await vm.stateManager.hasStateRoot(block.header.stateRoot))) {
				return undefined
			}
			const stateCopy = await vm.stateManager.deepCopy()
			await stateCopy.setStateRoot(block.header.stateRoot)
			const account = await stateCopy.getAccount(createAddress(address))
			return account?.nonce ?? 0n
		})()

		if (includedCount === undefined && node.forkTransport) {
			try {
				const result = /** @type {import('@tevm/utils').Hex} */ (
					await node.forkTransport.request(/** @type {any} */ (request))
				)
				return {
					...(request.id ? { id: request.id } : {}),
					method: request.method,
					jsonrpc: request.jsonrpc,
					result: numberToHex(hexToBigInt(result) + pendingCount),
				}
			} catch (e) {
				const err = new ForkError('Unable to resolve eth_getTransactionCount with fork', {
					cause: /** @type {any}*/ (e),
				})
				return {
					...(request.id ? { id: request.id } : {}),
					method: request.method,
					jsonrpc: request.jsonrpc,
					error: {
						code: err.code,
						message: err.message,
					},
				}
			}
		}
		if (includedCount === undefined) {
			const err = new InternalEvmError(`No state root found for block tag ${tag} in eth_getTransactionCountProcedure`)
			node.logger.error(err)
			return {
				...(request.id ? { id: request.id } : {}),
				method: request.method,
				jsonrpc: request.jsonrpc,
				error: {
					code: err.code,
					message: err.message,
				},
			}
		}

		return {
			...(request.id ? { id: request.id } : {}),
			method: request.method,
			jsonrpc: request.jsonrpc,
			result: numberToHex(pendingCount + includedCount),
		}
	}
}
