import type { CallParams } from '../index.js'
import type { JsonRpcRequest } from './JsonRpcRequest.js'

export type CallJsonRpcRequest = JsonRpcRequest<'tevm_call', CallParams>
