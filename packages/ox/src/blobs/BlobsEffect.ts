import { Context, Effect, Layer } from 'effect'
import * as Blobs from 'ox/core/Blobs'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox Blobs
 */
export type BlobsEffect = typeof Blobs

/**
 * Ox Blobs effect service interface
 */
export interface BlobsEffectService {
	/**
	 * Verifies that a Bytes is a valid blob
	 */
	isBlobEffect(blob: Bytes.Bytes): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Verifies if a blob is a valid 4844 blob
	 */
	isValidEffect(blob: Bytes.Bytes): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Creates a 4844 Bytes blob
	 */
	toBytesEffect(blob: Blobs.Blob): Effect.Effect<Bytes.Bytes, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Creates a 4844 Hex blob
	 */
	toHexEffect(blob: Blobs.Blob): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts a Hex to a 4844 Blob
	 */
	fromHexEffect(hex: Hex.Hex): Effect.Effect<Blobs.Blob, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts a Bytes to a 4844 Blob
	 */
	fromBytesEffect(bytes: Bytes.Bytes): Effect.Effect<Blobs.Blob, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Creates a versioned hash from a commitment
	 */
	toVersionedHashEffect(commitment: Bytes.Bytes): Effect.Effect<Bytes.Bytes, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for BlobsEffectService dependency injection
 */
export const BlobsEffectTag = Context.Tag<BlobsEffectService>('@tevm/ox/BlobsEffect')

/**
 * Catch Ox errors and convert them to BaseErrorEffect
 */
function catchOxErrors<A>(
	effect: Effect.Effect<A, unknown, never>,
): Effect.Effect<A, BaseErrorEffect<Error | undefined>, never> {
	return Effect.catchAll(effect, (error) => {
		if (error instanceof Error) {
			return Effect.fail(new BaseErrorEffect(error.message, { cause: error }))
		}
		return Effect.fail(new BaseErrorEffect('Unknown error', { cause: error instanceof Error ? error : undefined }))
	})
}

/**
 * Live implementation of BlobsEffectService
 */
export const BlobsEffectLive: BlobsEffectService = {
	isBlobEffect: (blob) => catchOxErrors(Effect.try(() => Blobs.isBlob(blob))),

	isValidEffect: (blob) => catchOxErrors(Effect.try(() => Blobs.isValid(blob))),

	toBytesEffect: (blob) => catchOxErrors(Effect.try(() => Blobs.toBytes(blob))),

	toHexEffect: (blob) => catchOxErrors(Effect.try(() => Blobs.toHex(blob))),

	fromHexEffect: (hex) => catchOxErrors(Effect.try(() => Blobs.fromHex(hex))),

	fromBytesEffect: (bytes) => catchOxErrors(Effect.try(() => Blobs.fromBytes(bytes))),

	toVersionedHashEffect: (commitment) => catchOxErrors(Effect.try(() => Blobs.toVersionedHash(commitment))),
}

/**
 * Layer that provides the BlobsEffectService implementation
 */
export const BlobsEffectLayer = Layer.succeed(BlobsEffectTag, BlobsEffectLive)
