import type {
	Abi,
	AbiEventParameter,
	AbiParametersToPrimitiveTypes,
	ContractEventName,
	ExtractAbiEvent,
	Hex,
} from '@tevm/utils'
import { createChainableFromVitest } from '../../chainable/chainable.js'
import type { ChainableAssertion } from '../../chainable/types.js'
import type { AbiInputsToNamedArgs, ContainsContractAbi } from '../../common/types.js'
import { toEmit } from './toEmit.js'
import { withEventArgs } from './withEventArgs.js'
import { withEventNamedArgs } from './withEventNamedArgs.js'

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

// Register the chainable matchers with the new structure
export const chainableEventMatchers = {
	toEmit: toEmitChainable,
	withEventArgs: withEventArgsChainable,
	withEventNamedArgs: withEventNamedArgsChainable,
}

export { toEmit, withEventArgs, withEventNamedArgs }

// TypeScript declaration for vitest
export interface EmitMatchers {
	/**
	 * Asserts that a transaction emitted a specific event.
	 * Can be used with contract objects, event signatures, or selectors.
	 *
	 * @param contract - Contract object with ABI and address
	 * @param eventName - Name of the event in the ABI
	 *
	 * @example
	 * ```typescript
	 * // Using contract object
	 * await expect(txHash)
	 *   .toEmit(tokenContract, 'Transfer')
	 *
	 * // Chain with argument assertions
	 * await expect(txHash)
	 *   .toEmit(tokenContract, 'Transfer')
	 *   .withEventArgs(from, to, 100n)
	 *
	 * // Chain with argument assertions by name (partial matching)
	 * await expect(txHash)
	 *   .toEmit(tokenContract, 'Transfer')
	 *   .withEventNamedArgs({ to })
	 * ```
	 *
	 * @see {@link withEventArgs} to test event arguments positionally
	 * @see {@link withEventNamedArgs} to test event arguments by name
	 */
	toEmit<TAbi extends Abi, TEventName extends ContractEventName<TAbi>>(
		contract: ContainsContractAbi<TAbi>,
		eventName: TEventName,
	): Promise<EmitAssertionWithContract<TAbi, TEventName>> & EmitAssertionWithContract<TAbi, TEventName>

	/**
	 * Asserts that a transaction emitted an event matching the signature.
	 *
	 * @param eventSignature - Event signature string (e.g., "Transfer(address,address,uint256)")
	 *
	 * @example
	 * ```typescript
	 * await expect(txHash)
	 *   .toEmit('Transfer(address,address,uint256)')
	 *   .withEventArgs(from, to, amount)
	 * ```
	 */
	toEmit(eventSignature: string): ChainableAssertion

	/**
	 * Asserts that a transaction emitted an event matching the selector.
	 *
	 * @param eventSelector - Event selector (4-byte hex)
	 *
	 * @example
	 * ```typescript
	 * await expect(txHash)
	 *   .toEmit('0xddf252ad...') // Transfer event selector
	 * ```
	 */
	toEmit(eventSelector: Hex): ChainableAssertion
}

// Only-after toEmit assertion type
interface EmitAssertionWithContract<TAbi extends Abi, TEventName extends ContractEventName<TAbi>> {
	/**
	 * Chains with toEmit to assert event arguments in positional order.
	 * Arguments must match exactly in the order they appear in the event.
	 *
	 * **Limitation**: Cannot use .not before this method.
	 *
	 * @param expectedArgs - Expected arguments in order
	 *
	 * @example
	 * ```typescript
	 * // Transfer event: Transfer(address from, address to, uint256 value)
	 * await expect(txHash)
	 *   .toEmit(tokenContract, 'Transfer')
	 *   .withEventArgs(
	 *     '0x742d35Cc6274c36e1019e41D77d0A4aa7D7dE01e', // from
	 *     '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed', // to
	 *     1000n // value
	 *   )
	 * ```
	 *
	 * @see {@link withEventNamedArgs} for partial matching by name
	 */
	withEventArgs<
		TInputs extends readonly AbiEventParameter[] = ExtractAbiEvent<TAbi, TEventName> extends {
			inputs: infer U extends readonly AbiEventParameter[]
		}
			? U
			: readonly AbiEventParameter[],
	>(...expectedArgs: AbiParametersToPrimitiveTypes<TInputs>): ChainableAssertion

	/**
	 * Chains with toEmit to assert event arguments by name.
	 * Supports partial matching - only specified arguments are checked.
	 *
	 * **Limitation**: Cannot use .not before this method.
	 *
	 * @param expectedArgs - Object with expected named arguments (partial)
	 *
	 * @example
	 * ```typescript
	 * // Check only specific arguments
	 * await expect(txHash)
	 *   .toEmit(tokenContract, 'Transfer')
	 *   .withEventNamedArgs({
	 *     to: recipient,
	 *     value: 1000n
	 *   })
	 *
	 * // Empty object matches any event of this type
	 * await expect(txHash)
	 *   .toEmit(tokenContract, 'Transfer')
	 *   .withEventNamedArgs({})
	 * ```
	 *
	 * @see {@link withEventArgs} for positional argument matching
	 */
	withEventNamedArgs<
		TInputs extends readonly AbiEventParameter[] = ExtractAbiEvent<TAbi, TEventName> extends {
			inputs: infer U extends readonly AbiEventParameter[]
		}
			? U
			: readonly AbiEventParameter[],
	>(expectedArgs: Partial<AbiInputsToNamedArgs<TInputs>>): ChainableAssertion
}
