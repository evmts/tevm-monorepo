'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.signTypedData = void 0
const hashTypedData_js_1 = require('../../utils/signature/hashTypedData.js')
const signatureToHex_js_1 = require('../../utils/signature/signatureToHex.js')
const sign_js_1 = require('./sign.js')
async function signTypedData({ privateKey, ...typedData }) {
	const signature = await (0, sign_js_1.sign)({
		hash: (0, hashTypedData_js_1.hashTypedData)(typedData),
		privateKey,
	})
	return (0, signatureToHex_js_1.signatureToHex)(signature)
}
exports.signTypedData = signTypedData
//# sourceMappingURL=signTypedData.js.map
