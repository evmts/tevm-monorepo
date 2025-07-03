import type { TevmNode } from '@tevm/node'
import type { AbiParameter, AbiParametersToPrimitiveTypes, ExtractAbiFunction } from 'abitype'
import type { Abi, Client, ContractFunctionName, Hex } from 'viem'
import { createChainableFromVitest } from '../../chainable/chainable.js'
import type { ChainableAssertion } from '../../chainable/types.js'
import type { AbiInputsToNamedArgs, ContainsContractAbi } from '../../common/types.js'
import { toCallContractFunction } from './toCallContractFunction.js'
import { withFunctionArgs } from './withFunctionArgs.js'
import { withFunctionNamedArgs } from './withFunctionNamedArgs.js'

// Create chainable matchers
export const toCallContractFunctionChainable = createChainableFromVitest({
	name: 'toCallContractFunction' as const,
	vitestMatcher: toCallContractFunction,
})

export const withFunctionArgsChainable = createChainableFromVitest({
	name: 'withFunctionArgs' as const,
	vitestMatcher: withFunctionArgs,
})

export const withFunctionNamedArgsChainable = createChainableFromVitest({
	name: 'withFunctionNamedArgs' as const,
	vitestMatcher: withFunctionNamedArgs,
})

// Register the chainable matchers
export const chainableContractMatchers = {
	toCallContractFunction: toCallContractFunctionChainable,
	withFunctionArgs: withFunctionArgsChainable,
	withFunctionNamedArgs: withFunctionNamedArgsChainable,
}

export { toCallContractFunction, withFunctionArgs, withFunctionNamedArgs }

// TypeScript declaration for vitest
export interface ContractMatchers {
	/**
	 * Asserts that a transaction called a specific contract function.
	 * Can be used with contract objects, function signatures, or selectors.
	 *
	 * @param client - Client for transaction execution
	 * @param contract - Contract object with ABI and address
	 * @param functionName - Name of the function in the ABI
	 *
	 * @example
	 * ```typescript
	 * // Using contract object
	 * await expect(txHash)
	 *   .toCallContractFunction(client, tokenContract, 'transfer')
	 *
	 * // Chain with argument assertions
	 * await expect(txHash)
	 *   .toCallContractFunction(client, tokenContract, 'transfer')
	 *   .withFunctionArgs(to, 100n)
	 *
	 * // Chain with argument assertions by name (partial matching)
	 * await expect(txHash)
	 *   .toCallContractFunction(client, tokenContract, 'transfer')
	 *   .withFunctionNamedArgs({ to, value: 100n })
	 * ```
	 *
	 * @see {@link withFunctionArgs} to test function arguments positionally
	 * @see {@link withFunctionNamedArgs} to test function arguments by name
	 */
	toCallContractFunction<TAbi extends Abi, TFunctionName extends ContractFunctionName<TAbi>>(
		client: Client | TevmNode,
		contract: ContainsContractAbi<TAbi>,
		functionName: TFunctionName,
	): Promise<ContractAssertionWithContract<TAbi, TFunctionName>> & ContractAssertionWithContract<TAbi, TFunctionName>

	/**
	 * Asserts that a transaction called a function matching the signature.
	 *
	 * @param client - Client for transaction execution
	 * @param functionSignature - Function signature string (e.g., "transfer(address,uint256)")
	 *
	 * @example
	 * ```typescript
	 * await expect(txHash).toCallContractFunction(client, 'transfer(address,uint256)')
	 * ```
	 */
	toCallContractFunction(client: Client | TevmNode, functionSignature: string): ChainableAssertion

	/**
	 * Asserts that a transaction called a function matching the selector.
	 *
	 * @param client - Client for transaction execution
	 * @param functionSelector - Function selector (4-byte hex)
	 *
	 * @example
	 * ```typescript
	 * await expect(txHash).toCallContractFunction(client, '0xa9059cbb') // transfer function selector
	 * ```
	 */
	toCallContractFunction(client: Client | TevmNode, functionSelector: Hex): ChainableAssertion
}

// Only-after toCallContractFunction assertion type
interface ContractAssertionWithContract<TAbi extends Abi, TFunctionName extends ContractFunctionName<TAbi>> {
	/**
	 * Chains with toCallContractFunction to assert function arguments in positional order.
	 * Arguments must match exactly in the order they appear in the function.
	 *
	 * **Limitation**: Cannot use .not before this method.
	 *
	 * @param expectedArgs - Expected arguments in order
	 *
	 * @example
	 * ```typescript
	 * // transfer function: transfer(address to, uint256 value)
	 * await expect(txHash)
	 *   .toCallContractFunction(client, tokenContract, 'transfer')
	 *   .withFunctionArgs(
	 *     '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed', // to
	 *     1000n // value
	 *   )
	 * ```
	 *
	 * @see {@link withFunctionNamedArgs} for partial matching by name
	 */
	withFunctionArgs<
		TInputs extends readonly AbiParameter[] = ExtractAbiFunction<TAbi, TFunctionName> extends {
			inputs: infer U extends readonly AbiParameter[]
		}
			? U
			: readonly AbiParameter[],
	>(...expectedArgs: AbiParametersToPrimitiveTypes<TInputs>): ChainableAssertion

	/**
	 * Chains with toCallContractFunction to assert function arguments by name.
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
	 *   .toCallContractFunction(client, tokenContract, 'transfer')
	 *   .withFunctionNamedArgs({
	 *     to: recipient,
	 *     value: 1000n
	 *   })
	 *
	 * // Empty object matches any call to this function
	 * await expect(txHash)
	 *   .toCallContractFunction(client, tokenContract, 'transfer')
	 *   .withFunctionNamedArgs({})
	 * ```
	 *
	 * @see {@link withFunctionArgs} for positional argument matching
	 */
	withFunctionNamedArgs<
		TInputs extends readonly AbiParameter[] = ExtractAbiFunction<TAbi, TFunctionName> extends {
			inputs: infer U extends readonly AbiParameter[]
		}
			? U
			: readonly AbiParameter[],
	>(expectedArgs: Partial<AbiInputsToNamedArgs<TInputs>>): ChainableAssertion
}
