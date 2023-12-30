'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.stringToBytes =
	exports.numberToBytes =
	exports.hexToBytes =
	exports.boolToBytes =
	exports.toBytes =
		void 0
const base_js_1 = require('../../errors/base.js')
const isHex_js_1 = require('../data/isHex.js')
const pad_js_1 = require('../data/pad.js')
const fromHex_js_1 = require('./fromHex.js')
const toHex_js_1 = require('./toHex.js')
const encoder = new TextEncoder()
function toBytes(value, opts = {}) {
	if (typeof value === 'number' || typeof value === 'bigint')
		return numberToBytes(value, opts)
	if (typeof value === 'boolean') return boolToBytes(value, opts)
	if ((0, isHex_js_1.isHex)(value)) return hexToBytes(value, opts)
	return stringToBytes(value, opts)
}
exports.toBytes = toBytes
function boolToBytes(value, opts = {}) {
	const bytes = new Uint8Array(1)
	bytes[0] = Number(value)
	if (typeof opts.size === 'number') {
		;(0, fromHex_js_1.assertSize)(bytes, { size: opts.size })
		return (0, pad_js_1.pad)(bytes, { size: opts.size })
	}
	return bytes
}
exports.boolToBytes = boolToBytes
function hexToBytes(hex_, opts = {}) {
	let hex = hex_
	if (opts.size) {
		;(0, fromHex_js_1.assertSize)(hex, { size: opts.size })
		hex = (0, pad_js_1.pad)(hex, { dir: 'right', size: opts.size })
	}
	let hexString = hex.slice(2)
	if (hexString.length % 2) hexString = `0${hexString}`
	const bytes = new Uint8Array(hexString.length / 2)
	for (let index = 0; index < bytes.length; index++) {
		const start = index * 2
		const hexByte = hexString.slice(start, start + 2)
		const byte = Number.parseInt(hexByte, 16)
		if (Number.isNaN(byte) || byte < 0)
			throw new base_js_1.BaseError(
				`Invalid byte sequence ("${hexByte}" in "${hexString}").`,
			)
		bytes[index] = byte
	}
	return bytes
}
exports.hexToBytes = hexToBytes
function numberToBytes(value, opts) {
	const hex = (0, toHex_js_1.numberToHex)(value, opts)
	return hexToBytes(hex)
}
exports.numberToBytes = numberToBytes
function stringToBytes(value, opts = {}) {
	const bytes = encoder.encode(value)
	if (typeof opts.size === 'number') {
		;(0, fromHex_js_1.assertSize)(bytes, { size: opts.size })
		return (0, pad_js_1.pad)(bytes, { dir: 'right', size: opts.size })
	}
	return bytes
}
exports.stringToBytes = stringToBytes
//# sourceMappingURL=toBytes.js.map
