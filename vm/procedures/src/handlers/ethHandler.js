/**
 * @param {import('@ethereumjs/blockchain').BlockchainInterface} blockchain
 * @returns {import('@tevm/api').EthBlockNumberHandler}
 */
export const blockNumberHandler = (blockchain) => async () => {
	return blockchain.getCanonicalHeadBlock().then((block) => block.header.number)
}
