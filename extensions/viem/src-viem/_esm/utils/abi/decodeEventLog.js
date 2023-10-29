import {
	AbiDecodingDataSizeTooSmallError,
	AbiEventSignatureEmptyTopicsError,
	AbiEventSignatureNotFoundError,
	DecodeLogDataMismatch,
	DecodeLogTopicsMismatch,
} from '../../errors/abi.js'
import { getEventSelector } from '../hash/getEventSelector.js'
import { decodeAbiParameters } from './decodeAbiParameters.js'
import { formatAbiItem } from './formatAbiItem.js'
const docsPath = '/docs/contract/decodeEventLog'
export function decodeEventLog({ abi, data, strict: strict_, topics }) {
	const strict = strict_ ?? true
	const [signature, ...argTopics] = topics
	if (!signature)
		throw new AbiEventSignatureEmptyTopicsError({
			docsPath,
		})
	const abiItem = abi.find(
		(x) =>
			x.type === 'event' && signature === getEventSelector(formatAbiItem(x)),
	)
	if (!(abiItem && 'name' in abiItem) || abiItem.type !== 'event')
		throw new AbiEventSignatureNotFoundError(signature, {
			docsPath,
		})
	const { name, inputs } = abiItem
	const isUnnamed = inputs?.some((x) => !('name' in x && x.name))
	let args = isUnnamed ? [] : {}
	// Decode topics (indexed args).
	const indexedInputs = inputs.filter((x) => 'indexed' in x && x.indexed)
	if (argTopics.length > 0) {
		for (let i = 0; i < indexedInputs.length; i++) {
			const param = indexedInputs[i]
			const topic = argTopics[i]
			if (!topic)
				throw new DecodeLogTopicsMismatch({
					abiItem,
					param: param,
				})
			args[param.name || i] = decodeTopic({ param, value: topic })
		}
	}
	// Decode data (non-indexed args).
	const nonIndexedInputs = inputs.filter((x) => !('indexed' in x && x.indexed))
	if (nonIndexedInputs.length > 0) {
		if (data && data !== '0x') {
			try {
				const decodedData = decodeAbiParameters(nonIndexedInputs, data)
				if (decodedData) {
					if (isUnnamed) args = [...args, ...decodedData]
					else {
						for (let i = 0; i < nonIndexedInputs.length; i++) {
							args[nonIndexedInputs[i].name] = decodedData[i]
						}
					}
				}
			} catch (err) {
				if (strict) {
					if (err instanceof AbiDecodingDataSizeTooSmallError)
						throw new DecodeLogDataMismatch({
							abiItem,
							data: err.data,
							params: err.params,
							size: err.size,
						})
					throw err
				}
			}
		} else if (strict) {
			throw new DecodeLogDataMismatch({
				abiItem,
				data: '0x',
				params: nonIndexedInputs,
				size: 0,
			})
		}
	}
	return {
		eventName: name,
		args: Object.values(args).length > 0 ? args : undefined,
	}
}
function decodeTopic({ param, value }) {
	if (
		param.type === 'string' ||
		param.type === 'bytes' ||
		param.type === 'tuple' ||
		param.type.match(/^(.*)\[(\d+)?\]$/)
	)
		return value
	const decodedArg = decodeAbiParameters([param], value) || []
	return decodedArg[0]
}
//# sourceMappingURL=decodeEventLog.js.map
