'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.privateKeyToAccount = void 0
const secp256k1_1 = require('@noble/curves/secp256k1')
const toHex_js_1 = require('../utils/encoding/toHex.js')
const toAccount_js_1 = require('./toAccount.js')
const publicKeyToAddress_js_1 = require('./utils/publicKeyToAddress.js')
const signMessage_js_1 = require('./utils/signMessage.js')
const signTransaction_js_1 = require('./utils/signTransaction.js')
const signTypedData_js_1 = require('./utils/signTypedData.js')
function privateKeyToAccount(privateKey) {
	const publicKey = (0, toHex_js_1.toHex)(
		secp256k1_1.secp256k1.getPublicKey(privateKey.slice(2), false),
	)
	const address = (0, publicKeyToAddress_js_1.publicKeyToAddress)(publicKey)
	const account = (0, toAccount_js_1.toAccount)({
		address,
		async signMessage({ message }) {
			return (0, signMessage_js_1.signMessage)({ message, privateKey })
		},
		async signTransaction(transaction, { serializer } = {}) {
			return (0, signTransaction_js_1.signTransaction)({
				privateKey,
				transaction,
				serializer,
			})
		},
		async signTypedData(typedData) {
			return (0, signTypedData_js_1.signTypedData)({ ...typedData, privateKey })
		},
	})
	return {
		...account,
		publicKey,
		source: 'privateKey',
	}
}
exports.privateKeyToAccount = privateKeyToAccount
//# sourceMappingURL=privateKeyToAccount.js.map
