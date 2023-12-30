import {
	ChainDoesNotSupportContract,
	ChainMismatchError,
	ChainNotFoundError,
} from '../errors/chain.js'
export function assertCurrentChain({ chain, currentChainId }) {
	if (!chain) throw new ChainNotFoundError()
	if (currentChainId !== chain.id)
		throw new ChainMismatchError({ chain, currentChainId })
}
export function defineChain(chain, config = {}) {
	const {
		fees = chain.fees,
		formatters = chain.formatters,
		serializers = chain.serializers,
	} = config
	return {
		...chain,
		fees,
		formatters,
		serializers,
	}
}
export function getChainContractAddress({
	blockNumber,
	chain,
	contract: name,
}) {
	const contract = chain?.contracts?.[name]
	if (!contract)
		throw new ChainDoesNotSupportContract({
			chain,
			contract: { name },
		})
	if (
		blockNumber &&
		contract.blockCreated &&
		contract.blockCreated > blockNumber
	)
		throw new ChainDoesNotSupportContract({
			blockNumber,
			chain,
			contract: {
				name,
				blockCreated: contract.blockCreated,
			},
		})
	return contract.address
}
//# sourceMappingURL=chain.js.map
