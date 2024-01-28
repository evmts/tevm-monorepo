import type { JsonRpcRequest } from '@tevm/jsonrpc'

/**
 * The JSON-RPC request for the `tevm_fork` method
 */
export type ForkJsonRpcRequest = JsonRpcRequest<'tevm_fork', {}>
