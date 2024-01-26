import type { TraceResult } from '../common/TraceResult.js'
import type { Hex } from '../common/index.js'

export type StructLog = {
	readonly depth: number
	readonly gas: bigint
	readonly gasCost: bigint
	readonly op: string
	readonly pc: number
	readonly stack: ReadonlyArray<Hex>
}

// debug_traceTransaction
export type DebugTraceTransactionResult = TraceResult
// debug_traceCall
export type DebugTraceCallResult = {
	readonly failed: boolean
	readonly gas: bigint
	readonly returnValue: Hex
	readonly structLogs: ReadonlyArray<StructLog>
}
