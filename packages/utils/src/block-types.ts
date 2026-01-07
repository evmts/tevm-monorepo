/**
 * Block number type - represents a block number as a bigint.
 * Generic parameter allows for different representations (bigint, Hex, etc.).
 * @template TQuantity - The type used to represent the block number (default: bigint)
 * @example
 * ```typescript
 * import type { BlockNumber } from '@tevm/utils'
 * const blockNumber: BlockNumber = 12345678n
 * const hexBlockNumber: BlockNumber<`0x${string}`> = '0xbc614e'
 * ```
 */
export type BlockNumber<TQuantity = bigint> = TQuantity

/**
 * Block tag type - represents named block identifiers.
 * These are special identifiers that can be used in place of block numbers.
 *
 * - 'latest': The most recent mined block
 * - 'earliest': The genesis block (block 0)
 * - 'pending': The pending state/transactions
 * - 'safe': The most recent block that is safe from reorgs (only on PoS chains)
 * - 'finalized': The most recent finalized block (only on PoS chains)
 *
 * @example
 * ```typescript
 * import type { BlockTag } from '@tevm/utils'
 * const tag: BlockTag = 'latest'
 * ```
 */
export type BlockTag = 'latest' | 'earliest' | 'pending' | 'safe' | 'finalized'
