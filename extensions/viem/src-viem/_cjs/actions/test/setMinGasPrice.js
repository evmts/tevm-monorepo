'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.setMinGasPrice = void 0
const toHex_js_1 = require('../../utils/encoding/toHex.js')
async function setMinGasPrice(client, { gasPrice }) {
	await client.request({
		method: `${client.mode}_setMinGasPrice`,
		params: [(0, toHex_js_1.numberToHex)(gasPrice)],
	})
}
exports.setMinGasPrice = setMinGasPrice
//# sourceMappingURL=setMinGasPrice.js.map
