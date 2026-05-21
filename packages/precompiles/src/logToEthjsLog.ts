import {
	type Abi,
	type AbiEvent,
	type Address,
	type EncodeEventTopicsParameters,
	type EthjsLog,
	encodeAbiParameters,
	encodeEventTopics,
	hexToBytes,
} from '@tevm/utils'
import type { ContractEventName } from './CallResult.js'

/**
 * Converts log arguments with abi to ethjs log format
 * @internal
 */
export const logToEthjsLog = <TAbi extends Abi>(
	abi: TAbi,
	log: {
		args: EncodeEventTopicsParameters<TAbi, ContractEventName<TAbi>>['args']
		eventName: EncodeEventTopicsParameters<TAbi, ContractEventName<TAbi>>['eventName']
		address: Address
	},
): EthjsLog => {
	const topicHexes = encodeEventTopics({
		abi,
		eventName: log.eventName,
		args: log.args,
	} as any)
	const topics = topicHexes.map((topics) => hexToBytes(topics as `0x${string}`))
	const eventItems = abi.filter((item) => item.type === 'event' && item.name === log.eventName) as AbiEvent[]
	const eventItem = (
		eventItems.length === 1
			? eventItems[0]
			: eventItems.find((item) => {
					try {
						const itemTopics = encodeEventTopics({
							abi: [item],
							eventName: log.eventName,
							args: log.args,
						} as any)
						return itemTopics[0] === topicHexes[0]
					} catch (_e) {
						return false
					}
				}) || (eventItems[0] as AbiEvent)
	) as AbiEvent
	const inputs = eventItem.inputs ?? []
	const argsArray = Array.isArray(log.args)
		? log.args
		: Object.values(log.args ?? {}).length > 0
			? (inputs?.map((x: any) => (log.args as any)[x.name]) ?? [])
			: []

	const nonIndexedArgs = argsArray.filter((_, index) => !eventItem.inputs[index]?.indexed)

	const data = encodeAbiParameters(
		inputs.filter((input) => !input.indexed),
		nonIndexedArgs,
	)
	return [hexToBytes(log.address), topics, hexToBytes(data)]
}
