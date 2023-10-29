'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.watchAsset =
	exports.switchChain =
	exports.signTypedData =
	exports.signMessage =
	exports.sendTransaction =
	exports.requestPermissions =
	exports.requestAddresses =
	exports.getPermissions =
	exports.getAddresses =
	exports.addChain =
		void 0
const addChain_js_1 = require('./actions/wallet/addChain.js')
Object.defineProperty(exports, 'addChain', {
	enumerable: true,
	get: function () {
		return addChain_js_1.addChain
	},
})
const getAddresses_js_1 = require('./actions/wallet/getAddresses.js')
Object.defineProperty(exports, 'getAddresses', {
	enumerable: true,
	get: function () {
		return getAddresses_js_1.getAddresses
	},
})
const getPermissions_js_1 = require('./actions/wallet/getPermissions.js')
Object.defineProperty(exports, 'getPermissions', {
	enumerable: true,
	get: function () {
		return getPermissions_js_1.getPermissions
	},
})
const requestAddresses_js_1 = require('./actions/wallet/requestAddresses.js')
Object.defineProperty(exports, 'requestAddresses', {
	enumerable: true,
	get: function () {
		return requestAddresses_js_1.requestAddresses
	},
})
const requestPermissions_js_1 = require('./actions/wallet/requestPermissions.js')
Object.defineProperty(exports, 'requestPermissions', {
	enumerable: true,
	get: function () {
		return requestPermissions_js_1.requestPermissions
	},
})
const sendTransaction_js_1 = require('./actions/wallet/sendTransaction.js')
Object.defineProperty(exports, 'sendTransaction', {
	enumerable: true,
	get: function () {
		return sendTransaction_js_1.sendTransaction
	},
})
const signMessage_js_1 = require('./actions/wallet/signMessage.js')
Object.defineProperty(exports, 'signMessage', {
	enumerable: true,
	get: function () {
		return signMessage_js_1.signMessage
	},
})
const signTypedData_js_1 = require('./actions/wallet/signTypedData.js')
Object.defineProperty(exports, 'signTypedData', {
	enumerable: true,
	get: function () {
		return signTypedData_js_1.signTypedData
	},
})
const switchChain_js_1 = require('./actions/wallet/switchChain.js')
Object.defineProperty(exports, 'switchChain', {
	enumerable: true,
	get: function () {
		return switchChain_js_1.switchChain
	},
})
const watchAsset_js_1 = require('./actions/wallet/watchAsset.js')
Object.defineProperty(exports, 'watchAsset', {
	enumerable: true,
	get: function () {
		return watchAsset_js_1.watchAsset
	},
})
//# sourceMappingURL=wallet.js.map
