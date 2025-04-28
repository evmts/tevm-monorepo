import * as BlsPoint from 'ox/core/BlsPoint'
import * as Hex from 'ox/core/Hex'
import { Effect, Context, Layer } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox BlsPoint
 */
export type BlsPointEffect = BlsPoint.BlsPoint

/**
 * Ox BlsPoint effect service interface
 */
export interface BlsPointEffectService {
  /**
   * Converts BLS point to bytes in an Effect
   */
  toBytesEffect(
    point: BlsPoint.BlsPoint,
  ): Effect.Effect<Uint8Array, BaseErrorEffect<Error | undefined>, never>

  /**
   * Converts BLS point to hex in an Effect
   */
  toHexEffect(
    point: BlsPoint.BlsPoint,
  ): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

  /**
   * Converts bytes to BLS point in an Effect
   */
  fromBytesEffect(
    bytes: Uint8Array,
    type: 'G1' | 'G2',
  ): Effect.Effect<BlsPoint.BlsPoint, BaseErrorEffect<Error | undefined>, never>

  /**
   * Converts hex to BLS point in an Effect
   */
  fromHexEffect(
    hex: Hex.Hex,
    type: 'G1' | 'G2',
  ): Effect.Effect<BlsPoint.BlsPoint, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for BlsPointEffectService dependency injection
 */
export const BlsPointEffectTag = Context.Tag<BlsPointEffectService>('@tevm/ox/BlsPointEffect')

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
 * Live implementation of BlsPointEffectService
 */
export const BlsPointEffectLive: BlsPointEffectService = {
  toBytesEffect: (point) =>
    catchOxErrors(Effect.try(() => BlsPoint.toBytes(point))),

  toHexEffect: (point) =>
    catchOxErrors(Effect.try(() => BlsPoint.toHex(point))),

  fromBytesEffect: (bytes, type) =>
    catchOxErrors(Effect.try(() => BlsPoint.fromBytes(bytes, type))),

  fromHexEffect: (hex, type) =>
    catchOxErrors(Effect.try(() => BlsPoint.fromHex(hex, type))),
}

/**
 * Layer that provides the BlsPointEffectService implementation
 */
export const BlsPointEffectLayer = Layer.succeed(BlsPointEffectTag, BlsPointEffectLive)