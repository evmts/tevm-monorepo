import type { Hex } from './Hex.js'

/**
 * Result from `debug_*` with `4byteTracer`
 * Returns a mapping of selector-calldata_size keys to their call counts.
 *
 * The keys are in the format "0x{selector}-{calldata_size}" where:
 * - selector: 4-byte function selector (e.g., "0x27dc297e")
 * - calldata_size: size of call data excluding the 4-byte selector
 *
 * @example
 * ```json
 * {
 *   "0x27dc297e-128": 1,
 *   "0x38cc4831-0": 2,
 *   "0x524f3889-96": 1,
 *   "0xadf59f99-288": 1,
 *   "0xc281d19e-0": 1
 * }
 * ```
 */
export type FourbyteTraceResult = {
	readonly [selectorAndSize: `${Hex}-${number}`]: number
}
