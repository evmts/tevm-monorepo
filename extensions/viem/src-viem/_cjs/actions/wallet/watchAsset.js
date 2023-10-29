'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.watchAsset = void 0
async function watchAsset(client, params) {
	const added = await client.request({
		method: 'wallet_watchAsset',
		params,
	})
	return added
}
exports.watchAsset = watchAsset
//# sourceMappingURL=watchAsset.js.map
