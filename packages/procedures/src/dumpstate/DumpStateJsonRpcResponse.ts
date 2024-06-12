import type { TevmDumpStateError } from '@tevm/actions'
import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { ParameterizedTevmState } from '@tevm/state'
import type { SerializeToJson } from '../utils/SerializeToJson.js'

/**
 * The response to the `tevm_dumpState` JSON-RPC request.
 */
export type DumpStateJsonRpcResponse = JsonRpcResponse<
	'tevm_dumpState',
	SerializeToJson<{ state: ParameterizedTevmState }>,
	TevmDumpStateError['code']
>
