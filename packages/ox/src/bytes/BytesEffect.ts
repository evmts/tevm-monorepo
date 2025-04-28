import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import { Effect, Context, Layer } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox Bytes
 */
export type BytesEffect = Bytes.Bytes

/**
 * Ox Bytes effect service interface
 */
export interface BytesEffectService {
  /**
   * Converts from Array to Bytes in an Effect
   */
  fromArrayEffect(value: readonly number[] | Uint8Array): Effect.Effect<Bytes.Bytes, never, never>

  /**
   * Converts from Boolean to Bytes in an Effect
   */
  fromBooleanEffect(
    value: boolean,
    options?: Bytes.fromBoolean.Options,
  ): Effect.Effect<Bytes.Bytes, BaseErrorEffect<Error | undefined>, never>

  /**
   * Converts from Hex to Bytes in an Effect
   */
  fromHexEffect(
    value: Hex.Hex,
    options?: Bytes.fromHex.Options,
  ): Effect.Effect<Bytes.Bytes, BaseErrorEffect<Error | undefined>, never>

  /**
   * Converts from Number to Bytes in an Effect
   */
  fromNumberEffect(
    value: number | bigint,
    options?: Bytes.fromNumber.Options,
  ): Effect.Effect<Bytes.Bytes, BaseErrorEffect<Error | undefined>, never>

  /**
   * Converts from String to Bytes in an Effect
   */
  fromStringEffect(
    value: string,
    options?: Bytes.fromString.Options,
  ): Effect.Effect<Bytes.Bytes, BaseErrorEffect<Error | undefined>, never>

  /**
   * Concatenates multiple Bytes in an Effect
   */
  concatEffect(...values: readonly Bytes.Bytes[]): Effect.Effect<Bytes.Bytes, never, never>
}

/**
 * Tag for BytesEffectService dependency injection
 */
export const BytesEffectTag = Context.Tag<BytesEffectService>('@tevm/ox/BytesEffect')

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
 * Live implementation of BytesEffectService
 */
export const BytesEffectLive: BytesEffectService = {
  fromArrayEffect: (value) => Effect.succeed(Bytes.fromArray(value)),

  fromBooleanEffect: (value, options) => 
    catchOxErrors(Effect.try(() => Bytes.fromBoolean(value, options))),

  fromHexEffect: (value, options) =>
    catchOxErrors(Effect.try(() => Bytes.fromHex(value, options))),

  fromNumberEffect: (value, options) =>
    catchOxErrors(Effect.try(() => Bytes.fromNumber(value, options))),

  fromStringEffect: (value, options) =>
    catchOxErrors(Effect.try(() => Bytes.fromString(value, options))),

  concatEffect: (...values) => Effect.succeed(Bytes.concat(...values)),
}

/**
 * Layer that provides the BytesEffectService implementation
 */
export const BytesEffectLayer = Layer.succeed(BytesEffectTag, BytesEffectLive)