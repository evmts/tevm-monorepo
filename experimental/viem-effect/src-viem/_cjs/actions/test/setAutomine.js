'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.setAutomine = void 0
async function setAutomine(client, enabled) {
	if (client.mode === 'ganache') {
		if (enabled) await client.request({ method: 'miner_start' })
		else await client.request({ method: 'miner_stop' })
	} else
		await client.request({
			method: 'evm_setAutomine',
			params: [enabled],
		})
}
exports.setAutomine = setAutomine
//# sourceMappingURL=setAutomine.js.map
