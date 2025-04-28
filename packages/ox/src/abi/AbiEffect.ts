import * as Abi from 'ox/abi'
import { Effect, Context, Layer } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox Abi
 */
export type AbiEffect = Abi.Abi

/**
 * Ox Abi effect service interface
 */
export interface AbiEffectService {
  /**
   * Formats an ABI into a Human Readable ABI in an Effect
   */
  formatEffect(
    abi: Abi.Abi | readonly unknown[],
  ): Effect.Effect<readonly string[], BaseErrorEffect<Error | undefined>, never>

  /**
   * Parses a JSON ABI or Human Readable ABI into a typed ABI in an Effect
   */
  fromEffect(
    abi: Abi.Abi | readonly string[],
  ): Effect.Effect<Abi.Abi, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for AbiEffectService dependency injection
 */
export const AbiEffectTag = Context.Tag<AbiEffectService>('@tevm/ox/AbiEffect')

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
 * Live implementation of AbiEffectService
 */
export const AbiEffectLive: AbiEffectService = {
  formatEffect: (abi) =>
    catchOxErrors(Effect.try(() => Abi.format(abi))),
  
  fromEffect: (abi) =>
    catchOxErrors(Effect.try(() => Abi.from(abi))),
}

/**
 * Layer that provides the AbiEffectService implementation
 */
export const AbiEffectLayer = Layer.succeed(AbiEffectTag, AbiEffectLive)