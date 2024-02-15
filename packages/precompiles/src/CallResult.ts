import type { TypedError } from './TypedError.js'
import type {
	Abi,
	AbiParametersToPrimitiveTypes,
	Address,
	ExtractAbiEvents,
	ExtractAbiFunction,
} from '@tevm/utils'

/**
 * A result of a precompile javascript call
 */
export type CallResult<TAbi extends Abi, TFunctionName extends string> = {
	/**
	 * The amount of gas used during execution.
	 */
	executionGasUsed: bigint
	/**
	 * The return value of the call. Required even on exceptions
	 */
	returnValue: AbiParametersToPrimitiveTypes<
		ExtractAbiFunction<TAbi, TFunctionName>['outputs']
	>[0]
	/**
	 * Any Error thrown during execution
	 */
	error?: TypedError<string>
	/**
	 * Logs emitted during contract execution.
	 * Logs must match the interface of the ABI
	 */
	logs?: ReadonlyArray<ExtractAbiEvents<TAbi> & { address: Address }>
	/**
	 * A set of accounts to selfdestruct
	 */
	selfdestruct?: Set<Address>
	/**
	 * Amount of blob gas consumed by the transaction
	 */
	blobGasUsed?: bigint
}
