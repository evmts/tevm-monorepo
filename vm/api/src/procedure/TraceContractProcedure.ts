import type { TraceContractJsonRpcRequest } from "../requests/TraceContractJsonRpcRequest.js";
import type { TraceContractJsonRpcResponse } from "../responses/TraceContractJsonRpcResponse.js";

// tevm_traceContract
/**
 * JSON-RPC procedure for `tevm_traceContract`
 */
export type TraceContractProcedure = (
	request: TraceContractJsonRpcRequest,
) => Promise<TraceContractJsonRpcResponse>
