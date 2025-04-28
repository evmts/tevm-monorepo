import * as AesGcm from 'ox/core/AesGcm'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import { Effect, Context, Layer } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

// Re-export constants
export const ivLength = AesGcm.ivLength

/**
 * Interface for AesGcmEffect service
 */
export interface AesGcmEffectService {
  /**
   * Decrypts encrypted data using AES-GCM in an Effect
   */
  decryptEffect<
    value extends Hex.Hex | Bytes.Bytes,
    as extends 'Hex' | 'Bytes' =
      | (value extends Hex.Hex ? 'Hex' : never)
      | (value extends Bytes.Bytes ? 'Bytes' : never),
  >(
    value: value | Bytes.Bytes | Hex.Hex,
    key: CryptoKey,
    options?: AesGcm.decrypt.Options<as>,
  ): Effect.Effect<AesGcm.decrypt.ReturnType<as>, BaseErrorEffect<Error | undefined>, never>

  /**
   * Encrypts data using AES-GCM in an Effect
   */
  encryptEffect<
    value extends Hex.Hex | Bytes.Bytes,
    as extends 'Bytes' | 'Hex' =
      | (value extends Hex.Hex ? 'Hex' : never)
      | (value extends Bytes.Bytes ? 'Bytes' : never),
  >(
    value: value | Bytes.Bytes | Hex.Hex,
    key: CryptoKey,
    options?: AesGcm.encrypt.Options<as>,
  ): Effect.Effect<AesGcm.encrypt.ReturnType<as>, BaseErrorEffect<Error | undefined>, never>

  /**
   * Derives an AES-GCM key from a password using PBKDF2 in an Effect
   */
  getKeyEffect(
    options: AesGcm.getKey.Options,
  ): Effect.Effect<CryptoKey, BaseErrorEffect<Error | undefined>, never>

  /**
   * Generates a random salt of the specified size in an Effect
   */
  randomSaltEffect(
    size?: number,
  ): Effect.Effect<Bytes.Bytes, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for AesGcmEffectService dependency injection
 */
export const AesGcmEffectTag = Context.Tag<AesGcmEffectService>('@tevm/ox/AesGcmEffect')

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
 * Live implementation of AesGcmEffectService
 */
export const AesGcmEffectLive: AesGcmEffectService = {
  decryptEffect: (value, key, options) =>
    catchOxErrors(Effect.tryPromise(() => AesGcm.decrypt(value, key, options))),

  encryptEffect: (value, key, options) =>
    catchOxErrors(Effect.tryPromise(() => AesGcm.encrypt(value, key, options))),

  getKeyEffect: (options) =>
    catchOxErrors(Effect.tryPromise(() => AesGcm.getKey(options))),

  randomSaltEffect: (size) =>
    catchOxErrors(Effect.try(() => AesGcm.randomSalt(size))),
}

/**
 * Layer that provides the AesGcmEffectService implementation
 */
export const AesGcmEffectLayer = Layer.succeed(AesGcmEffectTag, AesGcmEffectLive)