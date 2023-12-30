'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.setRpcUrl = void 0
async function setRpcUrl(client, jsonRpcUrl) {
	await client.request({
		method: `${client.mode}_setRpcUrl`,
		params: [jsonRpcUrl],
	})
}
exports.setRpcUrl = setRpcUrl
//# sourceMappingURL=setRpcUrl.js.map
