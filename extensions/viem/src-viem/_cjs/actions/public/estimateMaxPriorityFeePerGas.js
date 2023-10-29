'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.internal_estimateMaxPriorityFeePerGas =
	exports.estimateMaxPriorityFeePerGas = void 0
const fee_js_1 = require('../../errors/fee.js')
const fromHex_js_1 = require('../../utils/encoding/fromHex.js')
const getBlock_js_1 = require('./getBlock.js')
const getGasPrice_js_1 = require('./getGasPrice.js')
async function estimateMaxPriorityFeePerGas(client, args) {
	return internal_estimateMaxPriorityFeePerGas(client, args)
}
exports.estimateMaxPriorityFeePerGas = estimateMaxPriorityFeePerGas
async function internal_estimateMaxPriorityFeePerGas(client, args) {
	const { block: block_, chain = client.chain, request } = args || {}
	if (typeof chain?.fees?.defaultPriorityFee === 'function') {
		const block = block_ || (await (0, getBlock_js_1.getBlock)(client))
		return chain.fees.defaultPriorityFee({
			block,
			client,
			request,
		})
	} else if (chain?.fees?.defaultPriorityFee)
		return chain?.fees?.defaultPriorityFee
	try {
		const maxPriorityFeePerGasHex = await client.request({
			method: 'eth_maxPriorityFeePerGas',
		})
		return (0, fromHex_js_1.hexToBigInt)(maxPriorityFeePerGasHex)
	} catch {
		const [block, gasPrice] = await Promise.all([
			block_ ? Promise.resolve(block_) : (0, getBlock_js_1.getBlock)(client),
			(0, getGasPrice_js_1.getGasPrice)(client),
		])
		if (typeof block.baseFeePerGas !== 'bigint')
			throw new fee_js_1.Eip1559FeesNotSupportedError()
		const maxPriorityFeePerGas = gasPrice - block.baseFeePerGas
		if (maxPriorityFeePerGas < 0n) return 0n
		return maxPriorityFeePerGas
	}
}
exports.internal_estimateMaxPriorityFeePerGas =
	internal_estimateMaxPriorityFeePerGas
//# sourceMappingURL=estimateMaxPriorityFeePerGas.js.map
