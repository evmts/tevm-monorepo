import type { MineResult } from '@tevm/actions'
// import type { MineError } from '@tevm/errors'
import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { SerializeToJson } from '../utils/SerializeToJson.js'

/**
 * JSON-RPC response for `tevm_mine` method
 */
export type MineJsonRpcResponse = JsonRpcResponse<
	'tevm_mine',
	SerializeToJson<MineResult>,
	any // MineError['_tag']
>
