import type { ContractFunctionName, DecodeFunctionResultReturnType } from '@tevm/utils'
import type { CallResult } from '../Call/CallResult.js'
import type { Abi } from '../common/index.js'
import type { TevmContractError } from './TevmContractError.js'

/**
 * The result type for a TEVM contract call.
 *
 * This type extends the `CallResult` type with additional contract-specific fields, and it supports both success and error states.
 *
 * @template TAbi - The ABI type.
 * @template TFunctionName - The function name type from the ABI.
 * @template ErrorType - The error type.
 *
 * @example
 * ```typescript
 * import { createMemoryClient, tevmContract } from 'tevm'
 * import { optimism } from 'tevm/common'
 * import type { Abi } from 'tevm/actions'
 *
 * const client = createMemoryClient({ common: optimism })
 *
 * const params = {
 *   abi: [...], // ABI array
 *   functionName: 'myFunction',
 *   args: [arg1, arg2],
 *   to: '0x123...',
 *   from: '0x123...',
 *   gas: 1000000n,
 *   gasPrice: 1n,
 *   skipBalance: true,
 * } as const
 *
 * const result = await tevmContract(client, params)
 *
 * if (result.errors) {
 *   console.error('Contract call failed:', result.errors)
 * } else {
 *   console.log('Contract call succeeded:', result.data)
 * }
 * ```
 *
 * @see {@link CallResult}
 */
export type ContractResult<
	TAbi extends Abi | readonly unknown[] = Abi,
	TFunctionName extends ContractFunctionName<TAbi> = ContractFunctionName<TAbi>,
	ErrorType = TevmContractError,
> =
	| (Omit<CallResult, 'errors'> & {
			errors?: never
			/**
			 * The parsed data returned from the contract function call.
			 */
			data: DecodeFunctionResultReturnType<TAbi, TFunctionName>
	  })
	| (CallResult<ErrorType> & {
			data?: never
	  })
