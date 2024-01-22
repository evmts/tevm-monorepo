'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.encodeFunctionResult = void 0
const abi_js_1 = require('../../errors/abi.js')
const encodeAbiParameters_js_1 = require('./encodeAbiParameters.js')
const getAbiItem_js_1 = require('./getAbiItem.js')
const docsPath = '/docs/contract/encodeFunctionResult'
function encodeFunctionResult({ abi, functionName, result }) {
	let abiItem = abi[0]
	if (functionName) {
		abiItem = (0, getAbiItem_js_1.getAbiItem)({
			abi,
			name: functionName,
		})
		if (!abiItem)
			throw new abi_js_1.AbiFunctionNotFoundError(functionName, {
				docsPath: '/docs/contract/encodeFunctionResult',
			})
	}
	if (abiItem.type !== 'function')
		throw new abi_js_1.AbiFunctionNotFoundError(undefined, {
			docsPath: '/docs/contract/encodeFunctionResult',
		})
	if (!abiItem.outputs)
		throw new abi_js_1.AbiFunctionOutputsNotFoundError(abiItem.name, {
			docsPath,
		})
	let values = Array.isArray(result) ? result : [result]
	if (abiItem.outputs.length === 0 && !values[0]) values = []
	return (0, encodeAbiParameters_js_1.encodeAbiParameters)(
		abiItem.outputs,
		values,
	)
}
exports.encodeFunctionResult = encodeFunctionResult
//# sourceMappingURL=encodeFunctionResult.js.map
