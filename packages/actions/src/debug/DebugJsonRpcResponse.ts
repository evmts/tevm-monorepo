// debug_traceTransaction

import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { DebugTraceBlockResult, DebugTraceCallResult, DebugTraceTransactionResult } from './DebugResult.js'

// TODO type the errors strongly
type DebugError = string

/**
 * JSON-RPC response for `debug_traceTransaction` procedure
 */
export type DebugTraceTransactionJsonRpcResponse<
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean,
> = JsonRpcResponse<
	'debug_traceTransaction',
	SerializeToJson<DebugTraceTransactionResult<TTracer, TDiffMode>>,
	DebugError
>
// debug_traceCall
/**
 * JSON-RPC response for `debug_traceCall` procedure
 */
export type DebugTraceCallJsonRpcResponse<
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean,
> = JsonRpcResponse<'debug_traceCall', SerializeToJson<DebugTraceCallResult<TTracer, TDiffMode>>, DebugError>

/**
 * JSON-RPC response for `debug_traceBlock`
 */
export type DebugTraceBlockJsonRpcResponse<
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean,
> = JsonRpcResponse<'debug_traceBlock', SerializeToJson<DebugTraceBlockResult<TTracer, TDiffMode>>, DebugError>
