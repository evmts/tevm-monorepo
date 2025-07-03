import type { AbiFunction, Hex } from 'viem'

export interface ToCallContractFunctionState {
	abiFunction: AbiFunction
	selector: Hex
	calldataMap: Map<Hex, Hex[]>
}
