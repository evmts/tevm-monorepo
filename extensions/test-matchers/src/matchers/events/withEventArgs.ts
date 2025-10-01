import type { AbiEventParameter, AbiParametersToPrimitiveTypes, ExtractAbiEvent } from 'abitype'
import { type Abi, type ContractEventName, decodeEventLog } from 'viem'
import { parseChainArgs } from '../../chainable/chainable.js'
import type { ChainState, MatcherResult } from '../../chainable/types.js'
import type { ToEmitState } from './types.js'

export const withEventArgs = <
	TAbi extends Abi | undefined = Abi | undefined,
	TEventName extends TAbi extends Abi ? ContractEventName<TAbi> : never = TAbi extends Abi
		? ContractEventName<TAbi>
		: never,
	TInputs extends readonly AbiEventParameter[] = TAbi extends Abi
		? ExtractAbiEvent<TAbi, TEventName> extends { inputs: infer U extends readonly AbiEventParameter[] }
			? U
			: readonly AbiEventParameter[]
		: never,
>(
	_received: unknown,
	...argsAndChainState: readonly [...AbiParametersToPrimitiveTypes<TInputs>, ChainState<unknown, ToEmitState>]
): MatcherResult => {
	const {
		args,
		chainState: { previousState },
	} = parseChainArgs<unknown, ToEmitState>(argsAndChainState)

	if (!previousState || !('contract' in previousState))
		throw new Error('withEventArgs() requires a contract with abi and event name')

	const { matchedLogs, contract, eventName } = previousState

	// Try to decode and match arguments for each matched log
	let argsMatched = false
	const actualArgsFromLogs: unknown[][] = []

	// At this point since we provided an abi & event name we know for sure that the matched logs correspond to the event we're looking for
	for (const log of matchedLogs) {
		const decodedLog = decodeEventLog({
			abi: contract.abi,
			data: log.data,
			topics: log.topics,
			eventName: eventName,
		})

		const decodedArgs = Object.values(decodedLog.args as unknown as Record<string, unknown>)
		if (!decodedArgs.length) continue
		actualArgsFromLogs.push(decodedArgs)

		if (decodedArgs.length === args.length) {
			const allArgsMatch = decodedArgs.every((actual, i) => actual === args[i])
			if (allArgsMatch) {
				argsMatched = true
				break
			}
		}
	}

	return {
		pass: argsMatched,
		actual: actualArgsFromLogs.flat(),
		expected: args,
		message: () => {
			if (argsMatched) return `Expected event ${eventName} not to be emitted with the specified arguments`
			return `Expected event ${eventName} to be emitted with the specified arguments, but it wasn't found in any of the ${matchedLogs?.length ?? 0} emitted events`
		},
	}
}
