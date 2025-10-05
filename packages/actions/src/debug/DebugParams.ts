import type { BaseParams } from '../common/BaseParams.js'
import type { BlockTag, Hex, MuxTracerConfig } from '../common/index.js'
import type { EthCallParams } from '../eth/EthParams.js'
import type { ExactlyOne } from '../utils/ExactlyOne.js'

/**
 * Config params for trace calls
 */
export type TraceParams<
	TTracer extends 'callTracer' | 'prestateTracer' | 'muxTracer' | undefined = 'callTracer' | 'prestateTracer' | 'muxTracer' | undefined,
	TDiffMode extends boolean = boolean,
	TMuxConfig extends MuxTracerConfig = MuxTracerConfig,
> = {
	/**
	 * The type of tracer
	 * Supported tracers: callTracer, prestateTracer, muxTracer
	 */
	readonly tracer?: TTracer
	/**
	 * A duration string of decimal numbers that overrides the default timeout of 5 seconds for JavaScript-based tracing calls. Max timeout is "10s". Valid time units are "ns", "us", "ms", "s" each with optional fraction, such as "300ms" or "2s45ms".
	 * @example "10s"
	 */
	readonly timeout?: string
	/**
	 * object to specify configurations for the tracer
	 */
	readonly tracerConfig?: TTracer extends 'muxTracer'
		? TMuxConfig
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
	TTracer extends 'callTracer' | 'prestateTracer' | 'muxTracer' | undefined = 'callTracer' | 'prestateTracer' | 'muxTracer' | undefined,
	TDiffMode extends boolean = boolean,
	TMuxConfig extends MuxTracerConfig = MuxTracerConfig,
	TTTThrowOnError extends boolean = boolean,
> = BaseParams<TTTThrowOnError> &
	TraceParams<TTracer, TDiffMode, TMuxConfig> & {
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
	TTracer extends 'callTracer' | 'prestateTracer' | 'muxTracer' | undefined = 'callTracer' | 'prestateTracer' | 'muxTracer' | undefined,
	TDiffMode extends boolean = boolean,
	TMuxConfig extends MuxTracerConfig = MuxTracerConfig,
> = TraceParams<TTracer, TDiffMode, TMuxConfig> & EthCallParams

/**
 * Params taken by `debug_traceBlock` handler
 */
export type DebugTraceBlockParams<
	TTracer extends 'callTracer' | 'prestateTracer' | 'muxTracer' | undefined = 'callTracer' | 'prestateTracer' | 'muxTracer' | undefined,
	TDiffMode extends boolean = boolean,
	TMuxConfig extends MuxTracerConfig = MuxTracerConfig,
> = TraceParams<TTracer, TDiffMode, TMuxConfig> &
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
