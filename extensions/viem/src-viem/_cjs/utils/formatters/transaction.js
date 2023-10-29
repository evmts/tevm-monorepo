'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.defineTransaction =
	exports.formatTransaction =
	exports.transactionType =
		void 0
const fromHex_js_1 = require('../encoding/fromHex.js')
const formatter_js_1 = require('./formatter.js')
exports.transactionType = {
	'0x0': 'legacy',
	'0x1': 'eip2930',
	'0x2': 'eip1559',
}
function formatTransaction(transaction) {
	const transaction_ = {
		...transaction,
		blockHash: transaction.blockHash ? transaction.blockHash : null,
		blockNumber: transaction.blockNumber
			? BigInt(transaction.blockNumber)
			: null,
		chainId: transaction.chainId
			? (0, fromHex_js_1.hexToNumber)(transaction.chainId)
			: undefined,
		gas: transaction.gas ? BigInt(transaction.gas) : undefined,
		gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : undefined,
		maxFeePerGas: transaction.maxFeePerGas
			? BigInt(transaction.maxFeePerGas)
			: undefined,
		maxPriorityFeePerGas: transaction.maxPriorityFeePerGas
			? BigInt(transaction.maxPriorityFeePerGas)
			: undefined,
		nonce: transaction.nonce
			? (0, fromHex_js_1.hexToNumber)(transaction.nonce)
			: undefined,
		to: transaction.to ? transaction.to : null,
		transactionIndex: transaction.transactionIndex
			? Number(transaction.transactionIndex)
			: null,
		type: transaction.type
			? exports.transactionType[transaction.type]
			: undefined,
		typeHex: transaction.type ? transaction.type : undefined,
		value: transaction.value ? BigInt(transaction.value) : undefined,
		v: transaction.v ? BigInt(transaction.v) : undefined,
	}
	if (transaction_.type === 'legacy') {
		delete transaction_.accessList
		delete transaction_.maxFeePerGas
		delete transaction_.maxPriorityFeePerGas
	}
	if (transaction_.type === 'eip2930') {
		delete transaction_.maxFeePerGas
		delete transaction_.maxPriorityFeePerGas
	}
	return transaction_
}
exports.formatTransaction = formatTransaction
exports.defineTransaction = (0, formatter_js_1.defineFormatter)(
	'transaction',
	formatTransaction,
)
//# sourceMappingURL=transaction.js.map
