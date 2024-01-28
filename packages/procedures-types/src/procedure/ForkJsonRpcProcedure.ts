import type { ForkJsonRpcRequest, ForkJsonRpcResponse } from '../index.js'

/**
 * Fork JSON-RPC procedure executes a call against the tevm EVM
 */
export type ForkJsonRpcProcedure = (
	request: ForkJsonRpcRequest,
) => Promise<ForkJsonRpcResponse>
