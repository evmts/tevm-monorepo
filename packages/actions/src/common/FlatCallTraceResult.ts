import type { Address } from './Address.js'
import type { Hex } from './Hex.js'

/**
 * Represents a single call in the flat call trace
 */
export type FlatCallTraceCall = {
	/**
	 * The action that was performed
	 */
	action: {
		/**
		 * The type of call
		 */
		callType: 'call' | 'delegatecall' | 'staticcall' | 'create' | 'create2'
		/**
		 * The address of the caller
		 */
		from: Address
		/**
		 * The address being called (undefined for creates)
		 */
		to?: Address
		/**
		 * The gas limit for this call
		 */
		gas: Hex
		/**
		 * The input data for this call
		 */
		input: Hex
		/**
		 * The value being sent (undefined for staticcall/delegatecall)
		 */
		value?: Hex
		/**
		 * The init code (for creates)
		 */
		init?: Hex
	}
	/**
	 * The result of the call execution (undefined if call failed)
	 */
	result?: {
		/**
		 * The amount of gas used by this call
		 */
		gasUsed: Hex
		/**
		 * The output data returned by this call
		 */
		output: Hex
		/**
		 * The address of the created contract (for creates)
		 */
		address?: Address
		/**
		 * The deployed code (for creates)
		 */
		code?: Hex
	}
	/**
	 * Error message if the call failed
	 */
	error?: string
	/**
	 * The trace address indicating the position in the original call tree
	 * Empty array [] for the root call, [0] for first subcall, [0, 1] for second subcall of first subcall, etc.
	 */
	traceAddress: number[]
	/**
	 * The number of subtraces (direct children) of this call
	 */
	subtraces: number
	/**
	 * The type of trace entry
	 */
	type: 'call' | 'create'
}

/**
 * Result from debug_* with flatCallTracer
 * Returns a flat array of all calls in execution order
 */
export type FlatCallTraceResult = FlatCallTraceCall[]