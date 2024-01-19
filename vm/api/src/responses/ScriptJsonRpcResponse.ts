import type { CallResult, ScriptError } from '../index.js'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { JsonRpcResponse } from './JsonRpcResponse.js'

/**
 * JSON-RPC response for `tevm_script` method
 * @example
 * import { createMemoryTevm } from 'tevm'
 *
 * const tevm = createMemoryTevm()
 *
 * const respose: ScriptJsonRpcResponse = await tevm.request({
 *   method: 'tevm_script',
 *   params: {
 *     deployedBytecode: '608...',
 *     abi: [...],
 *     args: [...]
 * })
 */
export type ScriptJsonRpcResponse = JsonRpcResponse<
	'tevm_script',
	SerializeToJson<CallResult>,
	ScriptError['_tag']
>
