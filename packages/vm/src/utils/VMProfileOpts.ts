/**
 * Configuration options for VM profiling and performance reporting.
 * Controls when and how profiling data is reported during VM execution.
 * @example
 * ```typescript
 * import { VMProfilerOpts } from '@tevm/vm'
 *
 * const value: VMProfilerOpts = {
 *   reportAfterTx: true,    // Generate reports after each transaction
 *   reportAfterBlock: false // Don't generate reports after each block
 * }
 * ```
 */
export type VMProfilerOpts = {
	//evmProfilerOpts: EVMProfilerOpts
	reportAfterTx?: boolean
	reportAfterBlock?: boolean
}
