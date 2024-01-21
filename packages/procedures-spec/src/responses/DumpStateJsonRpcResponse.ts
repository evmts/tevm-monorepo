import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { DumpStateError } from '@tevm/actions-spec'
import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { ParameterizedTevmState } from '@tevm/state'

/**
 * The response to the `tevm_dumpState` JSON-RPC request.
 */
export type DumpStateJsonRpcResponse = JsonRpcResponse<
	'tevm_dumpState',
	SerializeToJson<{ state: ParameterizedTevmState }>,
	DumpStateError['_tag']
>
