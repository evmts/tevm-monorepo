'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.setNextBlockTimestamp = void 0
const toHex_js_1 = require('../../utils/encoding/toHex.js')
async function setNextBlockTimestamp(client, { timestamp }) {
	await client.request({
		method: 'evm_setNextBlockTimestamp',
		params: [(0, toHex_js_1.numberToHex)(timestamp)],
	})
}
exports.setNextBlockTimestamp = setNextBlockTimestamp
//# sourceMappingURL=setNextBlockTimestamp.js.map
