/**
 * Configuration options for EVM code execution profiling.
 * Controls whether detailed execution metrics are collected.
 * @example
 * ```typescript
 * import { EVMProfilerOpts } from '@tevm/vm'
 *
 * const value: EVMProfilerOpts = {
 *   enabled: true // Enable EVM profiling to collect execution metrics
 * }
 * ```
 */
export type EVMProfilerOpts = {
	enabled: boolean
	// extra options here (such as use X hardfork for gas)
}
