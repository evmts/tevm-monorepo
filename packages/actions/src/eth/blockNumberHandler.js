/**
 * Handler for the `eth_blockNumber` RPC call
 * @param {Pick<import('@tevm/base-client').BaseClient, 'vm'>} client
 * @returns {import('@tevm/actions-types').EthBlockNumberHandler}
 */
export const blockNumberHandler = (client) => async () => {
	return client.vm.blockchain
		.getCanonicalHeadBlock()
		.then((block) => block.header.number)
}
