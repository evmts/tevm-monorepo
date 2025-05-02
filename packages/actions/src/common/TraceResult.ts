import type { Hex } from './Hex.js'
import type { StructLog } from './StructLog.js'

/** Result from `debug_*` with no tracer */
export type TraceResult = {
	failed: boolean
	gas: bigint
	returnValue: Hex
	structLogs: Array<StructLog>
}
