/**
 * Request handler for anvil_nodeInfo JSON-RPC requests.
 * Returns configuration information about the running Tevm node.
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilNodeInfoProcedure}
 */
export const anvilNodeInfoJsonRpcProcedure = (client) => {
	return async (request) => {
		const vm = await client.getVm()
		const latestBlock = await vm.blockchain.getCanonicalHeadBlock()
		const chainId = Number(vm.common.ethjsCommon.chainId())
		const hardfork = vm.common.ethjsCommon.hardfork()

		// Extract the fork URL if available
		let forkUrl
		if (client.forkTransport) {
			// Check if the transport has a url property (common pattern)
			if ('url' in client.forkTransport && typeof (/** @type {any} */ (client.forkTransport).url) === 'string') {
				forkUrl = /** @type {any} */ (client.forkTransport).url
			}
		}

		// Normalize mining mode - 'interval' mining is treated as 'auto' for API compatibility
		const miningType = client.miningConfig.type
		/** @type {'auto' | 'manual'} */
		const miningMode = miningType === 'manual' ? 'manual' : 'auto'

		/** @type {import('./AnvilResult.js').AnvilNodeInfoResult} */
		const nodeInfo = {
			currentBlockNumber: Number(latestBlock.header.number),
			currentBlockTimestamp: Number(latestBlock.header.timestamp),
			...(forkUrl ? { forkUrl } : {}),
			chainId,
			hardfork,
			miningMode,
		}

		return {
			jsonrpc: '2.0',
			method: request.method,
			result: nodeInfo,
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
