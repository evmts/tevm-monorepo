import type { AbiParametersToPrimitiveTypes, ExtractAbiError } from 'abitype'
import type { Abi, AbiParameter, Client, ContractErrorName, Hex } from 'viem'
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
	 * Assert that a transaction was reverted
	 */
	toBeReverted(client?: Client): Promise<void>

	/**
	 * Assert that a transaction was reverted with a specific revert string
	 */
	toBeRevertedWithString(client: Client, revertString: string): Promise<void>

	/**
	 * Assert that a transaction was reverted with a specific error
	 */
	toBeRevertedWithError<TAbi extends Abi, TErrorName extends ContractErrorName<TAbi>>(
		client: Client,
		contract: ContainsContractAbi<TAbi>,
		errorName: TErrorName,
	): Promise<ErrorAssertionWithContract<TAbi, TErrorName>> & ErrorAssertionWithContract<TAbi, TErrorName>

	toBeRevertedWithError(client: Client, errorName: string): ChainableAssertion
	toBeRevertedWithError(client: Client, errorSelector: Hex): ChainableAssertion
}

// Only-after toEmit assertion type
interface ErrorAssertionWithContract<TAbi extends Abi, TErrorName extends ContractErrorName<TAbi>> {
	/**
	 * Chain with toEmit to assert event arguments (typed for specific contract)
	 */
	withErrorArgs<
		TInputs extends readonly AbiParameter[] = ExtractAbiError<TAbi, TErrorName> extends {
			inputs: infer U extends readonly AbiParameter[]
		}
			? U
			: readonly AbiParameter[],
	>(...expectedArgs: AbiParametersToPrimitiveTypes<TInputs>): ChainableAssertion

	/**
	 * Chain with toEmit to assert named event arguments (typed for specific contract)
	 */
	withErrorNamedArgs<
		TInputs extends readonly AbiParameter[] = ExtractAbiError<TAbi, TErrorName> extends {
			inputs: infer U extends readonly AbiParameter[]
		}
			? U
			: readonly AbiParameter[],
	>(expectedArgs: Partial<AbiInputsToNamedArgs<TInputs>>): ChainableAssertion
}
