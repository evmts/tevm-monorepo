import type { CallResult } from './CallResult.js'
import type { StructLog } from './DebugResult.js'

// tevm_traceCall
/**
 * A special type of call that also returns tracing information
 */
export type TraceCallResult = {
	readonly callResult: CallResult
	readonly failed: boolean
	readonly structLogs: ReadonlyArray<StructLog>
}
