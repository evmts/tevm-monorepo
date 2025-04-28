import * as Json from 'ox/core/Json'
import { Effect, Context, Layer } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Interface for JsonEffect service
 */
export interface JsonEffectService {
  /**
   * Parses a JSON string with support for bigint in an Effect
   */
  parseEffect(
    string: string,
    reviver?: ((this: any, key: string, value: any) => any) | undefined,
  ): Effect.Effect<any, BaseErrorEffect<Error | undefined>, never>

  /**
   * Stringifies a value to JSON with support for bigint in an Effect
   */
  stringifyEffect(
    value: any,
    replacer?: ((this: any, key: string, value: any) => any) | null | undefined,
    space?: string | number | undefined,
  ): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for JsonEffectService dependency injection
 */
export const JsonEffectTag = Context.Tag<JsonEffectService>('@tevm/ox/JsonEffect')

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
 * Live implementation of JsonEffectService
 */
export const JsonEffectLive: JsonEffectService = {
  parseEffect: (string, reviver) =>
    catchOxErrors(Effect.try(() => Json.parse(string, reviver))),

  stringifyEffect: (value, replacer, space) =>
    catchOxErrors(Effect.try(() => Json.stringify(value, replacer, space))),
}

/**
 * Layer that provides the JsonEffectService implementation
 */
export const JsonEffectLayer = Layer.succeed(JsonEffectTag, JsonEffectLive)