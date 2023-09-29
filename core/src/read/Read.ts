import type {
	Abi,
	AbiParametersToPrimitiveTypes,
	ExtractAbiFunction,
	ExtractAbiFunctionNames,
	FormatAbi,
} from 'abitype'
export type ValueOf<T> = T[keyof T]

export type Read<TName extends string, TAbi extends Abi> = {
	[TFunctionName in ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>]: <
		TArgs extends AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<TAbi, TFunctionName>['inputs']
		> &
			any[] = AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<TAbi, TFunctionName>['inputs']
		> &
			any[],
	>(
		...args: TArgs
	) => TArgs['length'] extends 0
		? {
				evmtsContractName: TName
				abi: [ExtractAbiFunction<TAbi, TFunctionName>]
				humanReadableAbi: FormatAbi<[ExtractAbiFunction<TAbi, TFunctionName>]>
				functionName: TFunctionName
		  }
		: {
				evmtsContractName: TName
				abi: [ExtractAbiFunction<TAbi, TFunctionName>]
				humanReadableAbi: FormatAbi<[ExtractAbiFunction<TAbi, TFunctionName>]>
				functionName: TFunctionName
				args: TArgs
		  }
}
