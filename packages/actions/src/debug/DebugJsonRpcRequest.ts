import type { JsonRpcRequest } from '@tevm/jsonrpc'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type {
	DebugTraceBlockParams,
	DebugTraceCallParams,
	DebugTraceStateFilter,
	DebugTraceStateParams,
	DebugTraceTransactionParams,
} from './DebugParams.js'

export type DebugJsonRpcRequest =
	| DebugTraceTransactionJsonRpcRequest
	| DebugTraceCallJsonRpcRequest
	| DebugTraceBlockJsonRpcRequest
	| DebugTraceStateJsonRpcRequest

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

/**
 * JSON-RPC request for `debug_traceCall` method
 */
export type DebugTraceCallJsonRpcRequest<
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean,
> = JsonRpcRequest<'debug_traceCall', [SerializeToJson<DebugTraceCallParams<TTracer, TDiffMode>>]>

/**
 * JSON-RPC request for `debug_traceBlock`
 */
export type DebugTraceBlockJsonRpcRequest<
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean,
> = JsonRpcRequest<'debug_traceBlock', [SerializeToJson<DebugTraceBlockParams<TTracer, TDiffMode>>]>

/**
 * JSON-RPC request for `debug_traceState`
 */
export type DebugTraceStateJsonRpcRequest<
	TStateFilters extends readonly DebugTraceStateFilter[] = readonly DebugTraceStateFilter[],
> = JsonRpcRequest<'debug_traceState', [SerializeToJson<DebugTraceStateParams<TStateFilters>>]>
