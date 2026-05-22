/**
 * Request handler for anvil_metadata JSON-RPC requests.
 * Returns metadata about the running Tevm node including version and fork information.
 *
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./AnvilProcedure.js').AnvilMetadataProcedure}
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
			if ('url' in client.forkTransport && typeof (/** @type {any} */ (client.forkTransport).url) === 'string') {
				forkUrl = /** @type {any} */ (client.forkTransport).url
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
			...(request.id !== undefined ? { id: request.id } : {}),
		}
	}
}
