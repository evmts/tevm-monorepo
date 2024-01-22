'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getSerializedTransactionType = void 0
const transaction_js_1 = require('../../errors/transaction.js')
const slice_js_1 = require('../data/slice.js')
const fromHex_js_1 = require('../encoding/fromHex.js')
function getSerializedTransactionType(serializedTransaction) {
	const serializedType = (0, slice_js_1.sliceHex)(serializedTransaction, 0, 1)
	if (serializedType === '0x02') return 'eip1559'
	if (serializedType === '0x01') return 'eip2930'
	if (
		serializedType !== '0x' &&
		(0, fromHex_js_1.hexToNumber)(serializedType) >= 0xc0
	)
		return 'legacy'
	throw new transaction_js_1.InvalidSerializedTransactionTypeError({
		serializedType,
	})
}
exports.getSerializedTransactionType = getSerializedTransactionType
//# sourceMappingURL=getSerializedTransactionType.js.map
