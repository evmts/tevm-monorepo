import type { CallJsonRpcRequest, CallJsonRpcResponse } from "../index.js";

export type CallJsonRpcProcedure = (request: CallJsonRpcRequest) => Promise<CallJsonRpcResponse>
