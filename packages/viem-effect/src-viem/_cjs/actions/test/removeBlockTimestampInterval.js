'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.removeBlockTimestampInterval = void 0
async function removeBlockTimestampInterval(client) {
	await client.request({
		method: `${client.mode}_removeBlockTimestampInterval`,
	})
}
exports.removeBlockTimestampInterval = removeBlockTimestampInterval
//# sourceMappingURL=removeBlockTimestampInterval.js.map
