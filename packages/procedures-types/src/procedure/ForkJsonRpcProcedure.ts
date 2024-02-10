import type { ForkJsonRpcRequest, ForkJsonRpcResponse } from '../index.js'

/**
 * @experimental This is an unimplemented experimental feature
 * Fork JSON-RPC procedure executes a call against the tevm EVM
 */
export type ForkJsonRpcProcedure = (
	request: ForkJsonRpcRequest,
) => Promise<ForkJsonRpcResponse>
