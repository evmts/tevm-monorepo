import * as AbiParameters from 'ox/abi/AbiParameters'
import { Effect, Context, Layer } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox AbiParameters types
 */
export type {
  Format,
  WithName
} from 'ox/abi/AbiParameters'

/**
 * Ox AbiParameters effect service interface
 */
export interface AbiParametersEffectService {
  /**
   * Parses parameters string to ABI parameters in an Effect
   */
  parseEffect(params: string): Effect.Effect<AbiParameters.Format, BaseErrorEffect<Error | undefined>, never>

  /**
   * Formats ABI parameters to string in an Effect
   */
  formatEffect(params: readonly AbiParameters.Format[]): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for AbiParametersEffectService dependency injection
 */
export const AbiParametersEffectTag = Context.Tag<AbiParametersEffectService>('@tevm/ox/AbiParametersEffect')

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
 * Live implementation of AbiParametersEffectService
 */
export const AbiParametersEffectLive: AbiParametersEffectService = {
  parseEffect: (params) =>
    catchOxErrors(Effect.try(() => AbiParameters.parse(params))),

  formatEffect: (params) =>
    catchOxErrors(Effect.try(() => AbiParameters.format(params)))
}

/**
 * Layer that provides the AbiParametersEffectService implementation
 */
export const AbiParametersEffectLayer = Layer.succeed(AbiParametersEffectTag, AbiParametersEffectLive)