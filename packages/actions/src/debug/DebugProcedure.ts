import type {
	DebugTraceBlockJsonRpcRequest,
	DebugTraceCallJsonRpcRequest,
	DebugTraceStateJsonRpcRequest,
	DebugTraceTransactionJsonRpcRequest,
} from './DebugJsonRpcRequest.js'
import type {
	DebugTraceBlockJsonRpcResponse,
	DebugTraceCallJsonRpcResponse,
	DebugTraceStateJsonRpcResponse,
	DebugTraceTransactionJsonRpcResponse,
} from './DebugJsonRpcResponse.js'
import type { DebugTraceStateFilter } from './DebugParams.js'

/**
 * JSON-RPC procedure for `debug_traceTransaction`
 */
export type DebugTraceTransactionProcedure<
	TTracer extends 'callTracer' | 'prestateTracer' | 'flatCallTracer' = 'callTracer' | 'prestateTracer' | 'flatCallTracer',
	TDiffMode extends boolean = boolean,
> = (
	request: DebugTraceTransactionJsonRpcRequest<TTracer, TDiffMode>,
) => Promise<DebugTraceTransactionJsonRpcResponse<TTracer, TDiffMode>>

/**
 * JSON-RPC procedure for `debug_traceCall`
 */
export type DebugTraceCallProcedure<
	TTracer extends 'callTracer' | 'prestateTracer' | 'flatCallTracer' = 'callTracer' | 'prestateTracer' | 'flatCallTracer',
	TDiffMode extends boolean = boolean,
> = (
	request: DebugTraceCallJsonRpcRequest<TTracer, TDiffMode>,
) => Promise<DebugTraceCallJsonRpcResponse<TTracer, TDiffMode>>

/**
 * JSON-RPC procedure for `debug_traceBlock`
 */
export type DebugTraceBlockProcedure<
	TTracer extends 'callTracer' | 'prestateTracer' | 'flatCallTracer' = 'callTracer' | 'prestateTracer' | 'flatCallTracer',
	TDiffMode extends boolean = boolean,
> = (
	request: DebugTraceBlockJsonRpcRequest<TTracer, TDiffMode>,
) => Promise<DebugTraceBlockJsonRpcResponse<TTracer, TDiffMode>>

/**
 * JSON-RPC procedure for `debug_traceState`
 */
export type DebugTraceStateProcedure<
	TStateFilters extends readonly DebugTraceStateFilter[] = readonly DebugTraceStateFilter[],
> = (request: DebugTraceStateJsonRpcRequest<TStateFilters>) => Promise<DebugTraceStateJsonRpcResponse<TStateFilters>>
