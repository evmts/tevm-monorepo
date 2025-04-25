// TODO we should make throwOnFail get handled generically here

import type { DebugTraceBlockParams, DebugTraceCallParams, DebugTraceTransactionParams } from './DebugParams.js'
import type { DebugTraceBlockResult, DebugTraceCallResult, DebugTraceTransactionResult } from './DebugResult.js'

// debug_traceTransaction
export type DebugTraceTransactionHandler = <
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean,
>(
	params: DebugTraceTransactionParams<TTracer, TDiffMode>,
) => Promise<DebugTraceTransactionResult<TTracer, TDiffMode>>

// debug_traceCall
export type DebugTraceCallHandler = <
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean,
>(
	params: DebugTraceCallParams<TTracer, TDiffMode>,
) => Promise<DebugTraceCallResult<TTracer, TDiffMode>>

// debug_traceBlock
export type DebugTraceBlockHandler = <
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean,
>(
	params: DebugTraceBlockParams<TTracer, TDiffMode>,
) => Promise<DebugTraceBlockResult<TTracer, TDiffMode>>
