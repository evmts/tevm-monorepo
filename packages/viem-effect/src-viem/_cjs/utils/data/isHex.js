'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.isHex = void 0
function isHex(value, { strict = true } = {}) {
	if (!value) return false
	if (typeof value !== 'string') return false
	return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith('0x')
}
exports.isHex = isHex
//# sourceMappingURL=isHex.js.map
