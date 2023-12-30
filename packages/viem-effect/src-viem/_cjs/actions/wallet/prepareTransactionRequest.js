'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.prepareTransactionRequest = void 0
const parseAccount_js_1 = require('../../accounts/utils/parseAccount.js')
const estimateFeesPerGas_js_1 = require('../../actions/public/estimateFeesPerGas.js')
const estimateGas_js_1 = require('../../actions/public/estimateGas.js')
const getBlock_js_1 = require('../../actions/public/getBlock.js')
const getTransactionCount_js_1 = require('../../actions/public/getTransactionCount.js')
const account_js_1 = require('../../errors/account.js')
const fee_js_1 = require('../../errors/fee.js')
const assertRequest_js_1 = require('../../utils/transaction/assertRequest.js')
const getTransactionType_js_1 = require('../../utils/transaction/getTransactionType.js')
async function prepareTransactionRequest(client, args) {
	const { account: account_ = client.account, chain, gas, nonce, type } = args
	if (!account_) throw new account_js_1.AccountNotFoundError()
	const account = (0, parseAccount_js_1.parseAccount)(account_)
	const block = await (0, getBlock_js_1.getBlock)(client, {
		blockTag: 'latest',
	})
	const request = { ...args, from: account.address }
	if (typeof nonce === 'undefined')
		request.nonce = await (0, getTransactionCount_js_1.getTransactionCount)(
			client,
			{
				address: account.address,
				blockTag: 'pending',
			},
		)
	if (typeof type === 'undefined') {
		try {
			request.type = (0, getTransactionType_js_1.getTransactionType)(request)
		} catch {
			request.type =
				typeof block.baseFeePerGas === 'bigint' ? 'eip1559' : 'legacy'
		}
	}
	if (request.type === 'eip1559') {
		const { maxFeePerGas, maxPriorityFeePerGas } = await (0,
		estimateFeesPerGas_js_1.internal_estimateFeesPerGas)(client, {
			block,
			chain,
			request: request,
		})
		if (
			typeof args.maxPriorityFeePerGas === 'undefined' &&
			args.maxFeePerGas &&
			args.maxFeePerGas < maxPriorityFeePerGas
		)
			throw new fee_js_1.MaxFeePerGasTooLowError({
				maxPriorityFeePerGas,
			})
		request.maxPriorityFeePerGas = maxPriorityFeePerGas
		request.maxFeePerGas = maxFeePerGas
	} else {
		if (
			typeof args.maxFeePerGas !== 'undefined' ||
			typeof args.maxPriorityFeePerGas !== 'undefined'
		)
			throw new fee_js_1.Eip1559FeesNotSupportedError()
		const { gasPrice: gasPrice_ } = await (0,
		estimateFeesPerGas_js_1.internal_estimateFeesPerGas)(client, {
			block,
			chain,
			request: request,
			type: 'legacy',
		})
		request.gasPrice = gasPrice_
	}
	if (typeof gas === 'undefined')
		request.gas = await (0, estimateGas_js_1.estimateGas)(client, {
			...request,
			account: { address: account.address, type: 'json-rpc' },
		})
	;(0, assertRequest_js_1.assertRequest)(request)
	return request
}
exports.prepareTransactionRequest = prepareTransactionRequest
//# sourceMappingURL=prepareTransactionRequest.js.map
