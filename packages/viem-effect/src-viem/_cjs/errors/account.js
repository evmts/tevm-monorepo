'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.AccountNotFoundError = void 0
const base_js_1 = require('./base.js')
class AccountNotFoundError extends base_js_1.BaseError {
	constructor({ docsPath } = {}) {
		super(
			[
				'Could not find an Account to execute with this Action.',
				'Please provide an Account with the `account` argument on the Action, or by supplying an `account` to the WalletClient.',
			].join('\n'),
			{
				docsPath,
				docsSlug: 'account',
			},
		)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'AccountNotFoundError',
		})
	}
}
exports.AccountNotFoundError = AccountNotFoundError
//# sourceMappingURL=account.js.map
