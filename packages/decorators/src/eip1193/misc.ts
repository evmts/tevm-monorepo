// this file is adapted from viem
// see it here https://github.com/wevm/viem/blob/main/src/types/eip1193.ts
// Copied from viem commit a098c98231d47ccac9bda1a944880b034020a1b5
// We copy it here for easier developer experience internally and also
// to lock in these types independent of viem potentially making changes
// import type { Address } from 'abitype'
import type { Hex } from '@tevm/utils'

/**
 * Ethereum hash value represented as a hexadecimal string.
 * Used for block hashes, transaction hashes, state roots, etc.
 * @example
 * ```typescript
 * import { Hash } from '@tevm/decorators'
 *
 * const blockHash: Hash = '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'
 * const txHash: Hash = '0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060'
 * ```
 */
export type Hash = `0x${string}`
/**
 * Event log topic for Ethereum event filtering.
 * Can be a single topic, array of alternative topics, or null for wildcard matching.
 * @example
 * ```typescript
 * import { LogTopic } from '@tevm/decorators'
 *
 * // Match specific topic
 * const singleTopic: LogTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
 *
 * // Match any of several topics (OR condition)
 * const multipleTopic: LogTopic = [
 *   '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer
 *   '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'  // Approval
 * ]
 *
 * // Wildcard - match any topic
 * const wildcardTopic: LogTopic = null
 * ```
 */
export type LogTopic = Hex | Hex[] | null
