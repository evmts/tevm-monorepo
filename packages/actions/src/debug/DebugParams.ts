import type { BaseParams } from '../common/BaseParams.js'
import type { BlockTag, Hex, MuxTracerConfiguration } from '../common/index.js'
import type { EthCallParams } from '../eth/EthParams.js'
import type { ExactlyOne } from '../utils/ExactlyOne.js'

/**
 * Config params for trace calls
 */
export type TraceParams<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer'
		| undefined,
	TDiffMode extends boolean = boolean,
> = {
	/**
	 * The type of tracer
	 * Supported tracers: callTracer, prestateTracer, 4byteTracer, flatCallTracer, muxTracer
	 */
	readonly tracer?: TTracer
	/**
	 * A duration string of decimal numbers that overrides the default timeout of 5 seconds for JavaScript-based tracing calls. Max timeout is "10s". Valid time units are "ns", "us", "ms", "s" each with optional fraction, such as "300ms" or "2s45ms".
	 * @example "10s"
	 */
	readonly timeout?: string
	/**
	 * object to specify configurations for the tracer.
	 * For muxTracer, this specifies which tracers to run and their individual configs.
	 */
	readonly tracerConfig?: TTracer extends 'muxTracer'
		? MuxTracerConfiguration<TDiffMode>
		: {
				/**
				 * boolean Setting this to true will only trace the main (top-level) call and none of the sub-calls. This avoids extra processing for each call frame if only the top-level call info are required (useful for getting revertReason).
				 */
				// readonly onlyTopCall?: boolean
				/**
				 * boolean Setting this to true will disable storage capture. This avoids extra processing for each call frame if storage is not required.
				 */
				// readonly disableStorage?: boolean
				/**
				 *
				 */
				// readonly enableMemory?: boolean
				/**
				 * boolean Setting this to true will disable stack capture. This avoids extra processing for each call frame if stack is not required.
				 */
				// readonly disableStack?: boolean
				/**
				 * When using the prestateTracer, setting this to true will make the tracer return only the state difference between before and after execution.
				 * Default is false which returns the full state of all touched accounts.
				 */
				readonly diffMode?: TTracer extends 'prestateTracer' ? TDiffMode : never
			}
}

// debug_traceTransaction
/**
 * Params taken by `debug_traceTransaction` handler
 */
export type DebugTraceTransactionParams<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer'
		| undefined,
	TDiffMode extends boolean = boolean,
	TTTThrowOnError extends boolean = boolean,
> = BaseParams<TTTThrowOnError> &
	TraceParams<TTracer, TDiffMode> & {
		/**
		 * The transaction hash
		 */
		readonly transactionHash: Hex
	}

// debug_traceCall
/**
 * Params taken by `debug_traceCall` handler
 */
export type DebugTraceCallParams<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer'
		| undefined,
	TDiffMode extends boolean = boolean,
> = TraceParams<TTracer, TDiffMode> & EthCallParams

/**
 * Params taken by `debug_traceBlock` handler
 */
export type DebugTraceBlockParams<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer'
		| undefined,
	TDiffMode extends boolean = boolean,
> = TraceParams<TTracer, TDiffMode> &
	ExactlyOne<
		{
			/**
			 * Block number or hash or tag to trace
			 */
			// TODO: vm.blockchain.getBlockByTag actually only supports 'latest'
			readonly blockTag: Hex | Uint8Array | number | bigint | BlockTag
			/**
			 * Block number or hash or tag to trace
			 */
			readonly block: Hex | Uint8Array | number | bigint | BlockTag
			/**
			 * Block hash to trace
			 */
			readonly blockHash: Hex | Uint8Array | number | bigint
			/**
			 * Block number to trace
			 */
			readonly blockNumber: Hex | Uint8Array | number | bigint
		},
		'block' | 'blockTag' | 'blockHash' | 'blockNumber'
	>

/**
 * Params taken by `debug_traceBlockByNumber` handler
 */
export type DebugTraceBlockByNumberParams<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer'
		| undefined,
	TDiffMode extends boolean = boolean,
> = TraceParams<TTracer, TDiffMode> & {
	/**
	 * Block number to trace (can be a hex string, number, bigint, or block tag like 'latest')
	 */
	readonly blockNumber: Hex | Uint8Array | number | bigint | BlockTag
}

/**
 * Params taken by `debug_traceBlockByHash` handler
 */
export type DebugTraceBlockByHashParams<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer'
		| undefined,
	TDiffMode extends boolean = boolean,
> = TraceParams<TTracer, TDiffMode> & {
	/**
	 * Block hash to trace
	 */
	readonly blockHash: Hex | Uint8Array
}

/**
 * State filters
 */
export const debugTraceStateFilters = [
	'blockchain',
	'blockchain.blocksByNumber',
	'blockchain.initOptions',
	'evm',
	'evm.opcodes',
	'evm.precompiles',
	'evm.common',
	'evm.common.eips',
	'evm.common.hardfork',
	'evm.common.consensus',
	'node',
	'node.status',
	'node.mode',
	'node.miningConfig',
	'node.filters',
	'node.impersonatedAccount',
	'pool',
	'pool.pool',
	'pool.txsByHash',
	'pool.txsByNonce',
	'pool.txsInNonceOrder',
	'pool.txsInPool',
	'stateManager',
	'stateManager.storage',
	'stateManager.stateRoots',
] as const

