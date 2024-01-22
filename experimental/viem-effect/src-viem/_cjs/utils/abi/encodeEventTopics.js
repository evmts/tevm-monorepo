'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.encodeEventTopics = void 0
const abi_js_1 = require('../../errors/abi.js')
const log_js_1 = require('../../errors/log.js')
const toBytes_js_1 = require('../encoding/toBytes.js')
const getEventSelector_js_1 = require('../hash/getEventSelector.js')
const keccak256_js_1 = require('../hash/keccak256.js')
const encodeAbiParameters_js_1 = require('./encodeAbiParameters.js')
const formatAbiItem_js_1 = require('./formatAbiItem.js')
const getAbiItem_js_1 = require('./getAbiItem.js')
function encodeEventTopics({ abi, eventName, args }) {
	let abiItem = abi[0]
	if (eventName) {
		abiItem = (0, getAbiItem_js_1.getAbiItem)({
			abi,
			args,
			name: eventName,
		})
		if (!abiItem)
			throw new abi_js_1.AbiEventNotFoundError(eventName, {
				docsPath: '/docs/contract/encodeEventTopics',
			})
	}
	if (abiItem.type !== 'event')
		throw new abi_js_1.AbiEventNotFoundError(undefined, {
			docsPath: '/docs/contract/encodeEventTopics',
		})
	const definition = (0, formatAbiItem_js_1.formatAbiItem)(abiItem)
	const signature = (0, getEventSelector_js_1.getEventSelector)(definition)
	let topics = []
	if (args && 'inputs' in abiItem) {
		const indexedInputs = abiItem.inputs?.filter(
			(param) => 'indexed' in param && param.indexed,
		)
		const args_ = Array.isArray(args)
			? args
			: Object.values(args).length > 0
			? indexedInputs?.map((x) => args[x.name]) ?? []
			: []
		if (args_.length > 0) {
			topics =
				indexedInputs?.map((param, i) =>
					Array.isArray(args_[i])
						? args_[i].map((_, j) => encodeArg({ param, value: args_[i][j] }))
						: args_[i]
						? encodeArg({ param, value: args_[i] })
						: null,
				) ?? []
		}
	}
	return [signature, ...topics]
}
exports.encodeEventTopics = encodeEventTopics
function encodeArg({ param, value }) {
	if (param.type === 'string' || param.type === 'bytes')
		return (0, keccak256_js_1.keccak256)((0, toBytes_js_1.toBytes)(value))
	if (param.type === 'tuple' || param.type.match(/^(.*)\[(\d+)?\]$/))
		throw new log_js_1.FilterTypeNotSupportedError(param.type)
	return (0, encodeAbiParameters_js_1.encodeAbiParameters)([param], [value])
}
//# sourceMappingURL=encodeEventTopics.js.map
