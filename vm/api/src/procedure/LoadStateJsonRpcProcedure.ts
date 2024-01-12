import type { LoadStateJsonRpcRequest } from '../requests/LoadStateJsonRpcRequest.js'
import type { LoadStateJsonRpcResponse } from '../responses/LoadStateJsonRpcResponse.js'

/**
 * Procedure for handling script JSON-RPC requests
 */
export type LoadStateJsonRpcProcedure = (
	request: LoadStateJsonRpcRequest,
) => Promise<LoadStateJsonRpcResponse>
