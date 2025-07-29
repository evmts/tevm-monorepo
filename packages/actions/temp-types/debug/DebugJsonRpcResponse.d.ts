import type { JsonRpcResponse } from '@tevm/jsonrpc';
import type { SerializeToJson } from '../utils/SerializeToJson.js';
import type { DebugTraceStateFilter } from './DebugParams.js';
import type { DebugTraceBlockResult, DebugTraceCallResult, DebugTraceStateResult, DebugTraceTransactionResult } from './DebugResult.js';
type DebugError = string;
/**
 * JSON-RPC response for `debug_traceTransaction` procedure
 */
export type DebugTraceTransactionJsonRpcResponse<TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer', TDiffMode extends boolean = boolean> = JsonRpcResponse<'debug_traceTransaction', SerializeToJson<DebugTraceTransactionResult<TTracer, TDiffMode>>, DebugError>;
/**
 * JSON-RPC response for `debug_traceCall` procedure
 */
export type DebugTraceCallJsonRpcResponse<TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer', TDiffMode extends boolean = boolean> = JsonRpcResponse<'debug_traceCall', SerializeToJson<DebugTraceCallResult<TTracer, TDiffMode>>, DebugError>;
/**
 * JSON-RPC response for `debug_traceBlock`
 */
export type DebugTraceBlockJsonRpcResponse<TTracer extends 'callTracer' | 'prestateTracer' = 'callTracer' | 'prestateTracer', TDiffMode extends boolean = boolean> = JsonRpcResponse<'debug_traceBlock', SerializeToJson<DebugTraceBlockResult<TTracer, TDiffMode>>, DebugError>;
/**
 * JSON-RPC response for `debug_traceState`
 */
export type DebugTraceStateJsonRpcResponse<TStateFilters extends readonly DebugTraceStateFilter[] = readonly DebugTraceStateFilter[]> = JsonRpcResponse<'debug_traceState', SerializeToJson<DebugTraceStateResult<TStateFilters>>, DebugError>;
export {};
//# sourceMappingURL=DebugJsonRpcResponse.d.ts.map