'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getChainId = void 0
const fromHex_js_1 = require('../../utils/encoding/fromHex.js')
async function getChainId(client) {
	const chainIdHex = await client.request({
		method: 'eth_chainId',
	})
	return (0, fromHex_js_1.hexToNumber)(chainIdHex)
}
exports.getChainId = getChainId
//# sourceMappingURL=getChainId.js.map
