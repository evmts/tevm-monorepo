'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.formattersCelo = void 0
const fromHex_js_1 = require('../../utils/encoding/fromHex.js')
const toHex_js_1 = require('../../utils/encoding/toHex.js')
const block_js_1 = require('../../utils/formatters/block.js')
const transaction_js_1 = require('../../utils/formatters/transaction.js')
const transactionReceipt_js_1 = require('../../utils/formatters/transactionReceipt.js')
const transactionRequest_js_1 = require('../../utils/formatters/transactionRequest.js')
exports.formattersCelo = {
	block: (0, block_js_1.defineBlock)({
		exclude: ['difficulty', 'gasLimit', 'mixHash', 'nonce', 'uncles'],
		format(args) {
			const transactions = args.transactions?.map((transaction) => {
				if (typeof transaction === 'string') return transaction
				return {
					...(0, transaction_js_1.formatTransaction)(transaction),
					feeCurrency: transaction.feeCurrency,
					gatewayFee: transaction.gatewayFee
						? (0, fromHex_js_1.hexToBigInt)(transaction.gatewayFee)
						: null,
					gatewayFeeRecipient: transaction.gatewayFeeRecipient,
				}
			})
			return {
				randomness: args.randomness,
				transactions,
			}
		},
	}),
	transaction: (0, transaction_js_1.defineTransaction)({
		format(args) {
			return {
				feeCurrency: args.feeCurrency,
				gatewayFee: args.gatewayFee
					? (0, fromHex_js_1.hexToBigInt)(args.gatewayFee)
					: null,
				gatewayFeeRecipient: args.gatewayFeeRecipient,
			}
		},
	}),
	transactionReceipt: (0, transactionReceipt_js_1.defineTransactionReceipt)({
		format(args) {
			return {
				feeCurrency: args.feeCurrency,
				gatewayFee: args.gatewayFee
					? (0, fromHex_js_1.hexToBigInt)(args.gatewayFee)
					: null,
				gatewayFeeRecipient: args.gatewayFeeRecipient,
			}
		},
	}),
	transactionRequest: (0, transactionRequest_js_1.defineTransactionRequest)({
		format(args) {
			const request = {
				feeCurrency: args.feeCurrency,
				gatewayFee:
					typeof args.gatewayFee !== 'undefined'
						? (0, toHex_js_1.numberToHex)(args.gatewayFee)
						: undefined,
				gatewayFeeRecipient: args.gatewayFeeRecipient,
			}
			if (args.type === 'cip42') request.type = '0x7c'
			return request
		},
	}),
}
//# sourceMappingURL=formatters.js.map
