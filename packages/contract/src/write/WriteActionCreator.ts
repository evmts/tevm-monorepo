import type {
	AbiParametersToPrimitiveTypes,
	Address,
	ExtractAbiFunction,
	ExtractAbiFunctionNames,
	FormatAbi,
	Hex,
	ParseAbi,
} from '@tevm/utils'

/**
 * Utility type to get the value type of an object.
 * @template T - The object type.
 */
export type ValueOf<T> = T[keyof T]

/**
 * A mapping of payable and nonpayable contract methods to action creators.
 * This type provides a way to create type-safe write actions for contract methods.
 *
 * @template THumanReadableAbi - The human-readable ABI of the contract.
 * @template TAddress - The address of the contract (optional).
 * @template TCode - The runtime bytecode of the contract (optional).
 * @template TAddressArgs - Additional arguments for the address (derived from TAddress).
 *
 * @example
 * ```typescript
 * // Assuming we have a contract with a 'transfer' method
 * const transferAction = MyContract.write.transfer('0x1234...', 1000n)
 *
 * // Use the action with tevm
 * const result = await tevm.contract(transferAction)
 * console.log('Transaction hash:', result.transactionHash)
 * ```
 */
export type WriteActionCreator<
	THumanReadableAbi extends readonly string[],
	TAddress extends Address | undefined,
	TCode extends Hex | undefined,
	// We have address and to so we support both tevm and viem with natively
	TAddressArgs = TAddress extends undefined ? {} : { address: TAddress; to: TAddress },
> = {
	// For each payable and nonpayable function in the abi, create an action creator
	[TFunctionName in ExtractAbiFunctionNames<ParseAbi<THumanReadableAbi>, 'payable' | 'nonpayable'>]: (<
		// Extract the names of the functions
		// Use generic args to maintain typesafety. This is adapted from viem
		TArgs extends AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>['inputs']
		> &
			any[] = AbiParametersToPrimitiveTypes<ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>['inputs']> &
			any[],
	>(
		// Take the same args as the function
		...args: TArgs
	) => {
		functionName: TFunctionName
		humanReadableAbi: FormatAbi<[ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>]>
		abi: [ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>]
		address: TAddress
		to: TAddress
	} & (TCode extends undefined ? {} : { code: TCode }) &
		(TArgs['length'] extends 0
			? {}
			: {
					args: TArgs
				}) &
		TAddressArgs) & {
		functionName: TFunctionName
		humanReadableAbi: FormatAbi<[ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>]>
		abi: [ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>]
	} & (TCode extends undefined ? {} : { code: TCode }) &
		TAddressArgs
}
