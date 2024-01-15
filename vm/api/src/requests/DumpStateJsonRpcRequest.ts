import type { JsonRpcRequest } from './JsonRpcRequest.js'

/**
 * The JSON-RPC request for the `tevm_script` method
 * Takes no parameters at this time thus retrieving the state for every account
 * TODO: Add parameters to request only a subset of the state
 */
export type DumpStateJsonRpcRequest = JsonRpcRequest<'tevm_dumpState', {}>
