import type { TraceScriptJsonRpcRequest } from "../requests/TraceScriptJsonRpcRequest.js";
import type { TraceScriptJsonRpcResponse } from "../responses/TraceScriptJsonRpcResponse.js";

// tevm_traceScript

/**
 * JSON-RPC procedure for `tevm_traceScript`
 */
export type TraceScriptProcedure = (
	request: TraceScriptJsonRpcRequest,
) => Promise<TraceScriptJsonRpcResponse>
