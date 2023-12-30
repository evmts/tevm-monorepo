'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.mine = void 0
const toHex_js_1 = require('../../utils/encoding/toHex.js')
async function mine(client, { blocks, interval }) {
	if (client.mode === 'ganache')
		await client.request({
			method: 'evm_mine',
			params: [{ blocks: (0, toHex_js_1.numberToHex)(blocks) }],
		})
	else
		await client.request({
			method: `${client.mode}_mine`,
			params: [
				(0, toHex_js_1.numberToHex)(blocks),
				(0, toHex_js_1.numberToHex)(interval || 0),
			],
		})
}
exports.mine = mine
//# sourceMappingURL=mine.js.map
