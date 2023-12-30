'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.bytesToRlp = exports.toRlp = void 0
const concat_js_1 = require('../data/concat.js')
const toBytes_js_1 = require('./toBytes.js')
const toHex_js_1 = require('./toHex.js')
function toRlp(hexOrBytes, to_) {
	const to = to_ || 'hex'
	return format(bytesToRlp(parse(hexOrBytes)), to)
}
exports.toRlp = toRlp
function parse(hexOrBytes) {
	if (Array.isArray(hexOrBytes)) return hexOrBytes.map(parse)
	return typeof hexOrBytes === 'string'
		? (0, toBytes_js_1.toBytes)(hexOrBytes)
		: hexOrBytes
}
function format(bytes, type = 'bytes') {
	return type === 'hex' ? (0, toHex_js_1.bytesToHex)(bytes) : bytes
}
function bytesToRlp(bytes) {
	if (Array.isArray(bytes)) {
		const encoded = (0, concat_js_1.concat)(bytes.map(bytesToRlp))
		return new Uint8Array([...encodeLength(encoded.length, 0xc0), ...encoded])
	}
	if (bytes.length === 1 && bytes[0] < 0x80) return bytes
	return new Uint8Array([...encodeLength(bytes.length, 0x80), ...bytes])
}
exports.bytesToRlp = bytesToRlp
function encodeLength(length, offset) {
	if (length < 56) return [offset + length]
	return [
		(0, toBytes_js_1.toBytes)(length).length + offset + 55,
		...(0, toBytes_js_1.toBytes)(length),
	]
}
//# sourceMappingURL=toRlp.js.map
