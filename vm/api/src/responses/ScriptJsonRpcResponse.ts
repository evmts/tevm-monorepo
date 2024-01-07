import type { CallResult, ScriptError } from '../index.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'

export type ScriptJsonRpcResponse = JsonRpcResponse<
	'tevm_script',
	SerializeToJson<CallResult>,
	ScriptError['_tag']
>
