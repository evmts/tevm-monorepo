import type { TraceContractParams } from "../params/TraceContractParams.js";
import type { TraceContractResult } from "../result/TraceContractResult.js";

// tevm_traceCall
export type TraceContractHandler = (
	params: TraceContractParams,
) => Promise<TraceContractResult>
