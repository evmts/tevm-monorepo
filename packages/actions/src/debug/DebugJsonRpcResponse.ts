import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { DebugTraceBlockResult, DebugTraceCallResult, DebugTraceTransactionResult } from './DebugResult.js'

// TODO type the errors strongly
type DebugError = string

// debug_traceTransaction
/**
 * JSON-RPC response for `debug_traceTransaction` procedure
 */
export type DebugTraceTransactionJsonRpcResponse = JsonRpcResponse<
	'debug_traceTransaction',
	SerializeToJson<DebugTraceTransactionResult>,
	DebugError
>

// debug_traceCall
/**
 * JSON-RPC response for `debug_traceCall` procedure
 */
export type DebugTraceCallJsonRpcResponse = JsonRpcResponse<
	'debug_traceCall',
	SerializeToJson<DebugTraceCallResult>,
	DebugError
>

// debug_traceBlock
/**
 * JSON-RPC response for `debug_traceBlock` procedure
 * @see https://docs.quicknode.com/api/ethereum/debug_traceblock
 */
export type DebugTraceBlockJsonRpcResponse = JsonRpcResponse<
	'debug_traceBlock',
	SerializeToJson<DebugTraceBlockResult>,
	DebugError
>
