'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.concatHex = exports.concatBytes = exports.concat = void 0
function concat(values) {
	if (typeof values[0] === 'string') return concatHex(values)
	return concatBytes(values)
}
exports.concat = concat
function concatBytes(values) {
	let length = 0
	for (const arr of values) {
		length += arr.length
	}
	const result = new Uint8Array(length)
	let offset = 0
	for (const arr of values) {
		result.set(arr, offset)
		offset += arr.length
	}
	return result
}
exports.concatBytes = concatBytes
function concatHex(values) {
	return `0x${values.reduce((acc, x) => acc + x.replace('0x', ''), '')}`
}
exports.concatHex = concatHex
//# sourceMappingURL=concat.js.map
