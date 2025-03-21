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

/**
 * Represents an account state in the EVM
 */
export type AccountState = {
	readonly balance?: string
	readonly nonce?: number
	readonly code?: Hex
	readonly storage?: Record<string, string>
}

/**
 * Result type for prestateTracer
 */
export type PrestateTracerResult = {
	readonly pre: Record<string, AccountState>
	readonly post: Record<string, AccountState>
}

// debug_traceTransaction
export type DebugTraceTransactionResult = TraceResult | PrestateTracerResult
// debug_traceCall
export type DebugTraceCallResult = {
	failed: boolean
	gas: bigint
	returnValue: Hex
	structLogs: Array<StructLog>
} | PrestateTracerResult
