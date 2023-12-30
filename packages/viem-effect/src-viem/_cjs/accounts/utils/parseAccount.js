'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.parseAccount = void 0
function parseAccount(account) {
	if (typeof account === 'string') return { address: account, type: 'json-rpc' }
	return account
}
exports.parseAccount = parseAccount
//# sourceMappingURL=parseAccount.js.map
