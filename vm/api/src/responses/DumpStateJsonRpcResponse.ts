import type { DumpStateError } from '../errors/DumpStateError.js'
import type { DumpStateResult } from '../result/DumpStateResult.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'

export type DumpStateJsonRpcResponse = JsonRpcResponse<
	'tevm_dump_state',
	SerializeToJson<DumpStateResult>,
	DumpStateError['_tag']
>
