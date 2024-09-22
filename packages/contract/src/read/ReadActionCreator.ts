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
 * A mapping of view and pure contract methods to action creators.
 * This type provides a way to create type-safe read actions for contract methods.
 *
 * @template THumanReadableAbi - The human-readable ABI of the contract.
 * @template TAddress - The address of the contract (optional).
 * @template TCode - The runtime bytecode of the contract (optional).
 * @template TAddressArgs - Additional arguments for the address (derived from TAddress).
 *
 * @example
 * ```typescript
 * // Assuming we have a contract with a 'balanceOf' method
 * const balanceAction = MyContract.read.balanceOf('0x1234...')
 *
 * // Use the action with tevm
 * const balance = await tevm.contract(balanceAction)
 * console.log('Balance:', balance)
 * ```
 */
export type ReadActionCreator<
	THumanReadableAbi extends readonly string[],
	TAddress extends Address | undefined,
	TCode extends Hex | undefined,
	// We have address and to so we support both tevm and viem natively
	TAddressArgs = TAddress extends undefined ? {} : { address: TAddress; to: TAddress },
> = {
	// For every view and pure function in the abi, create an action creator
	[TFunctionName in ExtractAbiFunctionNames<ParseAbi<THumanReadableAbi>, 'pure' | 'view'>]: (<
		// Extract the read functions from abi
		// Keep args etc. generic for typesafety reasons. This is adapted from viem
		TArgs extends AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>['inputs']
		> &
			any[] = AbiParametersToPrimitiveTypes<ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>['inputs']> &
			any[],
	>(
		// Take the same args of the function
		...args: TArgs
		// Return an action creator that matches the viem api
	) => {
		functionName: TFunctionName
		humanReadableAbi: FormatAbi<[ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>]>
		abi: [ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>]
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
