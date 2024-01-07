import type { CallResult, ScriptError } from '../index.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'

export type ScriptJsonRpcResponse = JsonRpcResponse<
	'tevm_script',
	CallResult,
	ScriptError['_tag']
>
