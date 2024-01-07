import type { CallParams } from '../index.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcRequest } from './JsonRpcRequest.js'

export type CallJsonRpcRequest = JsonRpcRequest<'tevm_call', SerializeToJson<CallParams>>
