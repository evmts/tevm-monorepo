import type { AbiFunction, Hex } from '@tevm/utils'

export interface ToCallContractFunctionState {
	abiFunction: AbiFunction
	selector: Hex
	calldataMap: Map<Hex, Hex[]>
}
