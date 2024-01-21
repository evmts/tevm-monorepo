import type { JsonRpcRequest } from './JsonRpcRequest.js'

/**
 * The JSON-RPC request for the `tevm_dumpState` method
 */
export type DumpStateJsonRpcRequest = JsonRpcRequest<'tevm_dumpState', {}>
