import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { ForkResult } from '@tevm/actions-types'
import type { ForkError } from '@tevm/errors'
import type { JsonRpcResponse } from '@tevm/jsonrpc'

/**
 * @experimental This is an unimplemented experimental feature
 * Response of the `tevm_fork` RPC method.
 */
export type ForkJsonRpcResponse = JsonRpcResponse<
	'tevm_fork',
	SerializeToJson<ForkResult>,
	ForkError['_tag']
>
