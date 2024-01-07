import type { CallJsonRpcRequest, CallJsonRpcResponse } from "../index.js";

/**
 *  Since ContractJsonRpcProcedure is a quality of life wrapper around CallJsonRpcProcedure
 *  We choose to overload the type instead of creating a new one
 */
export type ContractJsonRpcProcedure = CallJsonRpcRequest
