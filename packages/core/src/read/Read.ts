import type {
	AbiParametersToPrimitiveTypes,
	ExtractAbiFunction,
	ExtractAbiFunctionNames,
	FormatAbi,
	ParseAbi,
} from 'abitype'
import type { Hex } from 'viem'
export type ValueOf<T> = T[keyof T]

export type Read<
	TName extends string,
	THumanReadableAbi extends readonly string[],
	TBytecode extends Hex | undefined,
	TDeployedBytecode extends Hex | undefined,
> = {
	[TFunctionName in
		ExtractAbiFunctionNames<ParseAbi<THumanReadableAbi>, 'pure' | 'view'>]: <
		TArgs extends AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>['inputs']
		> &
			any[] = AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>['inputs']
		> &
			any[],
	>(
		...args: TArgs
	) => TArgs['length'] extends 0
		? {
				evmtsContractName: TName
				functionName: TFunctionName
				humanReadableAbi: FormatAbi<
					[ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>]
				>
				abi: [ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>]
				bytecode: TBytecode
				deployedBytecode: TDeployedBytecode
		  }
		: {
				evmtsContractName: TName
				functionName: TFunctionName
				args: TArgs
				humanReadableAbi: FormatAbi<
					[ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>]
				>
				abi: [ExtractAbiFunction<ParseAbi<THumanReadableAbi>, TFunctionName>]
				bytecode: TBytecode
				deployedBytecode: TDeployedBytecode
		  }
}
