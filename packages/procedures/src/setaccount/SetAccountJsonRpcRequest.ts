import type { SetAccountParams } from '@tevm/actions'
import type { JsonRpcRequest } from '@tevm/jsonrpc'
import type { SerializeToJson } from '../utils/SerializeToJson.js'

/**
 * JSON-RPC request for `tevm_setAccount` method
 */
export type SetAccountJsonRpcRequest = JsonRpcRequest<'tevm_setAccount', [SerializeToJson<SetAccountParams>]>
