'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.InvalidAddressError = void 0
const base_js_1 = require('./base.js')
class InvalidAddressError extends base_js_1.BaseError {
	constructor({ address }) {
		super(`Address "${address}" is invalid.`)
		Object.defineProperty(this, 'name', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: 'InvalidAddressError',
		})
	}
}
exports.InvalidAddressError = InvalidAddressError
//# sourceMappingURL=address.js.map
