import { Context, Effect, Layer } from 'effect'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import * as Signature from 'ox/core/Signature'
import type { ExactPartial } from 'ox/core/internal/types'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

// Re-export types
export type {
	Signature as SignatureType,
	Rpc,
	Legacy,
	LegacyRpc,
	Tuple,
} from 'ox/core/Signature'

/**
 * Interface for SignatureEffect service
 */
export interface SignatureEffectService {
	/**
	 * Asserts that a Signature is valid in an Effect
	 */
	assertEffect(
		signature: ExactPartial<Signature.Signature>,
		options?: Signature.assert.Options,
	): Effect.Effect<void, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Deserializes Bytes to a Signature in an Effect
	 */
	fromBytesEffect(signature: Bytes.Bytes): Effect.Effect<Signature.Signature, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Deserializes Hex to a Signature in an Effect
	 */
	fromHexEffect(signature: Hex.Hex): Effect.Effect<Signature.Signature, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Extracts a Signature from an object in an Effect
	 */
	extractEffect(
		value: Signature.extract.Value,
	): Effect.Effect<Signature.Signature | undefined, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Instantiates a Signature from various formats in an Effect
	 */
	fromEffect<
		const signature extends
			| Signature.Signature<boolean>
			| Signature.Rpc<boolean>
			| Signature.Legacy
			| Signature.LegacyRpc
			| Hex.Hex
			| Bytes.Bytes,
	>(
		signature:
			| signature
			| Signature.Signature<boolean>
			| Signature.Rpc<boolean>
			| Signature.Legacy
			| Signature.LegacyRpc
			| Hex.Hex
			| Bytes.Bytes,
	): Effect.Effect<Signature.from.ReturnType<signature>, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts DER-encoded bytes to a Signature in an Effect
	 */
	fromDerBytesEffect(
		signature: Bytes.Bytes,
	): Effect.Effect<Signature.Signature<false>, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts DER-encoded hex to a Signature in an Effect
	 */
	fromDerHexEffect(
		signature: Hex.Hex,
	): Effect.Effect<Signature.Signature<false>, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts a Legacy signature to a Signature in an Effect
	 */
	fromLegacyEffect(
		signature: Signature.Legacy,
	): Effect.Effect<Signature.Signature, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts a Rpc signature to a Signature in an Effect
	 */
	fromRpcEffect(signature: {
		r: Hex.Hex
		s: Hex.Hex
		yParity?: Hex.Hex | undefined
		v?: Hex.Hex | undefined
	}): Effect.Effect<Signature.Signature, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts a Tuple to a Signature in an Effect
	 */
	fromTupleEffect(tuple: Signature.Tuple): Effect.Effect<Signature.Signature, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Serializes a Signature to Bytes in an Effect
	 */
	toBytesEffect(
		signature: Signature.Signature<boolean>,
	): Effect.Effect<Bytes.Bytes, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Serializes a Signature to Hex in an Effect
	 */
	toHexEffect(
		signature: Signature.Signature<boolean>,
	): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts a Signature to DER-encoded bytes in an Effect
	 */
	toDerBytesEffect(
		signature: Signature.Signature<boolean>,
	): Effect.Effect<Bytes.Bytes, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts a Signature to DER-encoded hex in an Effect
	 */
	toDerHexEffect(
		signature: Signature.Signature<boolean>,
	): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts a Signature to Legacy format in an Effect
	 */
	toLegacyEffect(
		signature: Signature.Signature,
	): Effect.Effect<Signature.Legacy, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts a Signature to Rpc format in an Effect
	 */
	toRpcEffect(signature: Signature.Signature): Effect.Effect<Signature.Rpc, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts a Signature to a Tuple in an Effect
	 */
	toTupleEffect(
		signature: Signature.Signature,
	): Effect.Effect<Signature.Tuple, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Validates a Signature in an Effect
	 */
	validateEffect(
		signature: ExactPartial<Signature.Signature>,
		options?: Signature.validate.Options,
	): Effect.Effect<boolean, never, never>

	/**
	 * Converts a v value to a yParity value in an Effect
	 */
	vToYParityEffect(v: number): Effect.Effect<Signature.Signature['yParity'], BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts a yParity value to a v value in an Effect
	 */
	yParityToVEffect(yParity: number): Effect.Effect<number, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for SignatureEffectService dependency injection
 */
export const SignatureEffectTag = Context.Tag<SignatureEffectService>('@tevm/ox/SignatureEffect')

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
 * Live implementation of SignatureEffectService
 */
export const SignatureEffectLive: SignatureEffectService = {
	assertEffect: (signature, options) => catchOxErrors(Effect.try(() => Signature.assert(signature, options))),

	fromBytesEffect: (signature) => catchOxErrors(Effect.try(() => Signature.fromBytes(signature))),

	fromHexEffect: (signature) => catchOxErrors(Effect.try(() => Signature.fromHex(signature))),

	extractEffect: (value) => catchOxErrors(Effect.try(() => Signature.extract(value))),

	fromEffect: (signature) => catchOxErrors(Effect.try(() => Signature.from(signature as any))),

	fromDerBytesEffect: (signature) => catchOxErrors(Effect.try(() => Signature.fromDerBytes(signature))),

	fromDerHexEffect: (signature) => catchOxErrors(Effect.try(() => Signature.fromDerHex(signature))),

	fromLegacyEffect: (signature) => catchOxErrors(Effect.try(() => Signature.fromLegacy(signature))),

	fromRpcEffect: (signature) => catchOxErrors(Effect.try(() => Signature.fromRpc(signature))),

	fromTupleEffect: (tuple) => catchOxErrors(Effect.try(() => Signature.fromTuple(tuple))),

	toBytesEffect: (signature) => catchOxErrors(Effect.try(() => Signature.toBytes(signature))),

	toHexEffect: (signature) => catchOxErrors(Effect.try(() => Signature.toHex(signature))),

	toDerBytesEffect: (signature) => catchOxErrors(Effect.try(() => Signature.toDerBytes(signature))),

	toDerHexEffect: (signature) => catchOxErrors(Effect.try(() => Signature.toDerHex(signature))),

	toLegacyEffect: (signature) => catchOxErrors(Effect.try(() => Signature.toLegacy(signature))),

	toRpcEffect: (signature) => catchOxErrors(Effect.try(() => Signature.toRpc(signature))),

	toTupleEffect: (signature) => catchOxErrors(Effect.try(() => Signature.toTuple(signature))),

	validateEffect: (signature, options) => Effect.succeed(Signature.validate(signature, options)),

	vToYParityEffect: (v) => catchOxErrors(Effect.try(() => Signature.vToYParity(v))),

	yParityToVEffect: (yParity) => catchOxErrors(Effect.try(() => Signature.yParityToV(yParity))),
}

/**
 * Layer that provides the SignatureEffectService implementation
 */
export const SignatureEffectLayer = Layer.succeed(SignatureEffectTag, SignatureEffectLive)
