import { AbiEventNotFoundError } from '../../errors/abi.js'
import { FilterTypeNotSupportedError } from '../../errors/log.js'
import { toBytes } from '../encoding/toBytes.js'
import { getEventSelector } from '../hash/getEventSelector.js'
import { keccak256 } from '../hash/keccak256.js'
import { encodeAbiParameters } from './encodeAbiParameters.js'
import { formatAbiItem } from './formatAbiItem.js'
import { getAbiItem } from './getAbiItem.js'
export function encodeEventTopics({ abi, eventName, args }) {
	let abiItem = abi[0]
	if (eventName) {
		abiItem = getAbiItem({
			abi,
			args,
			name: eventName,
		})
		if (!abiItem)
			throw new AbiEventNotFoundError(eventName, {
				docsPath: '/docs/contract/encodeEventTopics',
			})
	}
	if (abiItem.type !== 'event')
		throw new AbiEventNotFoundError(undefined, {
			docsPath: '/docs/contract/encodeEventTopics',
		})
	const definition = formatAbiItem(abiItem)
	const signature = getEventSelector(definition)
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
function encodeArg({ param, value }) {
	if (param.type === 'string' || param.type === 'bytes')
		return keccak256(toBytes(value))
	if (param.type === 'tuple' || param.type.match(/^(.*)\[(\d+)?\]$/))
		throw new FilterTypeNotSupportedError(param.type)
	return encodeAbiParameters([param], [value])
}
//# sourceMappingURL=encodeEventTopics.js.map
