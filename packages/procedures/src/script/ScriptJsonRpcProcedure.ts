import type { ScriptJsonRpcRequest } from './ScriptJsonRpcRequest.js'
import type { ScriptJsonRpcResponse } from './ScriptJsonRpcResponse.js'

/**
 * Procedure for handling script JSON-RPC requests
 */
export type ScriptJsonRpcProcedure = (request: ScriptJsonRpcRequest) => Promise<ScriptJsonRpcResponse>
