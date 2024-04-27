import type { MineParams } from '@tevm/actions-types'
import type { JsonRpcRequest } from '@tevm/jsonrpc'
import type { SerializeToJson } from '../utils/SerializeToJson.js'

/**
 * JSON-RPC request for `tevm_mine` method
 */
export type MineJsonRpcRequest = JsonRpcRequest<'tevm_mine', [SerializeToJson<MineParams>]>
