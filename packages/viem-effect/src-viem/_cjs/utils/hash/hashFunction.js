'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.hashAbiItem = exports.hashFunction = void 0
const formatAbiItem_js_1 = require('../abi/formatAbiItem.js')
const extractFunctionParts_js_1 = require('../contract/extractFunctionParts.js')
const toBytes_js_1 = require('../encoding/toBytes.js')
const keccak256_js_1 = require('./keccak256.js')
const hash = (value) =>
	(0, keccak256_js_1.keccak256)((0, toBytes_js_1.toBytes)(value))
function hashFunction(def) {
	const name = (0, extractFunctionParts_js_1.extractFunctionName)(def)
	const params = (0, extractFunctionParts_js_1.extractFunctionParams)(def) || []
	return hash(`${name}(${params.map(({ type }) => type).join(',')})`)
}
exports.hashFunction = hashFunction
function hashAbiItem(abiItem) {
	return hash((0, formatAbiItem_js_1.formatAbiItem)(abiItem))
}
exports.hashAbiItem = hashAbiItem
//# sourceMappingURL=hashFunction.js.map
