'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.isArgOfType = exports.getAbiItem = void 0
const isHex_js_1 = require('../../utils/data/isHex.js')
const getEventSelector_js_1 = require('../../utils/hash/getEventSelector.js')
const getFunctionSelector_js_1 = require('../../utils/hash/getFunctionSelector.js')
const isAddress_js_1 = require('../address/isAddress.js')
function getAbiItem({ abi, args = [], name }) {
	const isSelector = (0, isHex_js_1.isHex)(name, { strict: false })
	const abiItems = abi.filter((abiItem) => {
		if (isSelector) {
			if (abiItem.type === 'function')
				return (
					(0, getFunctionSelector_js_1.getFunctionSelector)(abiItem) === name
				)
			if (abiItem.type === 'event')
				return (0, getEventSelector_js_1.getEventSelector)(abiItem) === name
			return false
		}
		return 'name' in abiItem && abiItem.name === name
	})
	if (abiItems.length === 0) return undefined
	if (abiItems.length === 1) return abiItems[0]
	for (const abiItem of abiItems) {
		if (!('inputs' in abiItem)) continue
		if (!args || args.length === 0) {
			if (!abiItem.inputs || abiItem.inputs.length === 0) return abiItem
			continue
		}
		if (!abiItem.inputs) continue
		if (abiItem.inputs.length === 0) continue
		if (abiItem.inputs.length !== args.length) continue
		const matched = args.every((arg, index) => {
			const abiParameter = 'inputs' in abiItem && abiItem.inputs[index]
			if (!abiParameter) return false
			return isArgOfType(arg, abiParameter)
		})
		if (matched) return abiItem
	}
	return abiItems[0]
}
exports.getAbiItem = getAbiItem
function isArgOfType(arg, abiParameter) {
	const argType = typeof arg
	const abiParameterType = abiParameter.type
	switch (abiParameterType) {
		case 'address':
			return (0, isAddress_js_1.isAddress)(arg)
		case 'bool':
			return argType === 'boolean'
		case 'function':
			return argType === 'string'
		case 'string':
			return argType === 'string'
		default: {
			if (abiParameterType === 'tuple' && 'components' in abiParameter)
				return Object.values(abiParameter.components).every(
					(component, index) => {
						return isArgOfType(Object.values(arg)[index], component)
					},
				)
			if (
				/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(
					abiParameterType,
				)
			)
				return argType === 'number' || argType === 'bigint'
			if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType))
				return argType === 'string' || arg instanceof Uint8Array
			if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) {
				return (
					Array.isArray(arg) &&
					arg.every((x) =>
						isArgOfType(x, {
							...abiParameter,
							type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, ''),
						}),
					)
				)
			}
			return false
		}
	}
}
exports.isArgOfType = isArgOfType
//# sourceMappingURL=getAbiItem.js.map
