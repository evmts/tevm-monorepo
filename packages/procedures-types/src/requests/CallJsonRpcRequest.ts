import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { CallParams } from '@tevm/actions-types'
import type { JsonRpcRequest } from '@tevm/jsonrpc'

/**
 * JSON-RPC request for `tevm_call`
 */
export type CallJsonRpcRequest = JsonRpcRequest<
	'tevm_call',
	[
		params: SerializeToJson<
			Omit<CallParams, 'stateOverrideSet' | 'blockOverrideSet'>
		>,
		stateOverrideSet?: SerializeToJson<CallParams['stateOverrideSet']>,
		blockOverrideSet?: SerializeToJson<CallParams['blockOverrideSet']>,
	]
>
