import type { ParameterizedTevmState } from '@tevm/state'
import type { DumpStateError } from '../errors/DumpStateError.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'

type SerializedResult = { state: ParameterizedTevmState }

export type DumpStateJsonRpcResponse = JsonRpcResponse<
	'tevm_dumpState',
	SerializeToJson<SerializedResult>,
	DumpStateError['_tag']
>
