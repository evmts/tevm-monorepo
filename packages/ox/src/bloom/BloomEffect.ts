import { Context, Effect, Layer } from 'effect'
import * as Address from 'ox/core/Address'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import * as Bloom from 'ox/execution/bloom'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox Bloom
 */
export type BloomEffect = Bloom.Bloom

/**
 * Ox Bloom effect service interface
 */
export interface BloomEffectService {
	/**
	 * Creates a new Bloom filter in an Effect
	 */
	createEffect(options?: { data?: Hex.Hex | Bytes.Bytes }): Effect.Effect<
		Bloom.Bloom,
		BaseErrorEffect<Error | undefined>,
		never
	>

	/**
	 * Adds an address to the bloom filter in an Effect
	 */
	addAddressEffect(options: { bloom: Bloom.Bloom; address: Address.Address }): Effect.Effect<
		Bloom.Bloom,
		BaseErrorEffect<Error | undefined>,
		never
	>

	/**
	 * Adds a topic to the bloom filter in an Effect
	 */
	addTopicEffect(options: { bloom: Bloom.Bloom; topic: Hex.Hex | Bytes.Bytes }): Effect.Effect<
		Bloom.Bloom,
		BaseErrorEffect<Error | undefined>,
		never
	>

	/**
	 * Checks if bloom filter has an address in an Effect
	 */
	hasAddressEffect(options: { bloom: Bloom.Bloom; address: Address.Address }): Effect.Effect<
		boolean,
		BaseErrorEffect<Error | undefined>,
		never
	>

	/**
	 * Checks if bloom filter has a topic in an Effect
	 */
	hasTopicEffect(options: { bloom: Bloom.Bloom; topic: Hex.Hex | Bytes.Bytes }): Effect.Effect<
		boolean,
		BaseErrorEffect<Error | undefined>,
		never
	>
}

/**
 * Tag for BloomEffectService dependency injection
 */
export const BloomEffectTag = Context.Tag<BloomEffectService>('@tevm/ox/BloomEffect')

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
 * Live implementation of BloomEffectService
 */
export const BloomEffectLive: BloomEffectService = {
	createEffect: (options) => catchOxErrors(Effect.try(() => Bloom.create(options))),

	addAddressEffect: (options) => catchOxErrors(Effect.try(() => Bloom.addAddress(options))),

	addTopicEffect: (options) => catchOxErrors(Effect.try(() => Bloom.addTopic(options))),

	hasAddressEffect: (options) => catchOxErrors(Effect.try(() => Bloom.hasAddress(options))),

	hasTopicEffect: (options) => catchOxErrors(Effect.try(() => Bloom.hasTopic(options))),
}

/**
 * Layer that provides the BloomEffectService implementation
 */
export const BloomEffectLayer = Layer.succeed(BloomEffectTag, BloomEffectLive)
