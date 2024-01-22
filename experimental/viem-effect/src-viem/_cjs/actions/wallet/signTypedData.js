'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.signTypedData = void 0
const parseAccount_js_1 = require('../../accounts/utils/parseAccount.js')
const account_js_1 = require('../../errors/account.js')
const isHex_js_1 = require('../../utils/data/isHex.js')
const stringify_js_1 = require('../../utils/stringify.js')
const typedData_js_1 = require('../../utils/typedData.js')
async function signTypedData(
	client,
	{
		account: account_ = client.account,
		domain,
		message,
		primaryType,
		types: types_,
	},
) {
	if (!account_)
		throw new account_js_1.AccountNotFoundError({
			docsPath: '/docs/actions/wallet/signTypedData',
		})
	const account = (0, parseAccount_js_1.parseAccount)(account_)
	const types = {
		EIP712Domain: (0, typedData_js_1.getTypesForEIP712Domain)({ domain }),
		...types_,
	}
	;(0, typedData_js_1.validateTypedData)({
		domain,
		message,
		primaryType,
		types,
	})
	if (account.type === 'local')
		return account.signTypedData({
			domain,
			primaryType,
			types,
			message,
		})
	const typedData = (0, stringify_js_1.stringify)(
		{ domain: domain ?? {}, primaryType, types, message },
		(_, value) => ((0, isHex_js_1.isHex)(value) ? value.toLowerCase() : value),
	)
	return client.request({
		method: 'eth_signTypedData_v4',
		params: [account.address, typedData],
	})
}
exports.signTypedData = signTypedData
//# sourceMappingURL=signTypedData.js.map
