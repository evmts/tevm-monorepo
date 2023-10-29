'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.decodeFunctionResult = void 0
const abi_js_1 = require('../../errors/abi.js')
const decodeAbiParameters_js_1 = require('./decodeAbiParameters.js')
const getAbiItem_js_1 = require('./getAbiItem.js')
const docsPath = '/docs/contract/decodeFunctionResult'
function decodeFunctionResult({ abi, args, functionName, data }) {
	let abiItem = abi[0]
	if (functionName) {
		abiItem = (0, getAbiItem_js_1.getAbiItem)({
			abi,
			args,
			name: functionName,
		})
		if (!abiItem)
			throw new abi_js_1.AbiFunctionNotFoundError(functionName, { docsPath })
	}
	if (abiItem.type !== 'function')
		throw new abi_js_1.AbiFunctionNotFoundError(undefined, { docsPath })
	if (!abiItem.outputs)
		throw new abi_js_1.AbiFunctionOutputsNotFoundError(abiItem.name, {
			docsPath,
		})
	const values = (0, decodeAbiParameters_js_1.decodeAbiParameters)(
		abiItem.outputs,
		data,
	)
	if (values && values.length > 1) return values
	if (values && values.length === 1) return values[0]
	return undefined
}
exports.decodeFunctionResult = decodeFunctionResult
//# sourceMappingURL=decodeFunctionResult.js.map
