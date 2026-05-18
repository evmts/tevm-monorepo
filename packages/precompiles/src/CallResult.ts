import type {
	Abi,
	AbiParametersToPrimitiveTypes,
	Address,
	EncodeEventTopicsParameters,
	ExtractAbiEventNames,
	ExtractAbiFunction,
} from '@tevm/utils'
import type { TypedError } from './TypedError.js'

/**
 * Infers the event type from an abi
 */
export type ContractEventName<TAbi extends Abi | readonly unknown[] = Abi> = ExtractAbiEventNames<
	TAbi extends Abi ? TAbi : Abi
> extends infer TEventName extends string
	? [TEventName] extends [never]
		? string
		: TEventName
	: string

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
	returnValue: AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>['outputs']>[0]
	/**
	 * Any Error thrown during execution
	 */
	error?: TypedError<string>
	/**
	 * Logs emitted during contract execution.
	 * Logs must match the interface of the ABI
	 */
	logs?: ReadonlyArray<{
		args: EncodeEventTopicsParameters<TAbi, ContractEventName<TAbi>>['args']
		eventName: EncodeEventTopicsParameters<TAbi, ContractEventName<TAbi>>['eventName']
		address: Address
	}>
	/**
	 * A set of accounts to selfdestruct
	 */
	selfdestruct?: Set<Address>
	/**
	 * Amount of blob gas consumed by the transaction
	 */
	blobGasUsed?: bigint
}
