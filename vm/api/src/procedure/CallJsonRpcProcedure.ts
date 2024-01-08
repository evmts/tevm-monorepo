import type { CallJsonRpcRequest, CallJsonRpcResponse } from '../index.js'

/**
 * Call JSON-RPC procedure executes a call against the tevm EVM
 */
export type CallJsonRpcProcedure = (
	request: CallJsonRpcRequest,
) => Promise<CallJsonRpcResponse>
