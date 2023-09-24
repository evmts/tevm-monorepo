import type { BaseContractMethod } from './BaseContractMethod'
import type {
	Abi,
	AbiParametersToPrimitiveTypes,
	ExtractAbiFunction,
	ExtractAbiFunctionNames,
} from 'abitype'
import type { ContractTransactionResponse } from 'ethers'
import type { BaseContract } from 'ethers'

export type TypesafeEthersContract<TAbi extends Abi> = BaseContract & {
	// readonly methods
	[TFunctionName in
		ExtractAbiFunctionNames<TAbi, 'pure' | 'view'>]: BaseContractMethod<
		AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<TAbi, TFunctionName>['inputs']
		> &
			any[],
		// this is not a super robust way of doing this but should work for an initial release
		// this likely will have rough edges in non happy cases like the abi not being readable as const
		AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<TAbi, TFunctionName>['outputs']
		>[0],
		AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<TAbi, TFunctionName>['outputs']
		>[0]
	>
} & {
	// write methods
	[TFunctionName in
		ExtractAbiFunctionNames<
			TAbi,
			'nonpayable' | 'payable'
		>]: BaseContractMethod<
		AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<TAbi, TFunctionName>['inputs']
		> &
			any[],
		// this is not a super robust way of doing this but should work for an initial release
		// this likely will have rough edges in non happy cases like the abi not being readable as const
		AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<TAbi, TFunctionName>['outputs']
		>[0],
		ContractTransactionResponse
	>
}
