'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.decodeAbiParameters = void 0
const abi_js_1 = require('../../errors/abi.js')
const getAddress_js_1 = require('../address/getAddress.js')
const size_js_1 = require('../data/size.js')
const slice_js_1 = require('../data/slice.js')
const trim_js_1 = require('../data/trim.js')
const fromHex_js_1 = require('../encoding/fromHex.js')
const encodeAbiParameters_js_1 = require('./encodeAbiParameters.js')
function decodeAbiParameters(params, data) {
	if (data === '0x' && params.length > 0)
		throw new abi_js_1.AbiDecodingZeroDataError()
	if ((0, size_js_1.size)(data) && (0, size_js_1.size)(data) < 32)
		throw new abi_js_1.AbiDecodingDataSizeTooSmallError({
			data,
			params: params,
			size: (0, size_js_1.size)(data),
		})
	return decodeParams({
		data,
		params: params,
	})
}
exports.decodeAbiParameters = decodeAbiParameters
function decodeParams({ data, params }) {
	const decodedValues = []
	let position = 0
	for (let i = 0; i < params.length; i++) {
		if (position >= (0, size_js_1.size)(data))
			throw new abi_js_1.AbiDecodingDataSizeTooSmallError({
				data,
				params,
				size: (0, size_js_1.size)(data),
			})
		const param = params[i]
		const { consumed, value } = decodeParam({ data, param, position })
		decodedValues.push(value)
		position += consumed
	}
	return decodedValues
}
function decodeParam({ data, param, position }) {
	const arrayComponents = (0, encodeAbiParameters_js_1.getArrayComponents)(
		param.type,
	)
	if (arrayComponents) {
		const [length, type] = arrayComponents
		return decodeArray(data, {
			length,
			param: { ...param, type: type },
			position,
		})
	}
	if (param.type === 'tuple') {
		return decodeTuple(data, { param: param, position })
	}
	if (param.type === 'string') {
		return decodeString(data, { position })
	}
	if (param.type.startsWith('bytes')) {
		return decodeBytes(data, { param, position })
	}
	const value = (0, slice_js_1.slice)(data, position, position + 32, {
		strict: true,
	})
	if (param.type.startsWith('uint') || param.type.startsWith('int')) {
		return decodeNumber(value, { param })
	}
	if (param.type === 'address') {
		return decodeAddress(value)
	}
	if (param.type === 'bool') {
		return decodeBool(value)
	}
	throw new abi_js_1.InvalidAbiDecodingTypeError(param.type, {
		docsPath: '/docs/contract/decodeAbiParameters',
	})
}
function decodeAddress(value) {
	return {
		consumed: 32,
		value: (0, getAddress_js_1.checksumAddress)(
			(0, slice_js_1.slice)(value, -20),
		),
	}
}
function decodeArray(data, { param, length, position }) {
	if (!length) {
		const offset = (0, fromHex_js_1.hexToNumber)(
			(0, slice_js_1.slice)(data, position, position + 32, { strict: true }),
		)
		const length = (0, fromHex_js_1.hexToNumber)(
			(0, slice_js_1.slice)(data, offset, offset + 32, { strict: true }),
		)
		let consumed = 0
		const value = []
		for (let i = 0; i < length; ++i) {
			const decodedChild = decodeParam({
				data: (0, slice_js_1.slice)(data, offset + 32),
				param,
				position: consumed,
			})
			consumed += decodedChild.consumed
			value.push(decodedChild.value)
		}
		return { value, consumed: 32 }
	}
	if (hasDynamicChild(param)) {
		const arrayComponents = (0, encodeAbiParameters_js_1.getArrayComponents)(
			param.type,
		)
		const dynamicChild = !arrayComponents?.[0]
		let consumed = 0
		const value = []
		for (let i = 0; i < length; ++i) {
			const offset = (0, fromHex_js_1.hexToNumber)(
				(0, slice_js_1.slice)(data, position, position + 32, { strict: true }),
			)
			const decodedChild = decodeParam({
				data: (0, slice_js_1.slice)(data, offset),
				param,
				position: dynamicChild ? consumed : i * 32,
			})
			consumed += decodedChild.consumed
			value.push(decodedChild.value)
		}
		return { value, consumed: 32 }
	}
	let consumed = 0
	const value = []
	for (let i = 0; i < length; ++i) {
		const decodedChild = decodeParam({
			data,
			param,
			position: position + consumed,
		})
		consumed += decodedChild.consumed
		value.push(decodedChild.value)
	}
	return { value, consumed }
}
function decodeBool(value) {
	return { consumed: 32, value: (0, fromHex_js_1.hexToBool)(value) }
}
function decodeBytes(data, { param, position }) {
	const [_, size] = param.type.split('bytes')
	if (!size) {
		const offset = (0, fromHex_js_1.hexToNumber)(
			(0, slice_js_1.slice)(data, position, position + 32, { strict: true }),
		)
		const length = (0, fromHex_js_1.hexToNumber)(
			(0, slice_js_1.slice)(data, offset, offset + 32, { strict: true }),
		)
		if (length === 0) return { consumed: 32, value: '0x' }
		const value = (0, slice_js_1.slice)(
			data,
			offset + 32,
			offset + 32 + length,
			{
				strict: true,
			},
		)
		return { consumed: 32, value }
	}
	const value = (0, slice_js_1.slice)(
		data,
		position,
		position + parseInt(size),
		{
			strict: true,
		},
	)
	return { consumed: 32, value }
}
function decodeNumber(value, { param }) {
	const signed = param.type.startsWith('int')
	const size = parseInt(param.type.split('int')[1] || '256')
	return {
		consumed: 32,
		value:
			size > 48
				? (0, fromHex_js_1.hexToBigInt)(value, { signed })
				: (0, fromHex_js_1.hexToNumber)(value, { signed }),
	}
}
function decodeString(data, { position }) {
	const offset = (0, fromHex_js_1.hexToNumber)(
		(0, slice_js_1.slice)(data, position, position + 32, { strict: true }),
	)
	const length = (0, fromHex_js_1.hexToNumber)(
		(0, slice_js_1.slice)(data, offset, offset + 32, { strict: true }),
	)
	if (length === 0) return { consumed: 32, value: '' }
	const value = (0, fromHex_js_1.hexToString)(
		(0, trim_js_1.trim)(
			(0, slice_js_1.slice)(data, offset + 32, offset + 32 + length, {
				strict: true,
			}),
		),
	)
	return { consumed: 32, value }
}
function decodeTuple(data, { param, position }) {
	const hasUnnamedChild =
		param.components.length === 0 || param.components.some(({ name }) => !name)
	const value = hasUnnamedChild ? [] : {}
	let consumed = 0
	if (hasDynamicChild(param)) {
		const offset = (0, fromHex_js_1.hexToNumber)(
			(0, slice_js_1.slice)(data, position, position + 32, { strict: true }),
		)
		for (let i = 0; i < param.components.length; ++i) {
			const component = param.components[i]
			const decodedChild = decodeParam({
				data: (0, slice_js_1.slice)(data, offset),
				param: component,
				position: consumed,
			})
			consumed += decodedChild.consumed
			value[hasUnnamedChild ? i : component?.name] = decodedChild.value
		}
		return { consumed: 32, value }
	}
	for (let i = 0; i < param.components.length; ++i) {
		const component = param.components[i]
		const decodedChild = decodeParam({
			data,
			param: component,
			position: position + consumed,
		})
		consumed += decodedChild.consumed
		value[hasUnnamedChild ? i : component?.name] = decodedChild.value
	}
	return { consumed, value }
}
function hasDynamicChild(param) {
	const { type } = param
	if (type === 'string') return true
	if (type === 'bytes') return true
	if (type.endsWith('[]')) return true
	if (type === 'tuple') return param.components?.some(hasDynamicChild)
	const arrayComponents = (0, encodeAbiParameters_js_1.getArrayComponents)(
		param.type,
	)
	if (
		arrayComponents &&
		hasDynamicChild({ ...param, type: arrayComponents[1] })
	)
		return true
	return false
}
//# sourceMappingURL=decodeAbiParameters.js.map
