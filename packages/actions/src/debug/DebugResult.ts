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
 * The state of an account as captured by the prestateTracer
 */
export type AccountState = Partial<{
	readonly balance: Hex
	readonly nonce: string
	readonly code: Hex
	readonly storage: Record<Hex, Hex>
}>

/**
 * Result format for prestateTracer in normal mode (full state)
 */
export type PrestateTracerResult = Record<Hex, AccountState>

/**
 * Result format for prestateTracer in diff mode
 */
export type PrestateTracerDiffResult = {
	readonly pre: Record<Hex, AccountState>
	readonly post: Record<Hex, AccountState>
}

/**
 * Union type of possible prestate tracer results
 */
export type PrestateTracerAnyResult<TDiffMode extends boolean = boolean> = TDiffMode extends true
	? PrestateTracerDiffResult
	: TDiffMode extends false
		? PrestateTracerResult
		: PrestateTracerResult

/**
 * Result for standard EVM tracing with opcodes
 */
export type EvmTracerResult = {
	failed: boolean
	gas: bigint
	returnValue: Hex
	structLogs: Array<StructLog>
}

// debug_traceTransaction
export type DebugTraceTransactionResult<
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean,
> = TTracer extends 'callTracer'
	? TraceResult
	: TTracer extends 'prestateTracer'
		? PrestateTracerAnyResult<TDiffMode>
		: TraceResult

// debug_traceCall
export type DebugTraceCallResult<
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean,
> = TTracer extends 'callTracer'
	? EvmTracerResult
	: TTracer extends 'prestateTracer'
		? PrestateTracerAnyResult<TDiffMode>
		: EvmTracerResult
