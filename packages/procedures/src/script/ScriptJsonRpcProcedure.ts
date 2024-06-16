import type { ScriptJsonRpcRequest } from './ScriptJsonRpcRequest.js'
import type { ScriptJsonRpcResponse } from './ScriptJsonRpcResponse.js'

/**
 * @deprecated Use CallJsonRpcProcedure instead
 * Procedure for handling script JSON-RPC requests
 */
export type ScriptJsonRpcProcedure = (request: ScriptJsonRpcRequest) => Promise<ScriptJsonRpcResponse>
