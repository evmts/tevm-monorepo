import { AbiFunctionNotFoundError } from '../../errors/abi.js'
import { concatHex } from '../data/concat.js'
import { getFunctionSelector } from '../hash/getFunctionSelector.js'
import { encodeAbiParameters } from './encodeAbiParameters.js'
import { formatAbiItem } from './formatAbiItem.js'
import { getAbiItem } from './getAbiItem.js'
export function encodeFunctionData({ abi, args, functionName }) {
	let abiItem = abi[0]
	if (functionName) {
		abiItem = getAbiItem({
			abi,
			args,
			name: functionName,
		})
		if (!abiItem)
			throw new AbiFunctionNotFoundError(functionName, {
				docsPath: '/docs/contract/encodeFunctionData',
			})
	}
	if (abiItem.type !== 'function')
		throw new AbiFunctionNotFoundError(undefined, {
			docsPath: '/docs/contract/encodeFunctionData',
		})
	const definition = formatAbiItem(abiItem)
	const signature = getFunctionSelector(definition)
	const data =
		'inputs' in abiItem && abiItem.inputs
			? encodeAbiParameters(abiItem.inputs, args ?? [])
			: undefined
	return concatHex([signature, data ?? '0x'])
}
//# sourceMappingURL=encodeFunctionData.js.map
