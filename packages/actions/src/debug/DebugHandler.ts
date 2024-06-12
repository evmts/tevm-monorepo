// TODO we should make throwOnFail get handled generically here

import type { DebugTraceCallParams, DebugTraceTransactionParams } from './DebugParams.js'
import type { DebugTraceCallResult, DebugTraceTransactionResult } from './DebugResult.js'

// debug_traceTransaction
export type DebugTraceTransactionHandler = (
	params: DebugTraceTransactionParams<boolean>,
) => Promise<DebugTraceTransactionResult>
// debug_traceCall
export type DebugTraceCallHandler = (params: DebugTraceCallParams) => Promise<DebugTraceCallResult>
