import type {
	DebugDumpBlockJsonRpcRequest,
	DebugGetModifiedAccountsByHashJsonRpcRequest,
	DebugGetModifiedAccountsByNumberJsonRpcRequest,
	DebugGetRawBlockJsonRpcRequest,
	DebugGetRawHeaderJsonRpcRequest,
	DebugGetRawReceiptsJsonRpcRequest,
	DebugGetRawTransactionJsonRpcRequest,
	DebugIntermediateRootsJsonRpcRequest,
	DebugPreimageJsonRpcRequest,
	DebugStorageRangeAtJsonRpcRequest,
	DebugTraceBlockByHashJsonRpcRequest,
	DebugTraceBlockByNumberJsonRpcRequest,
	DebugTraceBlockJsonRpcRequest,
	DebugTraceCallJsonRpcRequest,
	DebugTraceChainJsonRpcRequest,
	DebugTraceStateJsonRpcRequest,
	DebugTraceTransactionJsonRpcRequest,
} from './DebugJsonRpcRequest.js'
import type {
	DebugDumpBlockJsonRpcResponse,
	DebugGetModifiedAccountsByHashJsonRpcResponse,
	DebugGetModifiedAccountsByNumberJsonRpcResponse,
	DebugGetRawBlockJsonRpcResponse,
	DebugGetRawHeaderJsonRpcResponse,
	DebugGetRawReceiptsJsonRpcResponse,
	DebugGetRawTransactionJsonRpcResponse,
	DebugIntermediateRootsJsonRpcResponse,
	DebugPreimageJsonRpcResponse,
	DebugStorageRangeAtJsonRpcResponse,
	DebugTraceBlockByHashJsonRpcResponse,
	DebugTraceBlockByNumberJsonRpcResponse,
	DebugTraceBlockJsonRpcResponse,
	DebugTraceCallJsonRpcResponse,
	DebugTraceChainJsonRpcResponse,
	DebugTraceStateJsonRpcResponse,
	DebugTraceTransactionJsonRpcResponse,
} from './DebugJsonRpcResponse.js'
import type { DebugTraceStateFilter } from './DebugParams.js'

/**
 * JSON-RPC procedure for `debug_traceTransaction`
 */
export type DebugTraceTransactionProcedure<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer',
	TDiffMode extends boolean = boolean,
> = (
	request: DebugTraceTransactionJsonRpcRequest<TTracer, TDiffMode>,
) => Promise<DebugTraceTransactionJsonRpcResponse<TTracer, TDiffMode>>

/**
 * JSON-RPC procedure for `debug_traceCall`
 */
export type DebugTraceCallProcedure<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer',
	TDiffMode extends boolean = boolean,
> = (
	request: DebugTraceCallJsonRpcRequest<TTracer, TDiffMode>,
) => Promise<DebugTraceCallJsonRpcResponse<TTracer, TDiffMode>>

/**
 * JSON-RPC procedure for `debug_traceBlock`
 */
export type DebugTraceBlockProcedure<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer',
	TDiffMode extends boolean = boolean,
> = (
	request: DebugTraceBlockJsonRpcRequest<TTracer, TDiffMode>,
) => Promise<DebugTraceBlockJsonRpcResponse<TTracer, TDiffMode>>

/**
 * JSON-RPC procedure for `debug_traceBlockByNumber`
 */
export type DebugTraceBlockByNumberProcedure<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer',
	TDiffMode extends boolean = boolean,
> = (
	request: DebugTraceBlockByNumberJsonRpcRequest<TTracer, TDiffMode>,
) => Promise<DebugTraceBlockByNumberJsonRpcResponse<TTracer, TDiffMode>>

/**
 * JSON-RPC procedure for `debug_traceBlockByHash`
 */
export type DebugTraceBlockByHashProcedure<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer',
	TDiffMode extends boolean = boolean,
> = (
	request: DebugTraceBlockByHashJsonRpcRequest<TTracer, TDiffMode>,
) => Promise<DebugTraceBlockByHashJsonRpcResponse<TTracer, TDiffMode>>

/**
 * JSON-RPC procedure for `debug_traceState`
 */
export type DebugTraceStateProcedure<
	TStateFilters extends readonly DebugTraceStateFilter[] = readonly DebugTraceStateFilter[],
> = (request: DebugTraceStateJsonRpcRequest<TStateFilters>) => Promise<DebugTraceStateJsonRpcResponse<TStateFilters>>

/**
 * JSON-RPC procedure for `debug_dumpBlock`
 */
export type DebugDumpBlockProcedure = (request: DebugDumpBlockJsonRpcRequest) => Promise<DebugDumpBlockJsonRpcResponse>

/**
 * JSON-RPC procedure for `debug_getModifiedAccountsByNumber`
 */
export type DebugGetModifiedAccountsByNumberProcedure = (
	request: DebugGetModifiedAccountsByNumberJsonRpcRequest,
) => Promise<DebugGetModifiedAccountsByNumberJsonRpcResponse>

/**
 * JSON-RPC procedure for `debug_getModifiedAccountsByHash`
 */
export type DebugGetModifiedAccountsByHashProcedure = (
	request: DebugGetModifiedAccountsByHashJsonRpcRequest,
) => Promise<DebugGetModifiedAccountsByHashJsonRpcResponse>

/**
 * JSON-RPC procedure for `debug_storageRangeAt`
 */
export type DebugStorageRangeAtProcedure = (
	request: DebugStorageRangeAtJsonRpcRequest,
) => Promise<DebugStorageRangeAtJsonRpcResponse>

/**
 * JSON-RPC procedure for `debug_getRawBlock`
 */
export type DebugGetRawBlockProcedure = (
	request: DebugGetRawBlockJsonRpcRequest,
) => Promise<DebugGetRawBlockJsonRpcResponse>

/**
 * JSON-RPC procedure for `debug_getRawHeader`
 */
export type DebugGetRawHeaderProcedure = (
	request: DebugGetRawHeaderJsonRpcRequest,
) => Promise<DebugGetRawHeaderJsonRpcResponse>

/**
 * JSON-RPC procedure for `debug_getRawTransaction`
 */
export type DebugGetRawTransactionProcedure = (
	request: DebugGetRawTransactionJsonRpcRequest,
) => Promise<DebugGetRawTransactionJsonRpcResponse>

/**
 * JSON-RPC procedure for `debug_getRawReceipts`
 */
export type DebugGetRawReceiptsProcedure = (
	request: DebugGetRawReceiptsJsonRpcRequest,
) => Promise<DebugGetRawReceiptsJsonRpcResponse>

/**
 * JSON-RPC procedure for `debug_intermediateRoots`
 */
export type DebugIntermediateRootsProcedure = (
	request: DebugIntermediateRootsJsonRpcRequest,
) => Promise<DebugIntermediateRootsJsonRpcResponse>

/**
 * JSON-RPC procedure for `debug_preimage`
 */
export type DebugPreimageProcedure = (request: DebugPreimageJsonRpcRequest) => Promise<DebugPreimageJsonRpcResponse>

/**
 * JSON-RPC procedure for `debug_traceChain`
 */
export type DebugTraceChainProcedure<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer',
	TDiffMode extends boolean = boolean,
> = (
	request: DebugTraceChainJsonRpcRequest<TTracer, TDiffMode>,
) => Promise<DebugTraceChainJsonRpcResponse<TTracer, TDiffMode>>
