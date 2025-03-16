import { type BlockTag } from '@tevm/utils'
import { type EIP1193RequestFn, type Transport } from 'viem'

/**
 * [Description of what this interface represents]
 * @example
 * ```typescript
 * import { ForkOptions } from '[package-path]'
 * 
 * const value: ForkOptions = {
 *   // Initialize properties
 * }
 * ```
 */
export interface ForkOptions {
	transport: { request: EIP1193RequestFn } | Transport
	blockTag?: BlockTag | bigint
}
