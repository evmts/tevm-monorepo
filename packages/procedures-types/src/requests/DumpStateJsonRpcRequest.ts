import type { JsonRpcRequest } from '@tevm/jsonrpc'

/**
 * The JSON-RPC request for the `tevm_dumpState` method
 */
export type DumpStateJsonRpcRequest = JsonRpcRequest<'tevm_dumpState', []>
