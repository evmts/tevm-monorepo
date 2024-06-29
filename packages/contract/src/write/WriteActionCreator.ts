import type {
	AbiParametersToPrimitiveTypes,
	Address,
	ExtractAbiFunction,
	ExtractAbiFunctionNames,
	FormatAbi,
	Hex,
	ParseAbi,
} from '@tevm/utils'
export type ValueOf<T> = T[keyof T]

// Adapted from viem

/**
 * A mapping of payable and nonpayable contract methods to action creators
 * @example
 * ```typescript
 * tevm.contract(
 *   MyContract.withAddress('0x420...').read.balanceOf('0x1234...'),
 * )
 * ```
 */
export type WriteActionCreator<
	THumanReadableAbi extends readonly string[],
	TAddress extends Address | undefined,
	TCode extends Hex | undefined,
	// we have address and to so we support both tevm and viem with natively
	TAddressArgs = TAddress extends undefined ? {} : { address: TAddress; to: TAddress },
> = {
	// for each payable and nonpayable function in the abi, create an action creator
	[TFunctionName in ExtractAbiFunctionNames<ParseAbi<THumanReadableAbi>, 'payable' | 'nonpayable'>]: (<
		// extract the names of the functions
		// use generic args to maintain typesafety. This is adapted from viem
		TArgs extends AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>['inputs']
		> &
			any[] = AbiParametersToPrimitiveTypes<ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>['inputs']> &
			any[],
	>(
		// take the same args as the function
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
