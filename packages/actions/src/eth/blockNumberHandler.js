/**
 * Handler for the `eth_blockNumber` RPC call
 * @param {import('@tevm/node').TevmNode} client
 * @returns {import('./EthHandler.js').EthBlockNumberHandler}
 */
export const blockNumberHandler = (client) => async () => {
	if (client.consensus?.mode === 'light-client') {
		if (client.consensus.isReady?.() === false || client.getLightSyncStatus().ready === false) {
			throw new Error('LIGHT_CLIENT_NOT_READY: eth_blockNumber requires a ready light client')
		}
		if (client.consensus.getBlockNumber) return client.consensus.getBlockNumber()
	}
	const vm = await client.getVm()
	return vm.blockchain.getCanonicalHeadBlock().then((block) => block.header.number)
}
