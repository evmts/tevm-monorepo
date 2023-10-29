'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.encodeDeployData = void 0
const abi_js_1 = require('../../errors/abi.js')
const concat_js_1 = require('../data/concat.js')
const encodeAbiParameters_js_1 = require('./encodeAbiParameters.js')
const docsPath = '/docs/contract/encodeDeployData'
function encodeDeployData({ abi, args, bytecode }) {
	if (!args || args.length === 0) return bytecode
	const description = abi.find((x) => 'type' in x && x.type === 'constructor')
	if (!description) throw new abi_js_1.AbiConstructorNotFoundError({ docsPath })
	if (!('inputs' in description))
		throw new abi_js_1.AbiConstructorParamsNotFoundError({ docsPath })
	if (!description.inputs || description.inputs.length === 0)
		throw new abi_js_1.AbiConstructorParamsNotFoundError({ docsPath })
	const data = (0, encodeAbiParameters_js_1.encodeAbiParameters)(
		description.inputs,
		args,
	)
	return (0, concat_js_1.concatHex)([bytecode, data])
}
exports.encodeDeployData = encodeDeployData
//# sourceMappingURL=encodeDeployData.js.map
