import type { BaseContractMethod } from './BaseContractMethod'
import type {
	Abi,
	AbiParametersToPrimitiveTypes,
	ExtractAbiFunction,
	ExtractAbiFunctionNames,
} from 'abitype'
// TODO import in more code splittable way once first version of this is done
// doing this just to move faster for now with that sweet sweet intellisense
import type { BaseContract } from 'ethers'

export type TypesafeEthersContract<TAbi extends Abi> = BaseContract & {
	[TFunctionName in
		ExtractAbiFunctionNames<
			TAbi,
			'pure' | 'view' | 'nonpayable' | 'payable'
		>]: BaseContractMethod<
		AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<TAbi, TFunctionName>['inputs']
		> &
			any[],
		// this is not a super robust way of doing this but should work for an initial release
		// this likely will have rough edges in non happy cases like the abi not being readable as const
		AbiParametersToPrimitiveTypes<
			ExtractAbiFunction<TAbi, TFunctionName>['outputs']
		>[0]
	>
}
