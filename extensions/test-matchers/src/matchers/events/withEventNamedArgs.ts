import type { AbiEventParameter, ExtractAbiEvent } from 'abitype'
import { type Abi, type ContractEventName, decodeEventLog } from 'viem'
import { assert } from 'vitest'
import type { ChainState, MatcherResult } from '../../chainable/types.js'
import type { AbiInputsToNamedArgs } from '../../common/types.js'
import type { ToEmitState } from './types.js'

export const withEventNamedArgs = <
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
	expectedArgs: Partial<AbiInputsToNamedArgs<TInputs>>,
	chainState?: ChainState<unknown, ToEmitState<TAbi, TEventName>>,
): MatcherResult => {
	assert(chainState, 'Internal error: no chain state found')
	const { previousState } = chainState

	if (!previousState || !('contract' in previousState))
		throw new Error('withEventNamedArgs() requires a contract with abi and event name')

	const { matchedLogs, contract, eventName } = previousState

	let argsMatched = false
	const actualNamedArgsFromLogs: Record<string, unknown>[] = []

	for (const log of matchedLogs) {
		const decodedLog = decodeEventLog({
			abi: contract.abi,
			data: log.data,
			topics: log.topics,
			eventName: eventName,
		})

		const decodedArgs = decodedLog.args as unknown as Record<string, unknown>
		actualNamedArgsFromLogs.push(decodedArgs)

		// Check if all expected args match
		const allArgsMatch = Object.entries(expectedArgs).every(
			([argName, expectedValue]) => decodedArgs[argName] === expectedValue,
		)
		if (allArgsMatch) {
			argsMatched = true
			break
		}
	}

	return {
		pass: argsMatched,
		actual: actualNamedArgsFromLogs,
		expected: expectedArgs,
		message: () => {
			if (argsMatched) return `Expected event ${eventName} not to be emitted with the specified named arguments`
			return `Expected event ${eventName} to be emitted with the specified named arguments, but it wasn't found in any of the ${matchedLogs?.length ?? 0} emitted events`
		},
	}
}
