import type { CallResult, TevmCallError } from '@tevm/actions'
import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { SerializeToJson } from '../utils/SerializeToJson.js'

/**
 * JSON-RPC response for `tevm_call` procedure
 */
export type CallJsonRpcResponse = JsonRpcResponse<'tevm_call', SerializeToJson<CallResult>, TevmCallError['code']>
