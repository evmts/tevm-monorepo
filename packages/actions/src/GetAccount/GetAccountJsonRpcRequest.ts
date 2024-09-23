import type { JsonRpcRequest } from '@tevm/jsonrpc'
import type { GetAccountParams } from '../../../actions/types/GetAccount/GetAccountParams.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'

/**
 * JSON-RPC request for `tevm_getAccount` method
 */
export type GetAccountJsonRpcRequest = JsonRpcRequest<'tevm_getAccount', [SerializeToJson<GetAccountParams>]>
