/**
 * Handler for the `eth_blockNumber` RPC call
 * @param {import('@tevm/base-client').BaseClient} client
 * @returns {import('./EthHandler.js').EthBlockNumberHandler}
 */
export const blockNumberHandler = (client) => async () => {
	const vm = await client.getVm()
	return vm.blockchain.getCanonicalHeadBlock().then((block) => block.header.number)
}
