// this file is adapted from viem
// see it here https://github.com/wevm/viem/blob/main/src/types/eip1193.ts
// Copied from viem commit a098c98231d47ccac9bda1a944880b034020a1b5
// We copy it here for easier developer experience internally and also
// to lock in these types independent of viem potentially making changes
// import type { Address } from 'abitype'
import type { Hex } from '@tevm/utils'

/**
 * [Description of what this type represents]
 * @example
 * ```typescript
 * import { Hash } from '[package-path]'
 *
 * const value: Hash = {
 *   // Initialize properties
 * }
 * ```
 */
export type Hash = `0x${string}`
/**
 * [Description of what this type represents]
 * @example
 * ```typescript
 * import { LogTopic } from '[package-path]'
 *
 * const value: LogTopic = {
 *   // Initialize properties
 * }
 * ```
 */
export type LogTopic = Hex | Hex[] | null
