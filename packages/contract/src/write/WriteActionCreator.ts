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
	TBytecode extends Hex | undefined,
	TDeployedBytecode extends Hex | undefined,
	TAddress extends Address | undefined,
	// we have address and to so we support both tevm and viem with natively
	TAddressArgs = TAddress extends undefined
		? {}
		: { address: TAddress; to: TAddress },
> = {
	// for each payable and nonpayable function in the abi, create an action creator
	[TFunctionName in
		// extract the names of the functions
		ExtractAbiFunctionNames<
			ParseAbi<THumanReadableAbi>,
			'payable' | 'nonpayable'
		>]: (<
		// use generic args to maintain typesafety. This is adapted from viem
		TArgs extends AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>['inputs']
		> &
			any[] = AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>['inputs']
		> &
			any[],
	>(
		// take the same args as the function
		...args: TArgs
	) => {
		// return the action creator that matches viem api and also tevm.contract tevm.script
		functionName: TFunctionName
		humanReadableAbi: FormatAbi<
			[ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>]
		>
		abi: [ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>]
		bytecode: TBytecode
		deployedBytecode: TDeployedBytecode
	} & (TArgs['length'] extends 0
		? {}
		: {
				args: TArgs
		  }) &
		TAddressArgs) & {
		functionName: TFunctionName
		humanReadableAbi: FormatAbi<
			[ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>]
		>
		abi: [ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>]
		bytecode: TBytecode
		deployedBytecode: TDeployedBytecode
	} & TAddressArgs
}
