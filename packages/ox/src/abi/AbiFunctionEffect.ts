import { Context, Effect, Layer } from 'effect'
import * as Abi from 'ox/core/Abi'
import * as AbiFunction from 'ox/core/AbiFunction'
import * as AbiItem from 'ox/core/AbiItem'
import * as Hex from 'ox/core/Hex'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox AbiFunction
 */
export type AbiFunctionEffect = AbiFunction.AbiFunction

/**
 * Ox AbiFunction effect service interface
 */
export interface AbiFunctionEffectService {
	/**
	 * ABI-decodes function arguments according to the ABI Item's input types (`inputs`).
	 */
	decodeDataEffect(
		abiFunction: AbiFunction.AbiFunction,
		data: Hex.Hex,
	): Effect.Effect<unknown, BaseErrorEffect<Error | undefined>, never>

	/**
	 * ABI-decodes a function's result according to the ABI Item's output types (`outputs`).
	 */
	decodeResultEffect<as extends 'Object' | 'Array' = 'Array'>(
		abiFunction: AbiFunction.AbiFunction,
		data: Hex.Hex,
		options?: AbiFunction.decodeResult.Options<as>,
	): Effect.Effect<unknown, BaseErrorEffect<Error | undefined>, never>

	/**
	 * ABI-encodes function arguments (`inputs`), prefixed with the 4 byte function selector.
	 */
	encodeDataEffect(
		abiFunction: AbiFunction.AbiFunction,
		...args: readonly unknown[]
	): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

	/**
	 * ABI-encodes a function's result (`outputs`).
	 */
	encodeResultEffect<as extends 'Object' | 'Array' = 'Array'>(
		abiFunction: AbiFunction.AbiFunction,
		output: unknown,
		options?: AbiFunction.encodeResult.Options<as>,
	): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Formats an AbiFunction into a Human Readable ABI Function.
	 */
	formatEffect(abiFunction: AbiFunction.AbiFunction): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Parses an arbitrary JSON ABI Function or Human Readable ABI Function into a typed AbiFunction.
	 */
	fromEffect(
		abiFunction: string | readonly string[] | AbiItem.AbiItemish,
		options?: AbiFunction.from.Options,
	): Effect.Effect<AbiFunction.AbiFunction, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Extracts an AbiFunction from an Abi given a name and optional arguments.
	 */
	fromAbiEffect(
		abi: readonly AbiItem.AbiItemish[],
		name: string | Hex.Hex,
		options?: AbiItem.fromAbi.Options,
	): Effect.Effect<AbiFunction.AbiFunction, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Computes the function selector (hash of function signature) for an AbiFunction.
	 */
	getSelectorEffect(
		abiItem: string | AbiFunction.AbiFunction,
	): Effect.Effect<Hex.Hex, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for AbiFunctionEffectService dependency injection
 */
export const AbiFunctionEffectTag = Context.Tag<AbiFunctionEffectService>('@tevm/ox/AbiFunctionEffect')

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
 * Live implementation of AbiFunctionEffectService
 */
export const AbiFunctionEffectLive: AbiFunctionEffectService = {
	decodeDataEffect: (abiFunction, data) => catchOxErrors(Effect.try(() => AbiFunction.decodeData(abiFunction, data))),

	decodeResultEffect: (abiFunction, data, options) =>
		catchOxErrors(Effect.try(() => AbiFunction.decodeResult(abiFunction, data, options))),

	encodeDataEffect: (abiFunction, ...args) =>
		catchOxErrors(Effect.try(() => AbiFunction.encodeData(abiFunction, ...args))),

	encodeResultEffect: (abiFunction, output, options) =>
		catchOxErrors(Effect.try(() => AbiFunction.encodeResult(abiFunction, output, options))),

	formatEffect: (abiFunction) => catchOxErrors(Effect.try(() => AbiFunction.format(abiFunction))),

	fromEffect: (abiFunction, options) => catchOxErrors(Effect.try(() => AbiFunction.from(abiFunction, options))),

	fromAbiEffect: (abi, name, options) => catchOxErrors(Effect.try(() => AbiFunction.fromAbi(abi, name, options))),

	getSelectorEffect: (abiItem) => catchOxErrors(Effect.try(() => AbiFunction.getSelector(abiItem))),
}

/**
 * Layer that provides the AbiFunctionEffectService implementation
 */
export const AbiFunctionEffectLayer = Layer.succeed(AbiFunctionEffectTag, AbiFunctionEffectLive)
