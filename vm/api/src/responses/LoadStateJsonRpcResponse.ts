import type { LoadStateError } from '../errors/LoadStateError.js'
import type { LoadStateResult } from '../result/LoadStateResult.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'

export type LoadStateJsonRpcResponse = JsonRpcResponse<
	'tevm_load_state',
	SerializeToJson<LoadStateResult>,
	LoadStateError['_tag']
>
