'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.setNonce = void 0
const toHex_js_1 = require('../../utils/encoding/toHex.js')
async function setNonce(client, { address, nonce }) {
	await client.request({
		method: `${client.mode}_setNonce`,
		params: [address, (0, toHex_js_1.numberToHex)(nonce)],
	})
}
exports.setNonce = setNonce
//# sourceMappingURL=setNonce.js.map
