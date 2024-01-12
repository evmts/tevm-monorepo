import type { JsonRpcRequest } from './JsonRpcRequest.js'

/**
 * JSON-RPC request for `tevm_state` method
 */
export type StateJsonRpcRequest = JsonRpcRequest<'tevm_state', boolean>
