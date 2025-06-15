import { AbiItem } from 'ox'
import type { ContractEventName, Hex } from 'viem'
import { decodeEventLog, encodeEventTopics, getAddress, isHex } from 'viem'
import type { Abi, AbiEvent } from 'viem'
import type { MatcherResult } from '../../chainable/types.js'
import type { ContainsContractAbi, ContainsTransactionLogs } from '../../common/types.js'
import type { ToEmitState } from './types.js'

// Vitest-style matcher function
export const toEmit = async <
	TAbi extends Abi | undefined = Abi | undefined,
	TEventName extends TAbi extends Abi ? ContractEventName<TAbi> : never = TAbi extends Abi
		? ContractEventName<TAbi>
		: never,
	TContract extends TAbi extends Abi ? ContainsContractAbi<TAbi> : never = TAbi extends Abi
		? ContainsContractAbi<TAbi>
		: never,
>(
	received: ContainsTransactionLogs | Promise<ContainsTransactionLogs>,
	contractOrEventIdentifier: TContract | Hex | string,
	eventName?: TEventName,
): Promise<MatcherResult<ToEmitState>> => {
	const logs = (await received).logs

	// Handle event signature or selector
	if (typeof contractOrEventIdentifier === 'string') {
		const eventSelector = isHex(contractOrEventIdentifier)
			? contractOrEventIdentifier
			: AbiItem.getSelector(contractOrEventIdentifier)

		const matchedLogs = logs.filter((log) => log.topics[0]?.startsWith(eventSelector))
		const pass = matchedLogs.length > 0

		return {
			pass,
			actual: logs.map((log) => log.topics[0]).filter(Boolean),
			expected: `logs containing event selector ${eventSelector}`,
			message: () =>
				pass
					? `Expected event ${contractOrEventIdentifier} not to be emitted`
					: `Expected event ${contractOrEventIdentifier} to be emitted`,
			state: {
				matchedLogs,
				eventIdentifier: contractOrEventIdentifier,
			},
		}
	}

	// Contract + event name case
	if (!eventName) throw new Error('You need to provide an event name as a second argument')
	const contract = contractOrEventIdentifier
	const eventAbi = contract.abi.find((item): item is AbiEvent => item.type === 'event' && item.name === eventName)

	if (!eventAbi)
		throw new Error(
			`Event ${eventName} not found in contract ABI. Please make sure you've compiled the latest version before running the test.`,
		)

	const eventTopic = encodeEventTopics({
		abi: contract.abi,
		eventName: eventName,
	})[0]

	const matchedLogs = logs.filter((log) => {
		const topicMatches = log.topics[0] === eventTopic
		const addressMatches = contract?.address ? getAddress(log.address) === getAddress(contract.address) : true
		return topicMatches && addressMatches
	})

	const pass = matchedLogs.length > 0

	// Create meaningful actual/expected values for the diff
	const actualEvents = logs
		.filter((log) => (contract?.address ? getAddress(log.address) === getAddress(contract.address) : true))
		.map((log) => {
			try {
				const decoded = decodeEventLog({
					abi: contract.abi,
					data: log.data,
					topics: log.topics,
				})
				return `${decoded.eventName}(${decoded.args ? Object.values(decoded.args).join(', ') : ''})`
			} catch {
				return `UnknownEvent(${log.topics[0]})`
			}
		})

	return {
		pass,
		actual: actualEvents,
		expected: `event "${eventName}" to be emitted`,
		message: () =>
			pass ? `Expected event ${eventName} not to be emitted` : `Expected event ${eventName} to be emitted`,
		state: {
			matchedLogs,
			contract,
			eventName,
			eventAbi,
		},
	}
}
