import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcRequest } from './JsonRpcRequest.js'
import type { SetAccountParams } from '@tevm/actions-spec'

/**
 * JSON-RPC request for `tevm_setAccount` method
 */
export type SetAccountJsonRpcRequest = JsonRpcRequest<
	'tevm_setAccount',
	SerializeToJson<SetAccountParams>
>
