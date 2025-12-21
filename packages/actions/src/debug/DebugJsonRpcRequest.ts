import type { JsonRpcRequest } from '@tevm/jsonrpc'
import type { SerializeToJson } from '../utils/SerializeToJson.js'
import type {
	DebugDumpBlockParams,
	DebugGetModifiedAccountsByHashParams,
	DebugGetModifiedAccountsByNumberParams,
	DebugGetRawBlockParams,
	DebugGetRawHeaderParams,
	DebugGetRawReceiptsParams,
	DebugGetRawTransactionParams,
	DebugIntermediateRootsParams,
	DebugPreimageParams,
	DebugStorageRangeAtParams,
	DebugTraceBlockByHashParams,
	DebugTraceBlockByNumberParams,
	DebugTraceBlockParams,
	DebugTraceCallParams,
	DebugTraceChainParams,
	DebugTraceStateFilter,
	DebugTraceStateParams,
	DebugTraceTransactionParams,
} from './DebugParams.js'

export type DebugJsonRpcRequest =
	| DebugTraceTransactionJsonRpcRequest
	| DebugTraceCallJsonRpcRequest
	| DebugTraceBlockJsonRpcRequest
	| DebugTraceBlockByNumberJsonRpcRequest
	| DebugTraceBlockByHashJsonRpcRequest
	| DebugTraceStateJsonRpcRequest
	| DebugDumpBlockJsonRpcRequest
	| DebugGetModifiedAccountsByNumberJsonRpcRequest
	| DebugGetModifiedAccountsByHashJsonRpcRequest
	| DebugStorageRangeAtJsonRpcRequest
	| DebugIntermediateRootsJsonRpcRequest
	| DebugPreimageJsonRpcRequest
	| DebugTraceChainJsonRpcRequest
	| DebugGetRawBlockJsonRpcRequest
	| DebugGetRawHeaderJsonRpcRequest
	| DebugGetRawTransactionJsonRpcRequest
	| DebugGetRawReceiptsJsonRpcRequest

/**
 * JSON-RPC request for `debug_traceTransaction` method
 */
export type DebugTraceTransactionJsonRpcRequest<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer'
		| undefined,
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
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer'
		| undefined,
	TDiffMode extends boolean = boolean,
> = JsonRpcRequest<'debug_traceCall', [SerializeToJson<DebugTraceCallParams<TTracer, TDiffMode>>]>

/**
 * JSON-RPC request for `debug_traceBlock`
 */
export type DebugTraceBlockJsonRpcRequest<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer'
		| undefined,
	TDiffMode extends boolean = boolean,
> = JsonRpcRequest<'debug_traceBlock', [SerializeToJson<DebugTraceBlockParams<TTracer, TDiffMode>>]>

/**
 * JSON-RPC request for `debug_traceBlockByNumber` method
 *
 * This method traces all transactions in a block specified by block number.
 * The first parameter is the block number (hex string, number, bigint, or block tag like 'latest').
 * The second parameter is an optional tracer configuration object.
 */
export type DebugTraceBlockByNumberJsonRpcRequest<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer'
		| undefined,
	TDiffMode extends boolean = boolean,
> = JsonRpcRequest<
	'debug_traceBlockByNumber',
	[
		SerializeToJson<DebugTraceBlockByNumberParams<TTracer, TDiffMode>['blockNumber']>,
		SerializeToJson<Omit<DebugTraceBlockByNumberParams<TTracer, TDiffMode>, 'blockNumber'>>?,
	]
>

/**
 * JSON-RPC request for `debug_traceBlockByHash` method
 *
 * This method traces all transactions in a block specified by block hash.
 * The first parameter is the block hash (hex string).
 * The second parameter is an optional tracer configuration object.
 */
export type DebugTraceBlockByHashJsonRpcRequest<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer'
		| undefined,
	TDiffMode extends boolean = boolean,
> = JsonRpcRequest<
	'debug_traceBlockByHash',
	[
		SerializeToJson<DebugTraceBlockByHashParams<TTracer, TDiffMode>['blockHash']>,
		SerializeToJson<Omit<DebugTraceBlockByHashParams<TTracer, TDiffMode>, 'blockHash'>>?,
	]
