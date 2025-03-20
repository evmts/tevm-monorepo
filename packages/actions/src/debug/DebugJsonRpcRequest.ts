import type { JsonRpcRequest } from '@tevm/jsonrpc'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { DebugTraceBlockParams, DebugTraceCallParams, DebugTraceTransactionParams } from './DebugParams.js'

// debug_traceTransaction
/**
 * JSON-RPC request for `debug_traceTransaction` method
 */
export type DebugTraceTransactionJsonRpcRequest = JsonRpcRequest<
	'debug_traceTransaction',
	[SerializeToJson<DebugTraceTransactionParams>]
>
// debug_traceCall
/**
 * JSON-RPC request for `debug_traceCall` method
 */
export type DebugTraceCallJsonRpcRequest = JsonRpcRequest<'debug_traceCall', [SerializeToJson<DebugTraceCallParams>]>

// debug_traceBlock
/**
 * JSON-RPC request for `debug_traceBlock` method
 * @see https://docs.quicknode.com/api/ethereum/debug_traceblock
 */
export type DebugTraceBlockJsonRpcRequest = JsonRpcRequest<
	'debug_traceBlock',
	[SerializeToJson<DebugTraceBlockParams['block']>, SerializeToJson<DebugTraceBlockParams['traceConfig']>]
>

export type DebugJsonRpcRequest =
	| DebugTraceTransactionJsonRpcRequest
	| DebugTraceCallJsonRpcRequest
	| DebugTraceBlockJsonRpcRequest
