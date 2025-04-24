import type { JsonRpcRequest } from '@tevm/jsonrpc'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { DebugTraceCallParams, DebugTraceTransactionParams } from './DebugParams.js'

// debug_traceTransaction
/**
 * JSON-RPC request for `debug_traceTransaction` method
 */
export type DebugTraceTransactionJsonRpcRequest<
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean,
	TTTThrowOnError extends boolean = boolean,
> = JsonRpcRequest<
	'debug_traceTransaction',
	[SerializeToJson<DebugTraceTransactionParams<TTracer, TDiffMode, TTTThrowOnError>>]
>
// debug_traceCall
/**
 * JSON-RPC request for `debug_traceCall` method
 */
export type DebugTraceCallJsonRpcRequest<
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean,
> = JsonRpcRequest<'debug_traceCall', [SerializeToJson<DebugTraceCallParams<TTracer, TDiffMode>>]>

export type DebugJsonRpcRequest<
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean,
	TTTThrowOnError extends boolean = boolean,
> = DebugTraceTransactionJsonRpcRequest<TTracer, TDiffMode, TTTThrowOnError> | DebugTraceCallJsonRpcRequest<TTracer, TDiffMode>
