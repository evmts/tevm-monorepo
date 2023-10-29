'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.hashMessage = void 0
const concat_js_1 = require('../data/concat.js')
const toBytes_js_1 = require('../encoding/toBytes.js')
const keccak256_js_1 = require('../hash/keccak256.js')
function hashMessage(message, to_) {
	const messageBytes = (() => {
		if (typeof message === 'string')
			return (0, toBytes_js_1.stringToBytes)(message)
		if (message.raw instanceof Uint8Array) return message.raw
		return (0, toBytes_js_1.toBytes)(message.raw)
	})()
	const prefixBytes = (0, toBytes_js_1.stringToBytes)(
		`\x19Ethereum Signed Message:\n${messageBytes.length}`,
	)
	return (0, keccak256_js_1.keccak256)(
		(0, concat_js_1.concat)([prefixBytes, messageBytes]),
		to_,
	)
}
exports.hashMessage = hashMessage
//# sourceMappingURL=hashMessage.js.map
