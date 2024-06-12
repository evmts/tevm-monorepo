import type { TraceResult } from '../common/TraceResult.js'
import type { Hex } from '../common/index.js'

export type StructLog = {
	readonly depth: number
	readonly gas: bigint
	readonly gasCost: bigint
	readonly op: string
	readonly pc: number
	readonly stack: Array<Hex>
	readonly error?: {
		error: string
		errorType: string
	}
}

// debug_traceTransaction
export type DebugTraceTransactionResult = TraceResult
// debug_traceCall
export type DebugTraceCallResult = {
	failed: boolean
	gas: bigint
	returnValue: Hex
	structLogs: Array<StructLog>
}
