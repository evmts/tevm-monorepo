import * as Block from 'ox/core/Block'
import { Effect, Context, Layer } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

// Re-export types
export type {
  Block as BlockType,
  Hash,
  Identifier,
  Number,
  Rpc,
  Tag
} from 'ox/core/Block'

/**
 * Interface for BlockEffect service
 */
export interface BlockEffectService {
  /**
   * Converts a Block to an Rpc block in an Effect
   */
  toRpcEffect<
    includeTransactions extends boolean = false,
    blockTag extends Block.Tag = 'latest',
  >(
    block: Block.Block<includeTransactions, blockTag>,
    options?: Block.toRpc.Options<includeTransactions, blockTag>
  ): Effect.Effect<Block.Rpc<boolean, blockTag>, BaseErrorEffect<Error | undefined>, never>

  /**
   * Converts an Rpc block to a Block in an Effect
   */
  fromRpcEffect<
    const block extends Block.Rpc | null,
    includeTransactions extends boolean = false,
    blockTag extends Block.Tag = 'latest',
  >(
    block: block | Block.Rpc | null,
    options?: Block.fromRpc.Options<includeTransactions, blockTag>
  ): Effect.Effect<
    block extends Block.Rpc ? Block.Block<includeTransactions, blockTag> : null,
    BaseErrorEffect<Error | undefined>,
    never
  >
}

/**
 * Tag for BlockEffectService dependency injection
 */
export const BlockEffectTag = Context.Tag<BlockEffectService>('@tevm/ox/BlockEffect')

/**
 * Catch Ox errors and convert them to BaseErrorEffect
 */
function catchOxErrors<A>(effect: Effect.Effect<A, unknown, never>): Effect.Effect<A, BaseErrorEffect<Error | undefined>, never> {
  return Effect.catchAll(effect, (error) => {
    if (error instanceof Error) {
      return Effect.fail(new BaseErrorEffect(error.message, { cause: error }))
    }
    return Effect.fail(new BaseErrorEffect('Unknown error', { cause: error instanceof Error ? error : undefined }))
  })
}

/**
 * Live implementation of BlockEffectService
 */
export const BlockEffectLive: BlockEffectService = {
  toRpcEffect: (block, options) =>
    catchOxErrors(Effect.try(() => Block.toRpc(block, options || {}))),

  fromRpcEffect: (block, options) =>
    catchOxErrors(Effect.try(() => Block.fromRpc(block, options || {})))
}

/**
 * Layer that provides the BlockEffectService implementation
 */
export const BlockEffectLayer = Layer.succeed(BlockEffectTag, BlockEffectLive)