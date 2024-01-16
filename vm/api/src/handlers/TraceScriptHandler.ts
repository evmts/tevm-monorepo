import type { TraceScriptParams } from "../params/TraceScriptParams.js";
import type { TraceScriptResult } from "../result/TraceScriptResult.js";

// tevm_traceScript
export type TraceScriptHandler = (
	params: TraceScriptParams,
) => Promise<TraceScriptResult>
