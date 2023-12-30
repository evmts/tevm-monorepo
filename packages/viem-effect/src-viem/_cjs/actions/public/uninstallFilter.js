'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.uninstallFilter = void 0
async function uninstallFilter(_client, { filter }) {
	return filter.request({
		method: 'eth_uninstallFilter',
		params: [filter.id],
	})
}
exports.uninstallFilter = uninstallFilter
//# sourceMappingURL=uninstallFilter.js.map
