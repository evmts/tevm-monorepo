import type { EIP4844BlobTxReceipt } from './EIP4844BlobTxReceipt.js'
import type { PostByzantiumTxReceipt } from './PostByzantiumTxReceipt.js'
import type { PreByzantiumTxReceipt } from './PrebyzantiumTxReceipt.js'

/**
 * Union type representing all supported transaction receipt formats.
 * Includes pre-Byzantium, post-Byzantium, and EIP-4844 blob transaction receipts.
 * The receipt format varies based on the Ethereum hardfork in use.
 * @example
 * ```typescript
 * import { TxReceipt } from '@tevm/vm'
 *
 * // Example of a post-Byzantium receipt
 * const receipt: TxReceipt = {
 *   status: 1n, // Transaction succeeded
 *   cumulativeBlockGasUsed: 100000n,
 *   bitvector: new Uint8Array([]),
 *   logs: []
 * }
 * ```
 */
export type TxReceipt = PreByzantiumTxReceipt | PostByzantiumTxReceipt | EIP4844BlobTxReceipt
