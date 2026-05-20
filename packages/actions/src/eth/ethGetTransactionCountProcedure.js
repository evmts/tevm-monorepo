import { createAddress } from '@tevm/address'
import { ForkError, InternalEvmError } from '@tevm/errors'
import { hexToBigInt, hexToBytes, numberToHex } from '@tevm/utils'
import { asLightSelector, ensureLightReady, getLightProof } from './lightClientRead.js'

/**
 * Request handler for eth_getFilterLogs JSON-RPC requests.
 * @param {import('@tevm/node').TevmNode} node
 * @returns {import('./EthProcedure.js').EthGetTransactionCountJsonRpcProcedure}
 */
export const ethGetTransactionCountProcedure = (node) => {
	return async (request) => {
		const [address, tag] = request.params
		if (node.consensus?.mode === 'light-client') {
			try {
				ensureLightReady(node, 'eth_getTransactionCount')
				const selector = asLightSelector(tag)
				const { proof } = await getLightProof(node, address, [], selector)
				return {
					...(request.id ? { id: request.id } : {}),
					method: request.method,
					jsonrpc: request.jsonrpc,
					result: numberToHex(hexToBigInt(proof.nonce)),
				}
			} catch (err) {
				const message = /** @type {Error} */ (err).message
				const explicitCode = message.startsWith('LIGHT_CLIENT_UNSUPPORTED_SELECTOR')
					? -32010
					: message.startsWith('LIGHT_CLIENT_NOT_READY')
						? -32011
						: message.startsWith('LIGHT_CLIENT_MALFORMED_UPSTREAM_PROOF')
							? -32012
							: message.startsWith('LIGHT_CLIENT_PROOF_VERIFICATION_FAILED')
								? -32013
								: -32603
				return {
					...(request.id ? { id: request.id } : {}),
					method: request.method,
					jsonrpc: request.jsonrpc,
					error: { code: explicitCode, message },
				}
			}
		}

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
				/**
				 * @type {import('@tevm/utils').Hex}
				 */
				const result = await node.forkTransport.request(request)
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
