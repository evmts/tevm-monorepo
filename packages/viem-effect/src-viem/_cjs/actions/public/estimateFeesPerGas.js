'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.internal_estimateFeesPerGas = exports.estimateFeesPerGas = void 0
const fee_js_1 = require('../../errors/fee.js')
const estimateMaxPriorityFeePerGas_js_1 = require('./estimateMaxPriorityFeePerGas.js')
const getBlock_js_1 = require('./getBlock.js')
const getGasPrice_js_1 = require('./getGasPrice.js')
async function estimateFeesPerGas(client, args) {
	return internal_estimateFeesPerGas(client, args)
}
exports.estimateFeesPerGas = estimateFeesPerGas
async function internal_estimateFeesPerGas(client, args) {
	const {
		block: block_,
		chain = client.chain,
		request,
		type = 'eip1559',
	} = args || {}
	const baseFeeMultiplier = await (async () => {
		if (typeof chain?.fees?.baseFeeMultiplier === 'function')
			return chain.fees.baseFeeMultiplier({
				block: block_,
				client,
				request,
			})
		return chain?.fees?.baseFeeMultiplier ?? 1.2
	})()
	if (baseFeeMultiplier < 1) throw new fee_js_1.BaseFeeScalarError()
	const decimals = baseFeeMultiplier.toString().split('.')[1].length
	const denominator = 10 ** decimals
	const multiply = (base) =>
		(base * BigInt(baseFeeMultiplier * denominator)) / BigInt(denominator)
	const block = block_ ? block_ : await (0, getBlock_js_1.getBlock)(client)
	if (typeof chain?.fees?.estimateFeesPerGas === 'function')
		return chain.fees.estimateFeesPerGas({
			block: block_,
			client,
			multiply,
			request,
			type,
		})
	if (type === 'eip1559') {
		if (typeof block.baseFeePerGas !== 'bigint')
			throw new fee_js_1.Eip1559FeesNotSupportedError()
		const maxPriorityFeePerGas = request?.maxPriorityFeePerGas
			? request.maxPriorityFeePerGas
			: await (0,
			  estimateMaxPriorityFeePerGas_js_1.internal_estimateMaxPriorityFeePerGas)(
					client,
					{
						block,
						chain,
						request,
					},
			  )
		const baseFeePerGas = multiply(block.baseFeePerGas)
		const maxFeePerGas =
			request?.maxFeePerGas ?? baseFeePerGas + maxPriorityFeePerGas
		return {
			maxFeePerGas,
			maxPriorityFeePerGas,
		}
	}
	const gasPrice =
		request?.gasPrice ??
		multiply(await (0, getGasPrice_js_1.getGasPrice)(client))
	return {
		gasPrice,
	}
}
exports.internal_estimateFeesPerGas = internal_estimateFeesPerGas
//# sourceMappingURL=estimateFeesPerGas.js.map
