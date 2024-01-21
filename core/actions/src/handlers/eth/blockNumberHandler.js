/**
 * Handler for the `eth_blockNumber` RPC call
 * @param {import('@ethereumjs/blockchain').BlockchainInterface} blockchain
 * @returns {import('@tevm/actions-spec').EthBlockNumberHandler}
 */
export const blockNumberHandler = (blockchain) => async () => {
	return blockchain.getCanonicalHeadBlock().then((block) => block.header.number)
}
