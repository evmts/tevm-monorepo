import type { Abi, Log } from "viem"

// Contract-like object with ABI
export interface ContainsContractAbi<TAbi extends Abi = Abi> {
	abi: TAbi
	address?: `0x${string}`
}

// Transaction-like object that has logs
export interface ContainsTransactionLogs {
	logs: Log[]
}