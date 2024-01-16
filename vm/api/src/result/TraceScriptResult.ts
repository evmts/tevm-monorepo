import type { ScriptResult } from './ScriptResult.js'
import type { StructLog } from './DebugResult.js'

// tevm_traceScript
/**
 * A special type of call that also returns tracing information
 */
export type TraceScriptResult = {
	readonly callResult: ScriptResult
	readonly failed: boolean
	readonly structLogs: ReadonlyArray<StructLog>
}
