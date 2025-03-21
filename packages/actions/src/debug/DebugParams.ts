import type { BaseParams } from '../common/BaseParams.js'
import type { Hex } from '../common/index.js'
import type { EthCallParams } from '../eth/EthParams.js'

/**
 * Config params for trace calls
 */
export type TraceParams = {
	/**
	 * The type of tracer
	 * Supported values are 'callTracer' and 'prestateTracer'
	 */
	readonly tracer: 'callTracer' | 'prestateTracer'
	/**
	 * A duration string of decimal numbers that overrides the default timeout of 5 seconds for JavaScript-based tracing calls. Max timeout is "10s". Valid time units are "ns", "us", "ms", "s" each with optional fraction, such as "300ms" or "2s45ms".
	 * @example "10s"
	 */
	readonly timeout?: string
	/**
	 * object to specify configurations for the tracer
	 */
	readonly tracerConfig?: {
		/**
		 * boolean Setting this to true will only trace the main (top-level) call and none of the sub-calls. This avoids extra processing for each call frame if only the top-level call info are required (useful for getting revertReason).
		 */
		readonly onlyTopCall?: boolean
		/**
		 * boolean Setting this to true will disable storage capture. This avoids extra processing for each call frame if storage is not required.
		 */
		readonly disableStorage?: boolean
		/**
		 * boolean Setting this to true will enable memory capture.
		 */
		readonly enableMemory?: boolean
		/**
		 * boolean Setting this to true will disable stack capture. This avoids extra processing for each call frame if stack is not required.
		 */
		readonly disableStack?: boolean
		/**
		 * boolean For prestateTracer only - Setting this to true will enable diff mode, which only returns the state changes between pre and post states.
		 */
		readonly diffMode?: boolean
	}
}

// debug_traceTransaction
/**
 * Params taken by `debug_traceTransaction` handler
 */
export type DebugTraceTransactionParams<TThrowOnError extends boolean = boolean> = BaseParams<TThrowOnError> &
	TraceParams & {
		/**
		 * The transaction hash
		 */
		readonly transactionHash: Hex
	}

// debug_traceCall
/**
 * Params taken by `debug_traceCall` handler
 */
export type DebugTraceCallParams = TraceParams & EthCallParams
