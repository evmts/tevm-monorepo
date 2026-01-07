import type { Abi, AbiParameter, AbiParametersToPrimitiveTypes, Client, ContractErrorName, ExtractAbiError, Hex } from '@tevm/utils'
import { createChainableFromVitest } from '../../chainable/chainable.js'
import type { ChainableAssertion } from '../../chainable/types.js'
import type { AbiInputsToNamedArgs, ContainsContractAbi } from '../../common/types.js'
import { toBeReverted } from './toBeReverted.js'
import { toBeRevertedWithError } from './toBeRevertedWithError.js'
import { toBeRevertedWithString } from './toBeRevertedWithString.js'
import { withErrorArgs } from './withErrorArgs.js'
import { withErrorNamedArgs } from './withErrorNamedArgs.js'

// Create chainable matchers
export const toBeRevertedWithErrorChainable = createChainableFromVitest({
	name: 'toBeRevertedWithError' as const,
	vitestMatcher: toBeRevertedWithError,
})

export const withErrorArgsChainable = createChainableFromVitest({
	name: 'withErrorArgs' as const,
	vitestMatcher: withErrorArgs,
})

export const withErrorNamedArgsChainable = createChainableFromVitest({
	name: 'withErrorNamedArgs' as const,
	vitestMatcher: withErrorNamedArgs,
})

// Register the chainable matchers
export const chainableErrorMatchers = {
	toBeRevertedWithError: toBeRevertedWithErrorChainable,
	withErrorArgs: withErrorArgsChainable,
	withErrorNamedArgs: withErrorNamedArgsChainable,
}

export { toBeReverted, toBeRevertedWithString, toBeRevertedWithError, withErrorArgs, withErrorNamedArgs }

// TypeScript declaration for vitest
export interface ErrorMatchers {
	/**
	 * Asserts that a transaction reverted for any reason.
	 * This includes string reverts, custom errors, and panics.
	 *
	 * @param client - Optional client for transaction execution
	 *
	 * @example
	 * ```typescript
	 * // Test any revert
	 * await expect(writeContract(client, contract.write.failingFunction()))
	 *   .toBeReverted(client)
	 *
	 * // Works with .not for successful transactions
	 * await expect(writeContract(client, contract.write.successfulFunction()))
	 *   .not.toBeReverted(client)
	 * ```
	 *
	 * @see {@link toBeRevertedWithString} for specific revert messages
	 * @see {@link toBeRevertedWithError} for custom errors
	 */
	toBeReverted(client?: Client): Promise<void>

	/**
	 * Asserts that a transaction reverted with a specific revert string.
	 * Use this for `revert("message")` style reverts.
	 *
	 * @param client - Client for transaction execution
	 * @param revertString - Expected exact revert message
	 *
	 * @example
	 * ```typescript
	 * // Contract: require(amount > 0, "Amount must be positive")
	 * await expect(writeContract(client, contract.write.transfer(to, 0n)))
	 *   .toBeRevertedWithString(client, 'Amount must be positive')
	 *
	 * // Note: Message must match exactly
	 * await expect(transaction)
	 *   .not.toBeRevertedWithString(client, 'Different message')
	 * ```
	 *
	 * @see {@link toBeRevertedWithError} for custom errors
	 */
	toBeRevertedWithString(client: Client, revertString: string): Promise<void>

	/**
	 * Asserts that a transaction reverted with a specific custom error.
	 * Use this for custom error types, not `revert()` strings.
	 *
	 * @param client - Client for transaction execution
	 * @param contract - Contract object with ABI containing the error
	 * @param errorName - Name of the custom error in the ABI
	 *
	 * @example
	 * ```typescript
	 * // error InsufficientBalance(uint256 available, uint256 required);
	 * await expect(writeContract(client, contract.write.transfer(to, 1000n)))
	 *   .toBeRevertedWithError(client, contract, 'InsufficientBalance')
	 *
	 * // Chain with argument assertions
	 * await expect(writeContract(client, contract.write.transfer(to, 1000n)))
	 *   .toBeRevertedWithError(client, contract, 'InsufficientBalance')
	 *   .withErrorArgs(50n, 1000n)
	 *
	 * // Chain with argument assertions by name (partial matching)
	 * await expect(writeContract(client, contract.write.transfer(to, 1000n)))
	 *   .toBeRevertedWithError(client, contract, 'InsufficientBalance')
	 *   .withErrorNamedArgs({ required: 1000n })
	 * ```
	 *
	 * @see {@link withErrorArgs} to test error arguments
	 * @see {@link withErrorNamedArgs} to test error arguments by name
	 * @see {@link toBeRevertedWithString} for revert strings
	 */
	toBeRevertedWithError<TAbi extends Abi, TErrorName extends ContractErrorName<TAbi>>(
		client: Client,
		contract: ContainsContractAbi<TAbi>,
		errorName: TErrorName,
	): Promise<ErrorAssertionWithContract<TAbi, TErrorName>> & ErrorAssertionWithContract<TAbi, TErrorName>

