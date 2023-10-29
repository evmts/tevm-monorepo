'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.reset = void 0
async function reset(client, { blockNumber, jsonRpcUrl } = {}) {
	await client.request({
		method: `${client.mode}_reset`,
		params: [{ forking: { blockNumber: Number(blockNumber), jsonRpcUrl } }],
	})
}
exports.reset = reset
//# sourceMappingURL=reset.js.map
