'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.hdKeyToAccount = void 0
const toHex_js_1 = require('../utils/encoding/toHex.js')
const privateKeyToAccount_js_1 = require('./privateKeyToAccount.js')
function hdKeyToAccount(
	hdKey_,
	{ accountIndex = 0, addressIndex = 0, changeIndex = 0, path } = {},
) {
	const hdKey = hdKey_.derive(
		path || `m/44'/60'/${accountIndex}'/${changeIndex}/${addressIndex}`,
	)
	const account = (0, privateKeyToAccount_js_1.privateKeyToAccount)(
		(0, toHex_js_1.toHex)(hdKey.privateKey),
	)
	return {
		...account,
		getHdKey: () => hdKey,
		source: 'hd',
	}
}
exports.hdKeyToAccount = hdKeyToAccount
//# sourceMappingURL=hdKeyToAccount.js.map
