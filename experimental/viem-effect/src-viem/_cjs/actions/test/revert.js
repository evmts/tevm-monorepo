'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.revert = void 0
async function revert(client, { id }) {
	await client.request({
		method: 'evm_revert',
		params: [id],
	})
}
exports.revert = revert
//# sourceMappingURL=revert.js.map
