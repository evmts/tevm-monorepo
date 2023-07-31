import type {
	Abi,
	AbiParametersToPrimitiveTypes,
	Address,
	ExtractAbiFunction,
	ExtractAbiFunctionNames,
	FormatAbi,
} from 'abitype'
export type ValueOf<T> = T[keyof T]

export type Write<
	TName extends string,
	TAddresses extends Record<number, Address>,
	TAbi extends Abi,
> = <TChainId extends keyof TAddresses>(options?: {
	chainId?: TChainId | number | undefined
}) => {
	[TFunctionName in ExtractAbiFunctionNames<TAbi, 'payable' | 'nonpayable'>]: <
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
				address: ValueOf<TAddresses>
				abi: [ExtractAbiFunction<TAbi, TFunctionName>]
				humanReadableAbi: FormatAbi<[ExtractAbiFunction<TAbi, TFunctionName>]>
				functionName: TFunctionName
		  }
		: {
				evmtsContractName: TName
				address: ValueOf<TAddresses>
				args: TArgs
				abi: [ExtractAbiFunction<TAbi, TFunctionName>]
				humanReadableAbi: FormatAbi<[ExtractAbiFunction<TAbi, TFunctionName>]>
		  }
}