>

/**
 * JSON-RPC request for `debug_traceState`
 */
export type DebugTraceStateJsonRpcRequest<
	TStateFilters extends readonly DebugTraceStateFilter[] = readonly DebugTraceStateFilter[],
> = JsonRpcRequest<'debug_traceState', [SerializeToJson<DebugTraceStateParams<TStateFilters>>]>

/**
 * JSON-RPC request for `debug_dumpBlock`
 */
export type DebugDumpBlockJsonRpcRequest = JsonRpcRequest<'debug_dumpBlock', [SerializeToJson<DebugDumpBlockParams>]>

/**
 * JSON-RPC request for `debug_getModifiedAccountsByNumber`
 */
export type DebugGetModifiedAccountsByNumberJsonRpcRequest = JsonRpcRequest<
	'debug_getModifiedAccountsByNumber',
	[SerializeToJson<DebugGetModifiedAccountsByNumberParams>]
>

/**
 * JSON-RPC request for `debug_getModifiedAccountsByHash`
 */
export type DebugGetModifiedAccountsByHashJsonRpcRequest = JsonRpcRequest<
	'debug_getModifiedAccountsByHash',
	[SerializeToJson<DebugGetModifiedAccountsByHashParams>]
>

/**
 * JSON-RPC request for `debug_storageRangeAt`
 */
export type DebugStorageRangeAtJsonRpcRequest = JsonRpcRequest<
	'debug_storageRangeAt',
	[SerializeToJson<DebugStorageRangeAtParams>]
>

/**
 * JSON-RPC request for `debug_intermediateRoots`
 */
export type DebugIntermediateRootsJsonRpcRequest = JsonRpcRequest<
	'debug_intermediateRoots',
	[SerializeToJson<DebugIntermediateRootsParams['block']>]
>

/**
 * JSON-RPC request for `debug_preimage`
 */
export type DebugPreimageJsonRpcRequest = JsonRpcRequest<
	'debug_preimage',
	[SerializeToJson<DebugPreimageParams['hash']>]
>

/**
 * JSON-RPC request for `debug_traceChain`
 */
export type DebugTraceChainJsonRpcRequest<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer'
		| undefined,
	TDiffMode extends boolean = boolean,
> = JsonRpcRequest<
	'debug_traceChain',
	[
		SerializeToJson<DebugTraceChainParams<TTracer, TDiffMode>['startBlock']>,
		SerializeToJson<DebugTraceChainParams<TTracer, TDiffMode>['endBlock']>,
		SerializeToJson<DebugTraceChainParams<TTracer, TDiffMode>['traceConfig']>?,
	]
>

/**
 * JSON-RPC request for `debug_getRawBlock`
 */
export type DebugGetRawBlockJsonRpcRequest = JsonRpcRequest<
	'debug_getRawBlock',
	[SerializeToJson<DebugGetRawBlockParams['blockNumber'] | DebugGetRawBlockParams['blockTag']>?]
>

/**
 * JSON-RPC request for `debug_getRawHeader`
 */
export type DebugGetRawHeaderJsonRpcRequest = JsonRpcRequest<
	'debug_getRawHeader',
	[SerializeToJson<DebugGetRawHeaderParams['blockNumber'] | DebugGetRawHeaderParams['blockTag']>?]
>

/**
 * JSON-RPC request for `debug_getRawTransaction`
 */
export type DebugGetRawTransactionJsonRpcRequest = JsonRpcRequest<
	'debug_getRawTransaction',
	[SerializeToJson<DebugGetRawTransactionParams['hash']>]
>

/**
 * JSON-RPC request for `debug_getRawReceipts`
 */
export type DebugGetRawReceiptsJsonRpcRequest = JsonRpcRequest<
	'debug_getRawReceipts',
	[SerializeToJson<DebugGetRawReceiptsParams['blockNumber'] | DebugGetRawReceiptsParams['blockTag']>?]
>
