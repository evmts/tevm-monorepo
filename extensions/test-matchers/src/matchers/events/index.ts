import type { AbiEventParameter, AbiParametersToPrimitiveTypes, ExtractAbiEvent } from 'abitype'
import type { ContractEventName, Hex } from 'viem'
import type { Abi } from 'viem'
import { createChainableFromVitest } from '../../chainable/chainable.js'
import type { ChainableAssertion } from '../../chainable/types.js'
import { toEmit } from './toEmit.js'
import type { ContractLike, TransactionLike } from './types.js'
import { withEventArgs } from './withEventArgs.js'
import { type EventInputsToNamedArgs, withEventNamedArgs } from './withEventNamedArgs.js'

// Create chainable matchers
export const toEmitChainable = createChainableFromVitest({
	name: 'toEmit' as const,
	vitestMatcher: toEmit,
})

export const withEventArgsChainable = createChainableFromVitest({
	name: 'withEventArgs' as const,
	vitestMatcher: withEventArgs,
})

export const withEventNamedArgsChainable = createChainableFromVitest({
	name: 'withEventNamedArgs' as const,
	vitestMatcher: withEventNamedArgs,
})

// Register the chainable matchers
export const eventMatchers = {
	toEmit: toEmitChainable,
	withEventArgs: withEventArgsChainable,
	withEventNamedArgs: withEventNamedArgsChainable,
}

export { toEmit, withEventArgs, withEventNamedArgs }
export type { ContractLike, TransactionLike }

// TypeScript declaration for vitest
export interface EmitMatchers {
	/**
	 * Assert that an event was emitted
	 */
	toEmit<TAbi extends Abi, TEventName extends ContractEventName<TAbi>>(
		contract: ContractLike<TAbi>,
		eventName: TEventName,
	): Promise<EmitAssertionWithContract<TAbi, TEventName>> & EmitAssertionWithContract<TAbi, TEventName>

	toEmit(eventSignature: string): ChainableAssertion
	toEmit(eventSelector: Hex): ChainableAssertion
}

// Only-after toEmit assertion type
interface EmitAssertionWithContract<TAbi extends Abi, TEventName extends ContractEventName<TAbi>> {
	/**
	 * Chain with toEmit to assert event arguments (typed for specific contract)
	 */
	withEventArgs<
		TInputs extends readonly AbiEventParameter[] = ExtractAbiEvent<TAbi, TEventName> extends {
			inputs: infer U extends readonly AbiEventParameter[]
		}
			? U
			: readonly AbiEventParameter[],
	>(...expectedArgs: AbiParametersToPrimitiveTypes<TInputs>): ChainableAssertion

	/**
	 * Chain with toEmit to assert named event arguments (typed for specific contract)
	 */
	withEventNamedArgs<
		TInputs extends readonly AbiEventParameter[] = ExtractAbiEvent<TAbi, TEventName> extends {
			inputs: infer U extends readonly AbiEventParameter[]
		}
			? U
			: readonly AbiEventParameter[],
	>(expectedArgs: Partial<EventInputsToNamedArgs<TInputs>>): ChainableAssertion
}
