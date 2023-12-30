'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getChainContractAddress =
	exports.defineChain =
	exports.assertCurrentChain =
		void 0
const chain_js_1 = require('../errors/chain.js')
function assertCurrentChain({ chain, currentChainId }) {
	if (!chain) throw new chain_js_1.ChainNotFoundError()
	if (currentChainId !== chain.id)
		throw new chain_js_1.ChainMismatchError({ chain, currentChainId })
}
exports.assertCurrentChain = assertCurrentChain
function defineChain(chain, config = {}) {
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
exports.defineChain = defineChain
function getChainContractAddress({ blockNumber, chain, contract: name }) {
	const contract = chain?.contracts?.[name]
	if (!contract)
		throw new chain_js_1.ChainDoesNotSupportContract({
			chain,
			contract: { name },
		})
	if (
		blockNumber &&
		contract.blockCreated &&
		contract.blockCreated > blockNumber
	)
		throw new chain_js_1.ChainDoesNotSupportContract({
			blockNumber,
			chain,
			contract: {
				name,
				blockCreated: contract.blockCreated,
			},
		})
	return contract.address
}
exports.getChainContractAddress = getChainContractAddress
//# sourceMappingURL=chain.js.map
