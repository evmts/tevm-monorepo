/**
 * Request handler for anvil_nodeInfo JSON-RPC requests.
 * Returns configuration information about the running Tevm node.
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilNodeInfoProcedure}
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { anvilNodeInfoJsonRpcProcedure } from '@tevm/actions'
 *
 * const node = createTevmNode({ fork: { url: 'https://mainnet.optimism.io' } })
 * const procedure = anvilNodeInfoJsonRpcProcedure(node)
 *
 * const result = await procedure({
 *   jsonrpc: '2.0',
 *   method: 'anvil_nodeInfo',
 *   params: [],
 *   id: 1
 * })
 * console.log(result.result)
 * // {
 * //   currentBlockNumber: 12345,
 * //   currentBlockTimestamp: 1234567890,
 * //   forkUrl: 'https://mainnet.optimism.io',
 * //   chainId: 10,
 * //   hardfork: 'cancun',
 * //   miningMode: 'auto'
 * // }
 * ```
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
			if (typeof client.forkTransport.url === 'string') {
				forkUrl = client.forkTransport.url
			}
		}

		/** @type {import('./AnvilResult.js').AnvilNodeInfoResult} */
		const nodeInfo = {
			currentBlockNumber: Number(latestBlock.header.number),
			currentBlockTimestamp: Number(latestBlock.header.timestamp),
			...(forkUrl ? { forkUrl } : {}),
			chainId,
			hardfork,
			miningMode: client.miningConfig.type,
		}

		return {
			jsonrpc: '2.0',
			method: request.method,
			result: nodeInfo,
			...(request.id ? { id: request.id } : {}),
		}
	}
}
