'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.requestAddresses = void 0
const getAddress_js_1 = require('../../utils/address/getAddress.js')
async function requestAddresses(client) {
	const addresses = await client.request({ method: 'eth_requestAccounts' })
	return addresses.map((address) => (0, getAddress_js_1.getAddress)(address))
}
exports.requestAddresses = requestAddresses
//# sourceMappingURL=requestAddresses.js.map
