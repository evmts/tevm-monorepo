'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.signTransaction = void 0
const keccak256_js_1 = require('../../utils/hash/keccak256.js')
const serializeTransaction_js_1 = require('../../utils/transaction/serializeTransaction.js')
const sign_js_1 = require('./sign.js')
async function signTransaction({
	privateKey,
	transaction,
	serializer = serializeTransaction_js_1.serializeTransaction,
}) {
	const signature = await (0, sign_js_1.sign)({
		hash: (0, keccak256_js_1.keccak256)(serializer(transaction)),
		privateKey,
	})
	return serializer(transaction, signature)
}
exports.signTransaction = signTransaction
//# sourceMappingURL=signTransaction.js.map
