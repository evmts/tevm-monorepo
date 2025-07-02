import type { Abi, ContractFunctionName, DecodeFunctionDataReturnType, Hex } from 'viem'
import type { ContainsContractAbiAndAddress } from '../../common/types.js'

export interface ToCallContractFunctionState<
	TAbi extends Abi | undefined = Abi | undefined,
	TFunctionName extends TAbi extends Abi ? ContractFunctionName<TAbi> : never = TAbi extends Abi
		? ContractFunctionName<TAbi>
		: never,
> {
	decodedFunctionData?: DecodeFunctionDataReturnType<TAbi extends Abi ? TAbi : Abi, TFunctionName> | undefined
	rawFunctionData?: Hex | undefined
	contract?: ContainsContractAbiAndAddress<TAbi extends Abi ? TAbi : Abi> | undefined
	transactionTo?: Hex | undefined
}