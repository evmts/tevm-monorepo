import type { CallTraceResult } from './CallTraceResult.js'
import type { PrestateTraceResult } from './PrestateTraceResult.js'

/**
 * Configuration for muxTracer - specifies which tracers to run simultaneously
 */
export type MuxTracerConfig<TDiffMode extends boolean = boolean> = {
	/**
	 * Configuration for prestate tracer
	 */
	readonly prestate?: {
		/**
		 * When using the prestateTracer, setting this to true will make the tracer return only the state difference between before and after execution.
		 * Default is false which returns the full state of all touched accounts.
		 */
		readonly diffMode?: TDiffMode
	}
	/**
	 * Configuration for call tracer
	 */
	readonly call?: {}
}

/**
 * Result from `debug_*` with `muxTracer`
 * Returns combined results from all requested tracers
 */
export type MuxTraceResult<TMuxConfig extends MuxTracerConfig = MuxTracerConfig> = {
	/**
	 * Prestate tracer result (if requested)
	 */
	readonly prestate?: TMuxConfig['prestate'] extends { diffMode: infer TDiffMode }
		? TDiffMode extends boolean
			? PrestateTraceResult<TDiffMode>
			: PrestateTraceResult<false>
		: TMuxConfig['prestate'] extends {}
			? PrestateTraceResult<false>
			: never
	/**
	 * Call tracer result (if requested)
	 */
	readonly call?: TMuxConfig['call'] extends {} ? CallTraceResult : never
}