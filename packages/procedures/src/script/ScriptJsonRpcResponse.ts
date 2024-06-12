import type { CallResult, TevmScriptError } from '@tevm/actions'
import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { SerializeToJson } from '../utils/SerializeToJson.js'

/**
 * JSON-RPC response for `tevm_script` method
 * @example
 * import { createMemoryClient } from 'tevm'
 *
 * const tevm = createMemoryClient()
 *
 * const respose: ScriptJsonRpcResponse = await tevm.request({
 *   method: 'tevm_script',
 *   params: {
 *     deployedBytecode: '608...',
 *     abi: [...],
 *     args: [...]
 * })
 */
export type ScriptJsonRpcResponse = JsonRpcResponse<'tevm_script', SerializeToJson<CallResult>, TevmScriptError['code']>
