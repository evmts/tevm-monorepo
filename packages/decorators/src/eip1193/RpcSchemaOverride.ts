// this file is adapted from viem
// see it here https://github.com/wevm/viem/blob/main/src/types/eip1193.ts
// Copied from viem commit a098c98231d47ccac9bda1a944880b034020a1b5
// We copy it here for easier developer experience internally and also
// to lock in these types independent of viem potentially making changes

import type { RpcSchema } from './RpcSchema.js'

/**
 * Type for overriding parameters and return types of existing JSON-RPC methods.
 * Used to modify or extend the behavior of standard RPC methods in a type-safe way.
 * @example
 * ```typescript
 * import { RpcSchemaOverride } from '@tevm/decorators'
 * import { createTevmNode } from 'tevm'
 * import { requestEip1193 } from '@tevm/decorators'
 *
 * // Define custom parameter and return types for a method
 * type CustomGetBlockOverride = RpcSchemaOverride & {
 *   Parameters: [blockNumber: string, includeTransactions: boolean, includeOffchainData?: boolean]
 *   ReturnType: {
 *     number: string
 *     hash: string
 *     parentHash: string
 *     // ... other standard fields
 *     customData?: Record<string, any> // Extended field
 *   }
 * }
 *
 * // The override can be used with the standard method name
 * const customMethod = {
 *   Method: 'eth_getBlockByNumber',
 *   ...customOverride
 * }
 * ```
 */
export type RpcSchemaOverride = Omit<RpcSchema[number], 'Method'>
