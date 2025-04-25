import type {
	DebugTraceBlockJsonRpcRequest,
	DebugTraceCallJsonRpcRequest,
	DebugTraceTransactionJsonRpcRequest,
} from './DebugJsonRpcRequest.js'
import type {
	DebugTraceBlockJsonRpcResponse,
	DebugTraceCallJsonRpcResponse,
	DebugTraceTransactionJsonRpcResponse,
} from './DebugJsonRpcResponse.js'

/**
 * JSON-RPC procedure for `debug_traceTransaction`
 */
export type DebugTraceTransactionProcedure<
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean,
> = (
	request: DebugTraceTransactionJsonRpcRequest<TTracer, TDiffMode>,
) => Promise<DebugTraceTransactionJsonRpcResponse<TTracer, TDiffMode>>

/**
 * JSON-RPC procedure for `debug_traceCall`
 */
export type DebugTraceCallProcedure<
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean,
> = (
	request: DebugTraceCallJsonRpcRequest<TTracer, TDiffMode>,
) => Promise<DebugTraceCallJsonRpcResponse<TTracer, TDiffMode>>

/**
 * JSON-RPC procedure for `debug_traceBlock`
 */
export type DebugTraceBlockProcedure<
	TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer',
	TDiffMode extends boolean = boolean,
> = (
	request: DebugTraceBlockJsonRpcRequest<TTracer, TDiffMode>,
) => Promise<DebugTraceBlockJsonRpcResponse<TTracer, TDiffMode>>
