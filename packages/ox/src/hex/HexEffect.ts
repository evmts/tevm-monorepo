import * as Hex from 'ox/core/Hex'
import * as Bytes from 'ox/core/Bytes'
import { Effect, Context, Layer } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox Hex
 */
export type HexEffect = Hex.Hex

/**
 * Ox Hex effect service interface
 */
export interface HexEffectService {
  /**
   * Asserts if the given value is Hex in an Effect
   */
  assertEffect(
    value: unknown,
    options?: Hex.assert.Options,
  ): Effect.Effect<void, BaseErrorEffect<Error | undefined>, never>

  /**
   * Concatenates two or more Hex values in an Effect
   */
  concatEffect(
    ...values: readonly Hex.Hex[]
  ): Effect.Effect<Hex.Hex, never, never>

  /**
   * Converts from Bytes to Hex in an Effect
   */
  fromBytesEffect(
    value: Bytes.Bytes,
    options?: Hex.fromBytes.Options,
  ): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

  /**
   * Converts from Boolean to Hex in an Effect
   */
  fromBooleanEffect(
    value: boolean,
    options?: Hex.fromBoolean.Options,
  ): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

  /**
   * Converts from Number to Hex in an Effect
   */
  fromNumberEffect(
    value: number | bigint,
    options?: Hex.fromNumber.Options,
  ): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

  /**
   * Converts from String to Hex in an Effect
   */
  fromStringEffect(
    value: string,
    options?: Hex.fromString.Options,
  ): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>
  
  /**
   * Checks if two Hex values are equal in an Effect
   */
  isEqualEffect(
    hexA: Hex.Hex,
    hexB: Hex.Hex,
  ): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never>

  /**
   * Pads a Hex value to the left in an Effect
   */
  padLeftEffect(
    value: Hex.Hex,
    size?: number,
  ): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

  /**
   * Pads a Hex value to the right in an Effect
   */
  padRightEffect(
    value: Hex.Hex,
    size?: number,
  ): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

  /**
   * Creates a random Hex value in an Effect
   */
  randomEffect(
    length: number,
  ): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

  /**
   * Gets the size of a Hex value in an Effect
   */
  sizeEffect(
    value: Hex.Hex,
  ): Effect.Effect<number, never, never>

  /**
   * Converts from Hex to BigInt in an Effect
   */
  toBigIntEffect(
    hex: Hex.Hex,
    options?: Hex.toBigInt.Options,
  ): Effect.Effect<bigint, BaseErrorEffect<Error | undefined>, never>

  /**
   * Converts from Hex to Boolean in an Effect
   */
  toBooleanEffect(
    hex: Hex.Hex,
    options?: Hex.toBoolean.Options,
  ): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never>

  /**
   * Converts from Hex to Bytes in an Effect
   */
  toBytesEffect(
    hex: Hex.Hex,
    options?: Hex.toBytes.Options,
  ): Effect.Effect<Bytes.Bytes, BaseErrorEffect<Error | undefined>, never>

  /**
   * Converts from Hex to Number in an Effect
   */
  toNumberEffect(
    hex: Hex.Hex,
    options?: Hex.toNumber.Options,
  ): Effect.Effect<number, BaseErrorEffect<Error | undefined>, never>

  /**
   * Converts from Hex to String in an Effect
   */
  toStringEffect(
    hex: Hex.Hex,
    options?: Hex.toString.Options,
  ): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for HexEffectService dependency injection
 */
export const HexEffectTag = Context.Tag<HexEffectService>('@tevm/ox/HexEffect')

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
 * Live implementation of HexEffectService
 */
export const HexEffectLive: HexEffectService = {
  assertEffect: (value, options) =>
    catchOxErrors(Effect.try(() => { Hex.assert(value, options) })),

  concatEffect: (...values) => 
    Effect.succeed(Hex.concat(...values)),

  fromBytesEffect: (value, options) =>
    catchOxErrors(Effect.try(() => Hex.fromBytes(value, options))),

  fromBooleanEffect: (value, options) =>
    catchOxErrors(Effect.try(() => Hex.fromBoolean(value, options))),

  fromNumberEffect: (value, options) =>
    catchOxErrors(Effect.try(() => Hex.fromNumber(value, options))),

  fromStringEffect: (value, options) =>
    catchOxErrors(Effect.try(() => Hex.fromString(value, options))),

  isEqualEffect: (hexA, hexB) =>
    catchOxErrors(Effect.try(() => Hex.isEqual(hexA, hexB))),

  padLeftEffect: (value, size) =>
    catchOxErrors(Effect.try(() => Hex.padLeft(value, size))),

  padRightEffect: (value, size) =>
    catchOxErrors(Effect.try(() => Hex.padRight(value, size))),

  randomEffect: (length) =>
    catchOxErrors(Effect.try(() => Hex.random(length))),

  sizeEffect: (value) =>
    Effect.succeed(Hex.size(value)),

  toBigIntEffect: (hex, options) =>
    catchOxErrors(Effect.try(() => Hex.toBigInt(hex, options))),

  toBooleanEffect: (hex, options) =>
    catchOxErrors(Effect.try(() => Hex.toBoolean(hex, options))),

  toBytesEffect: (hex, options) =>
    catchOxErrors(Effect.try(() => Hex.toBytes(hex, options))),

  toNumberEffect: (hex, options) =>
    catchOxErrors(Effect.try(() => Hex.toNumber(hex, options))),

  toStringEffect: (hex, options) =>
    catchOxErrors(Effect.try(() => Hex.toString(hex, options))),
}

/**
 * Layer that provides the HexEffectService implementation
 */
export const HexEffectLayer = Layer.succeed(HexEffectTag, HexEffectLive)