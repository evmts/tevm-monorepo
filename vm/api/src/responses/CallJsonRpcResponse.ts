import type { CallError, CallResult } from '../index.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'

export type CallJsonRpcResponse = JsonRpcResponse<
	'tevm_call',
	CallResult,
	CallError['_tag']
>
