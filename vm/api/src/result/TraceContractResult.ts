import type { ContractResult } from './ContractResult.js'
import type { StructLog } from './DebugResult.js'

// tevm_traceContract
/**
 * A special type of call that also returns tracing information
 */
export type TraceContractResult = {
	readonly callResult: ContractResult
	readonly failed: boolean
	readonly structLogs: ReadonlyArray<StructLog>
}
