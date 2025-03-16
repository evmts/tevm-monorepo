import type { EIP4844BlobTxReceipt } from './EIP4844BlobTxReceipt.js'
import type { PostByzantiumTxReceipt } from './PostByzantiumTxReceipt.js'
import type { PreByzantiumTxReceipt } from './PrebyzantiumTxReceipt.js'

/**
 * [Description of what this type represents]
 * @example
 * ```typescript
 * import { TxReceipt } from '[package-path]'
 * 
 * const value: TxReceipt = {
 *   // Initialize properties
 * }
 * ```
 */
export type TxReceipt = PreByzantiumTxReceipt | PostByzantiumTxReceipt | EIP4844BlobTxReceipt
