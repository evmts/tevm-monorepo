import type { DebugTraceCallJsonRpcRequest, DebugTraceTransactionJsonRpcRequest } from './DebugJsonRpcRequest.js'
import type { DebugTraceCallJsonRpcResponse, DebugTraceTransactionJsonRpcResponse } from './DebugJsonRpcResponse.js'

/**
 * JSON-RPC procedure for `debug_traceTransaction`
 */
export type DebugTraceTransactionProcedure<
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean,
> = (
	request: DebugTraceTransactionJsonRpcRequest<TTracer, TDiffMode>,
) => Promise<DebugTraceTransactionJsonRpcResponse<TTracer, TDiffMode>>
// debug_traceCall
/**
 * JSON-RPC procedure for `debug_traceCall`
 */
export type DebugTraceCallProcedure<
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean,
> = (request: DebugTraceCallJsonRpcRequest<TTracer, TDiffMode>) => Promise<DebugTraceCallJsonRpcResponse<TTracer, TDiffMode>>
