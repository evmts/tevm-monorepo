/**
 * Handler for the `eth_blockNumber` RPC call
 * @param {import('@tevm/vm').TevmVm} vm
 * @returns {import('@tevm/actions-types').EthBlockNumberHandler}
 */
export const blockNumberHandler = (vm) => async () => {
	return vm.blockchain
		.getCanonicalHeadBlock()
		.then((block) => block.header.number)
}
