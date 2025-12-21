// debug_traceTransaction

import type { JsonRpcResponse } from '@tevm/jsonrpc'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type { DebugTraceStateFilter } from './DebugParams.js'
import type {
	DebugDumpBlockResult,
	DebugGetModifiedAccountsByHashResult,
	DebugGetModifiedAccountsByNumberResult,
	DebugGetRawBlockResult,
	DebugGetRawHeaderResult,
	DebugGetRawReceiptsResult,
	DebugGetRawTransactionResult,
	DebugIntermediateRootsResult,
	DebugPreimageResult,
	DebugStorageRangeAtResult,
	DebugTraceBlockResult,
	DebugTraceCallResult,
	DebugTraceChainResult,
	DebugTraceStateResult,
	DebugTraceTransactionResult,
} from './DebugResult.js'

// TODO type the errors strongly
type DebugError = string

/**
 * JSON-RPC response for `debug_traceTransaction` procedure
 */
export type DebugTraceTransactionJsonRpcResponse<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer',
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
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer',
	TDiffMode extends boolean = boolean,
> = JsonRpcResponse<'debug_traceCall', SerializeToJson<DebugTraceCallResult<TTracer, TDiffMode>>, DebugError>

/**
 * JSON-RPC response for `debug_traceBlock`
 */
export type DebugTraceBlockJsonRpcResponse<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer',
	TDiffMode extends boolean = boolean,
> = JsonRpcResponse<'debug_traceBlock', SerializeToJson<DebugTraceBlockResult<TTracer, TDiffMode>>, DebugError>

/**
 * JSON-RPC response for `debug_traceBlockByNumber` procedure
 */
export type DebugTraceBlockByNumberJsonRpcResponse<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer',
	TDiffMode extends boolean = boolean,
> = JsonRpcResponse<'debug_traceBlockByNumber', SerializeToJson<DebugTraceBlockResult<TTracer, TDiffMode>>, DebugError>

/**
 * JSON-RPC response for `debug_traceBlockByHash` procedure
 */
export type DebugTraceBlockByHashJsonRpcResponse<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer',
	TDiffMode extends boolean = boolean,
> = JsonRpcResponse<'debug_traceBlockByHash', SerializeToJson<DebugTraceBlockResult<TTracer, TDiffMode>>, DebugError>

/**
 * JSON-RPC response for `debug_traceState`
 */
export type DebugTraceStateJsonRpcResponse<
	TStateFilters extends readonly DebugTraceStateFilter[] = readonly DebugTraceStateFilter[],
> = JsonRpcResponse<'debug_traceState', SerializeToJson<DebugTraceStateResult<TStateFilters>>, DebugError>

/**
 * JSON-RPC response for `debug_dumpBlock`
 */
export type DebugDumpBlockJsonRpcResponse = JsonRpcResponse<
	'debug_dumpBlock',
	SerializeToJson<DebugDumpBlockResult>,
	DebugError
>

/**
 * JSON-RPC response for `debug_getModifiedAccountsByNumber`
 */
export type DebugGetModifiedAccountsByNumberJsonRpcResponse = JsonRpcResponse<
	'debug_getModifiedAccountsByNumber',
	SerializeToJson<DebugGetModifiedAccountsByNumberResult>,
	DebugError
>

/**
 * JSON-RPC response for `debug_getModifiedAccountsByHash`
 */
export type DebugGetModifiedAccountsByHashJsonRpcResponse = JsonRpcResponse<
	'debug_getModifiedAccountsByHash',
	SerializeToJson<DebugGetModifiedAccountsByHashResult>,
	DebugError
>

/**
 * JSON-RPC response for `debug_storageRangeAt`
 */
export type DebugStorageRangeAtJsonRpcResponse = JsonRpcResponse<
	'debug_storageRangeAt',
	SerializeToJson<DebugStorageRangeAtResult>,
	DebugError
>

/**
 * JSON-RPC response for `debug_intermediateRoots`
 */
export type DebugIntermediateRootsJsonRpcResponse = JsonRpcResponse<
	'debug_intermediateRoots',
	SerializeToJson<DebugIntermediateRootsResult>,
	DebugError
>

/**
 * JSON-RPC response for `debug_preimage`
 */
export type DebugPreimageJsonRpcResponse = JsonRpcResponse<
	'debug_preimage',
	SerializeToJson<DebugPreimageResult>,
	DebugError
>

/**
 * JSON-RPC response for `debug_traceChain`
 */
export type DebugTraceChainJsonRpcResponse<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer',
	TDiffMode extends boolean = boolean,
> = JsonRpcResponse<'debug_traceChain', SerializeToJson<DebugTraceChainResult<TTracer, TDiffMode>>, DebugError>

/**
 * JSON-RPC response for `debug_getRawBlock`
 */
export type DebugGetRawBlockJsonRpcResponse = JsonRpcResponse<
	'debug_getRawBlock',
	SerializeToJson<DebugGetRawBlockResult>,
	DebugError
>

/**
 * JSON-RPC response for `debug_getRawHeader`
 */
export type DebugGetRawHeaderJsonRpcResponse = JsonRpcResponse<
	'debug_getRawHeader',
	SerializeToJson<DebugGetRawHeaderResult>,
	DebugError
>

/**
 * JSON-RPC response for `debug_getRawTransaction`
 */
export type DebugGetRawTransactionJsonRpcResponse = JsonRpcResponse<
	'debug_getRawTransaction',
	SerializeToJson<DebugGetRawTransactionResult>,
	DebugError
>

/**
 * JSON-RPC response for `debug_getRawReceipts`
 */
export type DebugGetRawReceiptsJsonRpcResponse = JsonRpcResponse<
	'debug_getRawReceipts',
	SerializeToJson<DebugGetRawReceiptsResult>,
	DebugError
>
