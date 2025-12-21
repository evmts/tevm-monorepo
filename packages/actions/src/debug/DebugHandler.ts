// TODO we should make throwOnFail get handled generically here

import type {
	DebugDumpBlockParams,
	DebugGetModifiedAccountsByHashParams,
	DebugGetModifiedAccountsByNumberParams,
	DebugGetRawBlockParams,
	DebugGetRawHeaderParams,
	DebugGetRawReceiptsParams,
	DebugGetRawTransactionParams,
	DebugStorageRangeAtParams,
	DebugTraceCallParams,
} from './DebugParams.js'
import type {
	DebugDumpBlockResult,
	DebugGetModifiedAccountsByHashResult,
	DebugGetModifiedAccountsByNumberResult,
	DebugGetRawBlockResult,
	DebugGetRawHeaderResult,
	DebugGetRawReceiptsResult,
	DebugGetRawTransactionResult,
	DebugStorageRangeAtResult,
	DebugTraceCallResult,
} from './DebugResult.js'

export type DebugTraceCallHandler = <
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer',
	TDiffMode extends boolean = boolean,
>(
	params: DebugTraceCallParams<TTracer, TDiffMode>,
) => Promise<DebugTraceCallResult<TTracer, TDiffMode>>

export type DebugGetRawBlockHandler = (params: DebugGetRawBlockParams) => Promise<DebugGetRawBlockResult>

export type DebugGetRawHeaderHandler = (params: DebugGetRawHeaderParams) => Promise<DebugGetRawHeaderResult>

export type DebugGetRawTransactionHandler = (
	params: DebugGetRawTransactionParams,
) => Promise<DebugGetRawTransactionResult>

export type DebugGetRawReceiptsHandler = (params: DebugGetRawReceiptsParams) => Promise<DebugGetRawReceiptsResult>

export type DebugDumpBlockHandler = (params: DebugDumpBlockParams) => Promise<DebugDumpBlockResult>

export type DebugGetModifiedAccountsByNumberHandler = (
	params: DebugGetModifiedAccountsByNumberParams,
) => Promise<DebugGetModifiedAccountsByNumberResult>

export type DebugGetModifiedAccountsByHashHandler = (
	params: DebugGetModifiedAccountsByHashParams,
) => Promise<DebugGetModifiedAccountsByHashResult>

export type DebugStorageRangeAtHandler = (params: DebugStorageRangeAtParams) => Promise<DebugStorageRangeAtResult>
