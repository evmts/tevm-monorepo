import { Effect } from 'effect'
import Ox from 'ox'

// Re-export types
export type Block<
  includeTransactions extends boolean = false,
  blockTag extends Ox.Block.Tag = 'latest'
> = Ox.Block.Block<includeTransactions, blockTag>

export type Rpc<
  includeTransactions extends boolean = false,
  blockTag extends Ox.Block.Tag = 'latest'
> = Ox.Block.Rpc<includeTransactions, blockTag>

export type Hash = Ox.Block.Hash
export type Identifier = Ox.Block.Identifier
export type Number = Ox.Block.Number
export type Tag = Ox.Block.Tag

/**
 * Error thrown when converting a Block to an RPC block
 */
export class ToRpcError extends Error {
  override name = 'ToRpcError'
  _tag = 'ToRpcError'
  constructor(cause: Ox.Block.toRpc.ErrorType) {
    super('Unexpected error converting Block to RPC format with ox', {
      cause,
    })
  }
}

/**
 * Converts a Block to an RPC block
 * 
 * @param block - The Block to convert
 * @param options - Options for the conversion
 * @returns The Block converted to RPC format
 * 
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Block from '@tevm/ox/block'
 * 
 * const block: Block.Block = {
 *   hash: '0x123456',
 *   number: 1n,
 *   parentHash: '0xabcdef',
 *   timestamp: 1000n,
 *   // ... other block fields
 * }
 * 
 * const program = Block.toRpc(block)
 * const result = await Effect.runPromise(program)
 * // result contains the block in RPC format
 * ```
 */
export function toRpc<
  includeTransactions extends boolean = false,
  blockTag extends Ox.Block.Tag = 'latest'
>(
  block: Block<includeTransactions, blockTag>,
  options?: Ox.Block.toRpc.Options<includeTransactions, blockTag>,
): Effect.Effect<Ox.Block.Rpc<boolean, blockTag>, ToRpcError, never> {
  return Effect.try({
    try: () => Ox.Block.toRpc(block, options ?? {}),
    catch: (cause) => new ToRpcError(cause as Ox.Block.toRpc.ErrorType),
  })
}

/**
 * Error thrown when converting an RPC block to a Block
 */
export class FromRpcError extends Error {
  override name = 'FromRpcError'
  _tag = 'FromRpcError'
  constructor(cause: Ox.Block.fromRpc.ErrorType) {
    super('Unexpected error converting RPC block to Block format with ox', {
      cause,
    })
  }
}

/**
 * Converts an RPC block to a Block
 * 
 * @param block - The RPC block to convert or null
 * @param options - Options for the conversion
 * @returns The RPC block converted to Block format, or null if the input is null
 * 
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * import * as Block from '@tevm/ox/block'
 * 
 * // Example RPC block from an Ethereum node
 * const rpcBlock = await window.ethereum.request({
 *   method: 'eth_getBlockByNumber',
 *   params: ['latest', false],
 * })
 * 
 * const program = Block.fromRpc(rpcBlock)
 * const result = await Effect.runPromise(program)
 * // result contains the block in internal format
 * ```
 */
export function fromRpc<
  const block extends Ox.Block.Rpc | null,
  includeTransactions extends boolean = false,
  blockTag extends Ox.Block.Tag = 'latest'
>(
  block: block | Ox.Block.Rpc | null,
  options?: Ox.Block.fromRpc.Options<includeTransactions, blockTag>,
): Effect.Effect<
  block extends Ox.Block.Rpc ? Ox.Block.Block<includeTransactions, blockTag> : null,
  FromRpcError,
  never
> {
  return Effect.try({
    try: () => Ox.Block.fromRpc(block, options ?? {}),
    catch: (cause) => new FromRpcError(cause as Ox.Block.fromRpc.ErrorType),
  })
}