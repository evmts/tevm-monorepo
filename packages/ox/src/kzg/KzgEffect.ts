import * as Kzg from 'ox/core/Kzg'
import * as Bytes from 'ox/core/Bytes'
import { Effect, Context, Layer } from 'effect'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

// Re-export constants
export const versionedHashVersion = Kzg.versionedHashVersion

// Re-export types
export type { Kzg as KzgType } from 'ox/core/Kzg'

/**
 * Interface for KzgEffect service
 */
export interface KzgEffectService {
  /**
   * Creates a Kzg interface from an existing Kzg implementation in an Effect
   */
  fromEffect(
    value: Kzg.Kzg
  ): Effect.Effect<Kzg.Kzg, BaseErrorEffect<Error | undefined>, never>

  /**
   * Convert a blob to a KZG commitment in an Effect
   */
  blobToKzgCommitmentEffect(
    kzg: Kzg.Kzg,
    blob: Bytes.Bytes
  ): Effect.Effect<Bytes.Bytes, BaseErrorEffect<Error | undefined>, never>

  /**
   * Compute a KZG proof for a blob in an Effect
   */
  computeBlobKzgProofEffect(
    kzg: Kzg.Kzg,
    blob: Bytes.Bytes,
    commitment: Bytes.Bytes
  ): Effect.Effect<Bytes.Bytes, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for KzgEffectService dependency injection
 */
export const KzgEffectTag = Context.Tag<KzgEffectService>('@tevm/ox/KzgEffect')

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
 * Live implementation of KzgEffectService
 */
export const KzgEffectLive: KzgEffectService = {
  fromEffect: (value) =>
    catchOxErrors(Effect.try(() => Kzg.from(value))),

  blobToKzgCommitmentEffect: (kzg, blob) =>
    catchOxErrors(Effect.try(() => kzg.blobToKzgCommitment(blob))),

  computeBlobKzgProofEffect: (kzg, blob, commitment) =>
    catchOxErrors(Effect.try(() => kzg.computeBlobKzgProof(blob, commitment))),
}

/**
 * Layer that provides the KzgEffectService implementation
 */
export const KzgEffectLayer = Layer.succeed(KzgEffectTag, KzgEffectLive)