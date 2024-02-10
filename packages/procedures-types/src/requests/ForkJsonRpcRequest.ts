import type { SerializeToJson } from '../index.js'
import type { ForkParams } from '@tevm/actions-types'
import type { JsonRpcRequest } from '@tevm/jsonrpc'

/**
 * @experimental This is an unimplemented experimental feature
 * The JSON-RPC request for the `tevm_fork` method
 */
export type ForkJsonRpcRequest = JsonRpcRequest<
	'tevm_fork',
	SerializeToJson<ForkParams>
>