	/**
	 * Asserts that a transaction reverted with an error matching the signature.
	 *
	 * @param client - Client for transaction execution
	 * @param errorName - Error signature string (e.g., "InsufficientBalance(uint256,uint256)")
	 *
	 * @example
	 * ```typescript
	 * await expect(transaction)
	 *   .toBeRevertedWithError(client, 'InsufficientBalance(uint256,uint256)')
	 *   .withErrorArgs(50n, 1000n)
	 * ```
	 */
	toBeRevertedWithError(client: Client, errorName: string): ChainableAssertion

	/**
	 * Asserts that a transaction reverted with an error matching the selector.
	 *
	 * @param client - Client for transaction execution
	 * @param errorSelector - Error selector (4-byte hex)
	 *
	 * @example
	 * ```typescript
	 * await expect(transaction)
	 *   .toBeRevertedWithError(client, '0x356680b7') // InsufficientBalance selector
	 * ```
	 */
	toBeRevertedWithError(client: Client, errorSelector: Hex): ChainableAssertion
}

// Only-after toBeRevertedWithError assertion type
interface ErrorAssertionWithContract<TAbi extends Abi, TErrorName extends ContractErrorName<TAbi>> {
	/**
	 * Chains with toBeRevertedWithError to assert error arguments in positional order.
	 * Arguments must match exactly in the order they appear in the error.
	 *
	 * **Limitation**: Cannot use .not before this method.
	 *
	 * @param expectedArgs - Expected arguments in order
	 *
	 * @example
	 * ```typescript
	 * // error InsufficientBalance(uint256 available, uint256 required);
	 * await expect(transaction)
	 *   .toBeRevertedWithError(client, contract, 'InsufficientBalance')
	 *   .withErrorArgs(
	 *     50n,   // available
	 *     1000n  // required
	 *   )
	 * ```
	 *
	 * @see {@link withErrorNamedArgs} for partial matching by name
	 */
	withErrorArgs<
		TInputs extends readonly AbiParameter[] = ExtractAbiError<TAbi, TErrorName> extends {
			inputs: infer U extends readonly AbiParameter[]
		}
			? U
			: readonly AbiParameter[],
	>(...expectedArgs: AbiParametersToPrimitiveTypes<TInputs>): ChainableAssertion

	/**
	 * Chains with toBeRevertedWithError to assert error arguments by name.
	 * Supports partial matching - only specified arguments are checked.
	 *
	 * **Limitation**: Cannot use .not before this method.
	 *
	 * @param expectedArgs - Object with expected named arguments (partial)
	 *
	 * @example
	 * ```typescript
	 * // Check only specific arguments
	 * await expect(transaction)
	 *   .toBeRevertedWithError(client, contract, 'InsufficientBalance')
	 *   .withErrorNamedArgs({ required: 1000n })
	 *
	 * // Check all arguments
	 * await expect(transaction)
	 *   .toBeRevertedWithError(client, contract, 'InsufficientBalance')
	 *   .withErrorNamedArgs({
	 *     available: 50n,
	 *     required: 1000n
	 *   })
	 * ```
	 *
	 * @see {@link withErrorArgs} for positional argument matching
	 */
	withErrorNamedArgs<
		TInputs extends readonly AbiParameter[] = ExtractAbiError<TAbi, TErrorName> extends {
			inputs: infer U extends readonly AbiParameter[]
		}
			? U
			: readonly AbiParameter[],
	>(expectedArgs: Partial<AbiInputsToNamedArgs<TInputs>>): ChainableAssertion
}
