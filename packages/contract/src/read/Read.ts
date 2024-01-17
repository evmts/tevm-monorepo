import type {
	AbiParametersToPrimitiveTypes,
	Address,
	ExtractAbiFunction,
	ExtractAbiFunctionNames,
	FormatAbi,
	ParseAbi,
} from 'abitype'
import type { Hex } from 'viem'
export type ValueOf<T> = T[keyof T]

export type Read<
	THumanReadableAbi extends readonly string[],
	TBytecode extends Hex | undefined,
	TDeployedBytecode extends Hex | undefined,
	TAddress extends Address | undefined,
	TAddressArgs = TAddress extends undefined ? {} : { address: TAddress },
> = {
	[TFunctionName in
		ExtractAbiFunctionNames<ParseAbi<THumanReadableAbi>, 'pure' | 'view'>]: (<
		TArgs extends AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>['inputs']
		> &
			any[] = AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>['inputs']
		> &
			any[],
	>(
		...args: TArgs
	) => {
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
