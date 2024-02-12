/**
 * Handler for the `eth_blockNumber` RPC call
 * @param {import('@ethereumjs/vm').VM} vm
 * @returns {import('@tevm/actions-types').EthBlockNumberHandler}
 */
export const blockNumberHandler = (vm) => async () => {
	return vm.blockchain
		.getCanonicalHeadBlock()
		.then((block) => block.header.number)
}
