import type { CallResult } from '@tevm/actions'
import type { Abi, AbiParameter, AbiParameterToPrimitiveType, Address, Hex, Log, TransactionReceipt } from 'viem'

// Contract-like object with ABI
export interface ContainsContractAbi<TAbi extends Abi = Abi> {
	abi: TAbi
	address?: `0x${string}`
}

// Contract-like object with ABI and address (required for function calls)
export interface ContainsContractAbiAndAddress<TAbi extends Abi = Abi> {
	abi: TAbi
	address: `0x${string}`
}

// Transaction-like object that has logs
export interface ContainsTransactionLogs {
	logs: Log[]
}

// Account-like object with address
export interface ContainsAddress {
	address: Address
}

export type ContainsTransactionAny = Hex | CallResult | TransactionReceipt

// Helper type to convert ABI event inputs to named object
export type AbiInputsToNamedArgs<TInputs extends readonly AbiParameter[]> = {
	[K in TInputs[number] as K extends { name: infer TName extends string } ? TName : never]: K extends { name: string }
		? AbiParameterToPrimitiveType<K>
		: never
}
