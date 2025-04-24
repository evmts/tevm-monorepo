// TODO we should make throwOnFail get handled generically here

import type { DebugTraceCallParams, DebugTraceTransactionParams } from './DebugParams.js'
import type { DebugTraceCallResult, DebugTraceTransactionResult } from './DebugResult.js'

// debug_traceTransaction
export type DebugTraceTransactionHandler = <
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean
>(params: DebugTraceTransactionParams<TTracer, TDiffMode>) => Promise<DebugTraceTransactionResult<TTracer, TDiffMode>>

// debug_traceCall
export type DebugTraceCallHandler = <
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean
>(params: DebugTraceCallParams<TTracer, TDiffMode>) => Promise<DebugTraceCallResult<TTracer, TDiffMode>>
