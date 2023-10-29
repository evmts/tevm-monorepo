'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.defineTransactionRequest =
	exports.formatTransactionRequest =
	exports.rpcTransactionType =
		void 0
const toHex_js_1 = require('../encoding/toHex.js')
const formatter_js_1 = require('./formatter.js')
exports.rpcTransactionType = {
	legacy: '0x0',
	eip2930: '0x1',
	eip1559: '0x2',
}
function formatTransactionRequest(transactionRequest) {
	return {
		...transactionRequest,
		gas:
			typeof transactionRequest.gas !== 'undefined'
				? (0, toHex_js_1.numberToHex)(transactionRequest.gas)
				: undefined,
		gasPrice:
			typeof transactionRequest.gasPrice !== 'undefined'
				? (0, toHex_js_1.numberToHex)(transactionRequest.gasPrice)
				: undefined,
		maxFeePerGas:
			typeof transactionRequest.maxFeePerGas !== 'undefined'
				? (0, toHex_js_1.numberToHex)(transactionRequest.maxFeePerGas)
				: undefined,
		maxPriorityFeePerGas:
			typeof transactionRequest.maxPriorityFeePerGas !== 'undefined'
				? (0, toHex_js_1.numberToHex)(transactionRequest.maxPriorityFeePerGas)
				: undefined,
		nonce:
			typeof transactionRequest.nonce !== 'undefined'
				? (0, toHex_js_1.numberToHex)(transactionRequest.nonce)
				: undefined,
		type:
			typeof transactionRequest.type !== 'undefined'
				? exports.rpcTransactionType[transactionRequest.type]
				: undefined,
		value:
			typeof transactionRequest.value !== 'undefined'
				? (0, toHex_js_1.numberToHex)(transactionRequest.value)
				: undefined,
	}
}
exports.formatTransactionRequest = formatTransactionRequest
exports.defineTransactionRequest = (0, formatter_js_1.defineFormatter)(
	'transactionRequest',
	formatTransactionRequest,
)
//# sourceMappingURL=transactionRequest.js.map
