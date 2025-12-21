/**
 * Request handler for anvil_metadata JSON-RPC requests.
 * Returns metadata about the running Tevm node including version and fork information.
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilMetadataProcedure}
 * @example
 * ```typescript
 * import { createTevmNode } from '@tevm/node'
 * import { anvilMetadataJsonRpcProcedure } from '@tevm/actions'
 *
 * const node = createTevmNode({ fork: { url: 'https://mainnet.optimism.io' } })
 * const procedure = anvilMetadataJsonRpcProcedure(node)
 *
 * const result = await procedure({
 *   jsonrpc: '2.0',
 *   method: 'anvil_metadata',
 *   params: [],
 *   id: 1
 * })
 * console.log(result.result)
 * // {
 * //   clientVersion: 'tevm/1.0.0',
 * //   chainId: 10,
 * //   forked: {
 * //     url: 'https://mainnet.optimism.io',
 * //     blockNumber: 12345
 * //   },
 * //   snapshots: {}
 * // }
 * ```
 */
export const anvilMetadataJsonRpcProcedure = (client) => {
	return async (request) => {
		const vm = await client.getVm()
		const chainId = Number(vm.common.ethjsCommon.chainId())

		// Get fork information if available
		let forked
		if (client.forkTransport) {
			const latestBlock = await vm.blockchain.getCanonicalHeadBlock()
			let forkUrl

			// Extract the fork URL if available
			if (typeof client.forkTransport.url === 'string') {
				forkUrl = client.forkTransport.url
			}

			if (forkUrl) {
				forked = {
					url: forkUrl,
					blockNumber: Number(latestBlock.header.number),
				}
			}
		}

		// Get snapshots
		const snapshotsMap = client.getSnapshots()
		const snapshots = Object.fromEntries(
			Array.from(snapshotsMap.entries()).map(([id, { stateRoot }]) => [id, stateRoot]),
		)

		/** @type {import('./AnvilResult.js').AnvilMetadataResult} */
		const metadata = {
			clientVersion: 'tevm/1.0.0',
			chainId,
			...(forked ? { forked } : {}),
			snapshots,
		}

		return {
			jsonrpc: '2.0',
			method: request.method,
			result: metadata,
			...(request.id ? { id: request.id } : {}),
		}
	}
}
