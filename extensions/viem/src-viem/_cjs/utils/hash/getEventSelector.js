'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.getEventSelector = void 0
const hashFunction_js_1 = require('./hashFunction.js')
const getEventSelector = (event) => {
	if (typeof event === 'string')
		return (0, hashFunction_js_1.hashFunction)(event)
	return (0, hashFunction_js_1.hashAbiItem)(event)
}
exports.getEventSelector = getEventSelector
//# sourceMappingURL=getEventSelector.js.map
