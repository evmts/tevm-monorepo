import {
	type AbiEvent,
	encodeEventTopics,
	hexToBytes,
	type Abi,
	type Address,
	type EncodeEventTopicsParameters,
	encodeAbiParameters,
	type EthjsLog,
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
	const topics = encodeEventTopics({
		abi,
		eventName: log.eventName,
		args: log.args,
	} as any).map((topics) => hexToBytes(topics))
	const eventItem = abi.find((item) => item.type === 'event' && item.name === log.eventName) as AbiEvent
	const inputs = eventItem.inputs ?? []
	const argsArray = Array.isArray(log.args)
		? log.args
		: Object.values(log.args ?? {}).length > 0
			? inputs?.map((x: any) => (log.args as any)[x.name]) ?? []
			: []
	const data = encodeAbiParameters(eventItem.inputs, argsArray)
	return [hexToBytes(log.address), topics, hexToBytes(data)]
}
