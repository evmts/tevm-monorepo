import type {
	DebugTraceCallParams,
	DebugTraceTransactionParams,
} from '../params/index.js'
import type {
	DebugTraceCallResult,
	DebugTraceTransactionResult,
} from '../result/index.js'

// debug_traceTransaction
export type DebugTraceTransactionHandler = (
	params: DebugTraceTransactionParams,
) => Promise<DebugTraceTransactionResult>
// debug_traceCall
export type DebugTraceCallHandler = (
	params: DebugTraceCallParams,
) => Promise<DebugTraceCallResult>
