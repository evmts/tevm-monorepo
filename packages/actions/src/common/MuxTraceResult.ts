import type { CallTraceResult } from './CallTraceResult.js'
import type { FlatCallTraceResult } from './FlatCallTraceResult.js'
import type { FourbyteTraceResult } from './FourbyteTraceResult.js'
import type { PrestateTraceResult } from './PrestateTraceResult.js'
import type { TraceResult } from './TraceResult.js'

/**
 * Supported tracer types for muxTracer
 */
export type MuxTracerType = 'callTracer' | 'prestateTracer' | '4byteTracer' | 'flatCallTracer' | 'default'

/**
 * Maps tracer type to its result type
 */
export type TracerResultMap<TDiffMode extends boolean = boolean> = {
	callTracer: CallTraceResult
	prestateTracer: PrestateTraceResult<TDiffMode>
	'4byteTracer': FourbyteTraceResult
	flatCallTracer: FlatCallTraceResult
	default: TraceResult
}

/**
 * Configuration for a single tracer in muxTracer
 */
export type MuxTracerConfig<TDiffMode extends boolean = boolean> =
	| { tracer: 'callTracer' }
	| { tracer: 'prestateTracer'; config?: { diffMode?: TDiffMode } }
	| { tracer: '4byteTracer' }
	| { tracer: 'flatCallTracer' }
	| { tracer: 'default' }

/**
 * Result from `debug_*` with `muxTracer`
 *
 * The muxTracer multiplexes multiple tracers and returns their results in a single object.
 * Each key in the result corresponds to a tracer name, and the value is that tracer's output.
 *
 * @example
 * ```typescript
 * // Request with muxTracer
 * const result = await client.request({
 *   method: 'debug_traceCall',
 *   params: [{
 *     from: '0x...',
 *     to: '0x...',
 *     data: '0x...'
 *   }, 'latest', {
 *     tracer: 'muxTracer',
 *     tracerConfig: {
 *       callTracer: {},
 *       '4byteTracer': {},
 *       prestateTracer: { diffMode: true }
 *     }
 *   }]
 * })
 *
 * // Result structure
 * {
 *   callTracer: { type: 'CALL', from: '0x...', to: '0x...', ... },
 *   '4byteTracer': { '0x12345678-32': 1, ... },
 *   prestateTracer: { pre: {...}, post: {...} }
 * }
 * ```
 */
export type MuxTraceResult<
	TTracers extends readonly MuxTracerType[] = readonly MuxTracerType[],
	TDiffMode extends boolean = boolean,
> = {
	[K in TTracers[number]]?: K extends keyof TracerResultMap<TDiffMode> ? TracerResultMap<TDiffMode>[K] : never
}

/**
 * Configuration for muxTracer
 * Each key is a tracer name and the value is that tracer's specific config
 */
export type MuxTracerConfiguration<TDiffMode extends boolean = boolean> = {
	callTracer?: Record<string, never> | {}
	prestateTracer?: { diffMode?: TDiffMode }
	'4byteTracer'?: Record<string, never> | {}
	flatCallTracer?: Record<string, never> | {}
	default?: Record<string, never> | {}
}
