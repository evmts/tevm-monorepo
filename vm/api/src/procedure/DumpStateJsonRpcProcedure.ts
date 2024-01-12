import type { DumpStateJsonRpcRequest } from '../requests/DumpStateJsonRpcRequest.js'
import type { DumpStateJsonRpcResponse } from '../responses/DumpStateJsonRpcResponse.js'

/**
 * Procedure for handling script JSON-RPC requests
 */
export type DumpStateJsonRpcProcedure = (
	request: DumpStateJsonRpcRequest,
) => Promise<DumpStateJsonRpcResponse>
