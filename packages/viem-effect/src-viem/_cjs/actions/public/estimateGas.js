'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.estimateGas = void 0
const parseAccount_js_1 = require('../../accounts/utils/parseAccount.js')
const account_js_1 = require('../../errors/account.js')
const toHex_js_1 = require('../../utils/encoding/toHex.js')
const getEstimateGasError_js_1 = require('../../utils/errors/getEstimateGasError.js')
const extract_js_1 = require('../../utils/formatters/extract.js')
const transactionRequest_js_1 = require('../../utils/formatters/transactionRequest.js')
const assertRequest_js_1 = require('../../utils/transaction/assertRequest.js')
const prepareTransactionRequest_js_1 = require('../wallet/prepareTransactionRequest.js')
async function estimateGas(client, args) {
	const account_ = args.account ?? client.account
	if (!account_)
		throw new account_js_1.AccountNotFoundError({
			docsPath: '/docs/actions/public/estimateGas',
		})
	const account = (0, parseAccount_js_1.parseAccount)(account_)
	try {
		const {
			accessList,
			blockNumber,
			blockTag,
			data,
			gas,
			gasPrice,
			maxFeePerGas,
			maxPriorityFeePerGas,
			nonce,
			to,
			value,
			...rest
		} =
			account.type === 'local'
				? await (0, prepareTransactionRequest_js_1.prepareTransactionRequest)(
						client,
						args,
				  )
				: args
		const blockNumberHex = blockNumber
			? (0, toHex_js_1.numberToHex)(blockNumber)
			: undefined
		const block = blockNumberHex || blockTag
		;(0, assertRequest_js_1.assertRequest)(args)
		const format =
			client.chain?.formatters?.transactionRequest?.format ||
			transactionRequest_js_1.formatTransactionRequest
		const request = format({
			...(0, extract_js_1.extract)(rest, { format }),
			from: account.address,
			accessList,
			data,
			gas,
			gasPrice,
			maxFeePerGas,
			maxPriorityFeePerGas,
			nonce,
			to,
			value,
		})
		const balance = await client.request({
			method: 'eth_estimateGas',
			params: block ? [request, block] : [request],
		})
		return BigInt(balance)
	} catch (err) {
		throw (0, getEstimateGasError_js_1.getEstimateGasError)(err, {
			...args,
			account,
			chain: client.chain,
		})
	}
}
exports.estimateGas = estimateGas
//# sourceMappingURL=estimateGas.js.map
