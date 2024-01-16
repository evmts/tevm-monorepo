import type { TraceCallParams } from "../params/TraceCallParams.js";
import type { TraceCallResult } from "../result/TraceCallResult.js";

// tevm_traceCall
export type TraceCallHandler = (
	params: TraceCallParams,
) => Promise<TraceCallResult>
