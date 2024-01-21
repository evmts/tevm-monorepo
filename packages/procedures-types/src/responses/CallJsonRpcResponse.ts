import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { CallResult } from '@tevm/actions-types'
import type { CallError } from '@tevm/errors'
import type { JsonRpcResponse } from '@tevm/jsonrpc'

/**
 * JSON-RPC response for `tevm_call` procedure
 */
export type CallJsonRpcResponse = JsonRpcResponse<
	'tevm_call',
	SerializeToJson<CallResult>,
	CallError['_tag']
>
