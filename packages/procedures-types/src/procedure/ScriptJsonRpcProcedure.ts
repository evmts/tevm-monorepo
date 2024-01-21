import type { ScriptJsonRpcRequest, ScriptJsonRpcResponse } from '../index.js'

/**
 * Procedure for handling script JSON-RPC requests
 */
export type ScriptJsonRpcProcedure = (
	request: ScriptJsonRpcRequest,
) => Promise<ScriptJsonRpcResponse>
