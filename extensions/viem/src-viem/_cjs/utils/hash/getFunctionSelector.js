'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getFunctionSelector = void 0
const slice_js_1 = require('../data/slice.js')
const hashFunction_js_1 = require('./hashFunction.js')
const getFunctionSelector = (fn) => {
	if (typeof fn === 'string')
		return (0, slice_js_1.slice)((0, hashFunction_js_1.hashFunction)(fn), 0, 4)
	return (0, slice_js_1.slice)((0, hashFunction_js_1.hashAbiItem)(fn), 0, 4)
}
exports.getFunctionSelector = getFunctionSelector
//# sourceMappingURL=getFunctionSelector.js.map
