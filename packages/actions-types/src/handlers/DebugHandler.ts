import type {
	DebugTraceCallParams,
	DebugTraceTransactionParams,
} from '../params/index.js'
import type {
	DebugTraceCallResult,
	DebugTraceTransactionResult,
} from '../result/index.js'

// TODO we should make throwOnFail get handled generically here
// debug_traceTransaction
export type DebugTraceTransactionHandler = (
	params: DebugTraceTransactionParams<boolean>,
) => Promise<DebugTraceTransactionResult>
// debug_traceCall
export type DebugTraceCallHandler = (
	params: DebugTraceCallParams,
) => Promise<DebugTraceCallResult>
