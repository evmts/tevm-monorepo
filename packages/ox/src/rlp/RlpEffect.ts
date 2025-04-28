import * as Rlp from 'ox/core/Rlp'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import { Effect, Context, Layer } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'
import type { RecursiveArray } from 'ox/core/internal/types'

/**
 * Interface for RlpEffect service
 */
export interface RlpEffectService {
  /**
   * Decodes a Recursive-Length Prefix (RLP) value into Bytes in an Effect
   */
  toBytesEffect(
    value: Bytes.Bytes | Hex.Hex
  ): Effect.Effect<RecursiveArray<Bytes.Bytes>, BaseErrorEffect<Error | undefined>, never>

  /**
   * Decodes a Recursive-Length Prefix (RLP) value into Hex in an Effect
   */
  toHexEffect(
    value: Bytes.Bytes | Hex.Hex
  ): Effect.Effect<RecursiveArray<Hex.Hex>, BaseErrorEffect<Error | undefined>, never>

  /**
   * Encodes a value into a Recursive-Length Prefix (RLP) value in an Effect
   */
  fromEffect<as extends 'Hex' | 'Bytes'>(
    value: RecursiveArray<Bytes.Bytes> | RecursiveArray<Hex.Hex>,
    options: Rlp.from.Options<as>
  ): Effect.Effect<Rlp.from.ReturnType<as>, BaseErrorEffect<Error | undefined>, never>

  /**
   * Encodes Bytes into a Recursive-Length Prefix (RLP) value in an Effect
   */
  fromBytesEffect<as extends 'Hex' | 'Bytes' = 'Bytes'>(
    bytes: RecursiveArray<Bytes.Bytes>,
    options?: Rlp.fromBytes.Options<as>
  ): Effect.Effect<Rlp.fromBytes.ReturnType<as>, BaseErrorEffect<Error | undefined>, never>

  /**
   * Encodes Hex into a Recursive-Length Prefix (RLP) value in an Effect
   */
  fromHexEffect<as extends 'Hex' | 'Bytes' = 'Hex'>(
    hex: RecursiveArray<Hex.Hex>,
    options?: Rlp.fromHex.Options<as>
  ): Effect.Effect<Rlp.fromHex.ReturnType<as>, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for RlpEffectService dependency injection
 */
export const RlpEffectTag = Context.Tag<RlpEffectService>('@tevm/ox/RlpEffect')

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
 * Live implementation of RlpEffectService
 */
export const RlpEffectLive: RlpEffectService = {
  toBytesEffect: (value) =>
    catchOxErrors(Effect.try(() => Rlp.toBytes(value))),

  toHexEffect: (value) =>
    catchOxErrors(Effect.try(() => Rlp.toHex(value))),

  fromEffect: (value, options) =>
    catchOxErrors(Effect.try(() => Rlp.from(value, options))),

  fromBytesEffect: (bytes, options) =>
    catchOxErrors(Effect.try(() => Rlp.fromBytes(bytes, options))),

  fromHexEffect: (hex, options) =>
    catchOxErrors(Effect.try(() => Rlp.fromHex(hex, options))),
}

/**
 * Layer that provides the RlpEffectService implementation
 */
export const RlpEffectLayer = Layer.succeed(RlpEffectTag, RlpEffectLive)