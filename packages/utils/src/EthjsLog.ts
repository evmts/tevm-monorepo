/**
 * EVM Log type representing an event log entry.
 * This is a native implementation replacing the import from @ethereumjs/evm.
 *
 * The tuple format is:
 * - [0] address: The contract address that emitted the log
 * - [1] topics: Array of 32-byte indexed topics (up to 4)
 * - [2] data: Non-indexed data bytes
 *
 * @example
 * ```javascript
 * import { EthjsLog } from '@tevm/utils'
 *
 * // Creating a log entry
 * const log: EthjsLog = [
 *   new Uint8Array(20),           // contract address (20 bytes)
 *   [new Uint8Array(32)],         // topics array (32 bytes each)
 *   new Uint8Array([1, 2, 3])     // data bytes
 * ]
 * ```
 */
export type EthjsLog = [address: Uint8Array, topics: Uint8Array[], data: Uint8Array]
