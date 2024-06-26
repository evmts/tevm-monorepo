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
 * A mapping of view and pure contract methods to action creators
 * @example
 * ```typescript
 * tevm.contract(
 *   MyScript.withAddress('0x420...').read.balanceOf('0x1234...'),
 *)
 * ```
 */
export type ReadActionCreator<
	THumanReadableAbi extends readonly string[],
	TAddress extends Address | undefined,
	TCode extends Hex | undefined,
	// we have address and to so we support both tevm and viem with natively
	TAddressArgs = TAddress extends undefined ? {} : { address: TAddress; to: TAddress },
> = {
	// For every view and pure function in the abi, create an action creator
	[TFunctionName in ExtractAbiFunctionNames<ParseAbi<THumanReadableAbi>, 'pure' | 'view'>]: (<
		// extract the read functions from abi
		// keep args etc. generic for typesafety reasons. This is adapted from viem
		TArgs extends AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>['inputs']
		> &
			any[] = AbiParametersToPrimitiveTypes<ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>['inputs']> &
			any[],
	>(
		// take the same args of the function
		...args: TArgs
		// return an action creator that matches the viem api
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
