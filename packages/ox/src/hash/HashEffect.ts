import * as Hash from 'ox/core/Hash'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import { Effect, Context, Layer } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type aliases for Hash module
 */
export interface HashEffectService {
  /**
   * Calculates the Keccak256 hash of a value in an Effect
   */
  keccak256Effect<
    value extends Hex.Hex | Bytes.Bytes,
    as extends 'Hex' | 'Bytes' =
      | (value extends Hex.Hex ? 'Hex' : never)
      | (value extends Bytes.Bytes ? 'Bytes' : never),
  >(
    value: value | Hex.Hex | Bytes.Bytes,
    options?: Hash.keccak256.Options<as>,
  ): Effect.Effect<Hash.keccak256.ReturnType<as>, BaseErrorEffect<Error | undefined>, never>

  /**
   * Calculates the Ripemd160 hash of a value in an Effect
   */
  ripemd160Effect<
    value extends Hex.Hex | Bytes.Bytes,
    as extends 'Hex' | 'Bytes' =
      | (value extends Hex.Hex ? 'Hex' : never)
      | (value extends Bytes.Bytes ? 'Bytes' : never),
  >(
    value: value | Hex.Hex | Bytes.Bytes,
    options?: Hash.ripemd160.Options<as>,
  ): Effect.Effect<Hash.ripemd160.ReturnType<as>, BaseErrorEffect<Error | undefined>, never>

  /**
   * Calculates the Sha256 hash of a value in an Effect
   */
  sha256Effect<
    value extends Hex.Hex | Bytes.Bytes,
    as extends 'Hex' | 'Bytes' =
      | (value extends Hex.Hex ? 'Hex' : never)
      | (value extends Bytes.Bytes ? 'Bytes' : never),
  >(
    value: value | Hex.Hex | Bytes.Bytes,
    options?: Hash.sha256.Options<as>,
  ): Effect.Effect<Hash.sha256.ReturnType<as>, BaseErrorEffect<Error | undefined>, never>

  /**
   * Checks if a string is a valid hash value in an Effect
   */
  validateEffect(
    value: string,
  ): Effect.Effect<boolean, never, never>
}

/**
 * Tag for HashEffectService dependency injection
 */
export const HashEffectTag = Context.Tag<HashEffectService>('@tevm/ox/HashEffect')

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
 * Live implementation of HashEffectService
 */
export const HashEffectLive: HashEffectService = {
  keccak256Effect: (value, options) =>
    catchOxErrors(Effect.try(() => Hash.keccak256(value, options))),

  ripemd160Effect: (value, options) =>
    catchOxErrors(Effect.try(() => Hash.ripemd160(value, options))),

  sha256Effect: (value, options) =>
    catchOxErrors(Effect.try(() => Hash.sha256(value, options))),

  validateEffect: (value) =>
    Effect.succeed(Hash.validate(value)),
}

/**
 * Layer that provides the HashEffectService implementation
 */
export const HashEffectLayer = Layer.succeed(HashEffectTag, HashEffectLive)