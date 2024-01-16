
// tevm_traceCall

import type { TraceCallJsonRpcRequest } from "../requests/TraceCallJsonRpcRequest.js";
import type { TraceCallJsonRpcResponse } from "../responses/TraceCallJsonRpcResponse.js";

/**
 * JSON-RPC procedure for `tevm_traceCall`
 */
export type TraceCallProcedure = (
	request: TraceCallJsonRpcRequest,
) => Promise<TraceCallJsonRpcResponse>
