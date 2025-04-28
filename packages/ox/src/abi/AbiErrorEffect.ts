import { Context, Effect, Layer } from 'effect'
import * as AbiError from 'ox/core/AbiError'
import * as AbiItem from 'ox/core/AbiItem'
import * as Hex from 'ox/core/Hex'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox AbiError
 */
export type AbiErrorEffect = AbiItem.AbiError

/**
 * Ox AbiError effect service interface
 */
export interface AbiErrorEffectService {
	/**
	 * Decodes ABI-encoded error data according to the ABI Error's parameter types (inputs)
	 */
	decodeEffect(
		abiError: AbiError.AbiError,
		data: Hex.Hex,
		options?: AbiItem.DecodeOptions,
	): Effect.Effect<unknown, BaseErrorEffect<Error | undefined>, never>

	/**
	 * ABI-encodes the provided error input (inputs), prefixed with the 4 byte error selector
	 */
	encodeEffect(
		abiError: AbiError.AbiError,
		args?: readonly unknown[] | Record<string, unknown>,
	): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Formats an AbiError into a Human Readable ABI Error
	 */
	formatEffect(abiError: AbiError.AbiError): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Parses an arbitrary JSON ABI Error or Human Readable ABI Error into a typed AbiError
	 */
	fromEffect(
		abiError: string | readonly string[] | AbiItem.AbiItemish,
		options?: AbiItem.FromOptions,
	): Effect.Effect<AbiError.AbiError, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Extracts an AbiError from an Abi given a name and optional arguments
	 */
	fromAbiEffect(
		abi: readonly AbiItem.AbiItemish[],
		name: string | Hex.Hex,
		options?: AbiItem.FromAbiOptions,
	): Effect.Effect<AbiError.AbiError, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Computes the 4-byte selector for an AbiError
	 */
	getSelectorEffect(
		abiItem: string | readonly string[] | AbiItem.AbiItemish,
	): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Access to Solidity panic reasons
	 */
	panicReasonsEffect: Effect.Effect<typeof AbiError.panicReasons, never, never>

	/**
	 * Access to the Solidity Error constant
	 */
	solidityErrorEffect: Effect.Effect<AbiError.AbiError, never, never>

	/**
	 * Access to the Solidity Error selector constant
	 */
	solidityErrorSelectorEffect: Effect.Effect<string, never, never>

	/**
	 * Access to the Solidity Panic constant
	 */
	solidityPanicEffect: Effect.Effect<AbiError.AbiError, never, never>

	/**
	 * Access to the Solidity Panic selector constant
	 */
	solidityPanicSelectorEffect: Effect.Effect<string, never, never>
}

/**
 * Tag for AbiErrorEffectService dependency injection
 */
export const AbiErrorEffectTag = Context.Tag<AbiErrorEffectService>('@tevm/ox/AbiErrorEffect')

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
 * Live implementation of AbiErrorEffectService
 */
export const AbiErrorEffectLive: AbiErrorEffectService = {
	decodeEffect: (abiError, data, options) => catchOxErrors(Effect.try(() => AbiError.decode(abiError, data, options))),

	encodeEffect: (abiError, args) =>
		catchOxErrors(Effect.try(() => (args ? AbiError.encode(abiError, args) : AbiError.encode(abiError)))),

	formatEffect: (abiError) => catchOxErrors(Effect.try(() => AbiError.format(abiError))),

	fromEffect: (abiError, options) => catchOxErrors(Effect.try(() => AbiError.from(abiError, options))),

	fromAbiEffect: (abi, name, options) => catchOxErrors(Effect.try(() => AbiError.fromAbi(abi, name, options))),

	getSelectorEffect: (abiItem) => catchOxErrors(Effect.try(() => AbiError.getSelector(abiItem))),

	panicReasonsEffect: Effect.succeed(AbiError.panicReasons),

	solidityErrorEffect: Effect.succeed(AbiError.solidityError),

	solidityErrorSelectorEffect: Effect.succeed(AbiError.solidityErrorSelector),

	solidityPanicEffect: Effect.succeed(AbiError.solidityPanic),

	solidityPanicSelectorEffect: Effect.succeed(AbiError.solidityPanicSelector),
}

/**
 * Layer that provides the AbiErrorEffectService implementation
 */
export const AbiErrorEffectLayer = Layer.succeed(AbiErrorEffectTag, AbiErrorEffectLive)
