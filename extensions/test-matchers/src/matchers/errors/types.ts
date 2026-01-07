import type { Abi, ContractErrorName, DecodeErrorResultReturnType, Hex } from '@tevm/utils'
import type { ContainsContractAbi } from '../../common/types.js'

export interface ToBeRevertedWithState<
	TAbi extends Abi | undefined = Abi | undefined,
	TErrorName extends TAbi extends Abi ? ContractErrorName<TAbi> : never = TAbi extends Abi
		? ContractErrorName<TAbi>
		: never,
> {
	decodedRevertData?: DecodeErrorResultReturnType<TAbi extends Abi ? TAbi : Abi, TErrorName> | undefined
	rawRevertData?: Hex | undefined
	contract?: ContainsContractAbi<TAbi extends Abi ? TAbi : Abi> | undefined
}