/**
 * Type for state filters
 */
export type DebugTraceStateFilter = (typeof debugTraceStateFilters)[number]

/**
 * Params taken by `debug_traceState` handler
 */
export type DebugTraceStateParams<
	TStateFilters extends readonly DebugTraceStateFilter[] = readonly DebugTraceStateFilter[],
> = {
	/**
	 * Filters to apply to the state
	 */
	readonly filters?: TStateFilters
	/**
	 * Timeout for the state trace
	 */
	readonly timeout?: string
}

/**
 * Params taken by `debug_dumpBlock` handler
 */
export type DebugDumpBlockParams = {
	/**
	 * Block number, block hash, or block tag to dump state for
	 */
	readonly blockTag: Hex | Uint8Array | number | bigint | BlockTag
}

/**
 * Params taken by `debug_getModifiedAccountsByNumber` handler
 */
export type DebugGetModifiedAccountsByNumberParams = {
	/**
	 * Starting block number
	 */
	readonly startBlockNumber: Hex | Uint8Array | number | bigint
	/**
	 * Ending block number (optional, defaults to startBlockNumber + 1)
	 */
	readonly endBlockNumber?: Hex | Uint8Array | number | bigint
}

/**
 * Params taken by `debug_getModifiedAccountsByHash` handler
 */
export type DebugGetModifiedAccountsByHashParams = {
	/**
	 * Starting block hash
	 */
	readonly startBlockHash: Hex | Uint8Array
	/**
	 * Ending block hash (optional)
	 */
	readonly endBlockHash?: Hex | Uint8Array
}

/**
 * Params taken by `debug_storageRangeAt` handler
 */
export type DebugStorageRangeAtParams = {
	/**
	 * Block number, block hash, or block tag
	 */
	readonly blockTag: Hex | Uint8Array | number | bigint | BlockTag
	/**
	 * Transaction index in the block (0-indexed)
	 */
	readonly txIndex: number
	/**
	 * Contract address to get storage for
	 */
	readonly address: Hex
	/**
	 * Storage key to start from (hex string)
	 */
	readonly startKey: Hex
	/**
	 * Maximum number of storage entries to return
	 */
	readonly maxResult: number
}

/**
 * Params taken by `debug_intermediateRoots` handler
 */
export type DebugIntermediateRootsParams = {
	/**
	 * Block number, hash, or tag to get intermediate roots for
	 */
	readonly block: Hex | Uint8Array | number | bigint | BlockTag
}

/**
 * Params taken by `debug_preimage` handler
 */
export type DebugPreimageParams = {
	/**
	 * The SHA3 hash to get the preimage for
	 */
	readonly hash: Hex
}

/**
 * Params taken by `debug_traceChain` handler
 */
export type DebugTraceChainParams<
	TTracer extends 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'muxTracer' | undefined =
		| 'callTracer'
		| 'prestateTracer'
		| '4byteTracer'
		| 'flatCallTracer'
		| 'muxTracer'
		| undefined,
	TDiffMode extends boolean = boolean,
> = {
	/**
	 * Starting block number, hash, or tag
	 */
	readonly startBlock: Hex | Uint8Array | number | bigint | BlockTag
	/**
	 * Ending block number, hash, or tag
	 */
	readonly endBlock: Hex | Uint8Array | number | bigint | BlockTag
	/**
	 * Trace configuration options
	 */
	readonly traceConfig?: TraceParams<TTracer, TDiffMode>
}

/**
 * Params taken by `debug_getRawBlock` handler
 */
export type DebugGetRawBlockParams = ExactlyOne<
	{
		/**
		 * Block number to get raw block for
		 */
		readonly blockNumber: Hex | Uint8Array | number | bigint
		/**
		 * Block tag to get raw block for
		 */
		readonly blockTag: BlockTag
	},
	'blockNumber' | 'blockTag'
>

/**
 * Params taken by `debug_getRawHeader` handler
 */
export type DebugGetRawHeaderParams = ExactlyOne<
	{
		/**
		 * Block number to get raw header for
		 */
		readonly blockNumber: Hex | Uint8Array | number | bigint
		/**
		 * Block tag to get raw header for
		 */
		readonly blockTag: BlockTag
	},
	'blockNumber' | 'blockTag'
>

/**
 * Params taken by `debug_getRawTransaction` handler
 */
export type DebugGetRawTransactionParams = {
	/**
	 * The transaction hash
	 */
	readonly hash: Hex
}

/**
 * Params taken by `debug_getRawReceipts` handler
 */
export type DebugGetRawReceiptsParams = ExactlyOne<
	{
		/**
		 * Block number to get raw receipts for
		 */
		readonly blockNumber: Hex | Uint8Array | number | bigint
		/**
		 * Block tag to get raw receipts for
		 */
		readonly blockTag: BlockTag
	},
	'blockNumber' | 'blockTag'
>
