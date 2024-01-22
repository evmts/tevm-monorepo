'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.impersonateAccount = void 0
async function impersonateAccount(client, { address }) {
	await client.request({
		method: `${client.mode}_impersonateAccount`,
		params: [address],
	})
}
exports.impersonateAccount = impersonateAccount
//# sourceMappingURL=impersonateAccount.js.map
