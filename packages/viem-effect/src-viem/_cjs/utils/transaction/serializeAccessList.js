'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.serializeAccessList = void 0
const address_js_1 = require('../../errors/address.js')
const transaction_js_1 = require('../../errors/transaction.js')
const isAddress_js_1 = require('../address/isAddress.js')
function serializeAccessList(accessList) {
	if (!accessList || accessList.length === 0) return []
	const serializedAccessList = []
	for (let i = 0; i < accessList.length; i++) {
		const { address, storageKeys } = accessList[i]
		for (let j = 0; j < storageKeys.length; j++) {
			if (storageKeys[j].length - 2 !== 64) {
				throw new transaction_js_1.InvalidStorageKeySizeError({
					storageKey: storageKeys[j],
				})
			}
		}
		if (!(0, isAddress_js_1.isAddress)(address)) {
			throw new address_js_1.InvalidAddressError({ address })
		}
		serializedAccessList.push([address, storageKeys])
	}
	return serializedAccessList
}
exports.serializeAccessList = serializeAccessList
//# sourceMappingURL=serializeAccessList.js.map
