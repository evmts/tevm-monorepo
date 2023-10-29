'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.signatureToHex = void 0
const secp256k1_1 = require('@noble/curves/secp256k1')
const fromHex_js_1 = require('../../utils/encoding/fromHex.js')
const toHex_js_1 = require('../../utils/encoding/toHex.js')
function signatureToHex({ r, s, v }) {
	return `0x${new secp256k1_1.secp256k1.Signature(
		(0, fromHex_js_1.hexToBigInt)(r),
		(0, fromHex_js_1.hexToBigInt)(s),
	).toCompactHex()}${(0, toHex_js_1.toHex)(v).slice(2)}`
}
exports.signatureToHex = signatureToHex
//# sourceMappingURL=signatureToHex.js.map
