import { Context, Effect, Layer } from 'effect'
import * as Siwe from 'ox/Siwe'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox SIWE
 */
export type SiweEffect = Siwe.Siwe

/**
 * Ox SIWE effect service interface
 */
export interface SiweEffectService {
	/**
	 * Create a SIWE message with Effect
	 */
	createMessageEffect(
		params: Siwe.CreateMessageParams,
	): Effect.Effect<Siwe.Message, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Verify a SIWE message with Effect
	 */
	verifyMessageEffect(
		params: Siwe.VerifyMessageParams,
	): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Parse a SIWE message with Effect
	 */
	parseMessageEffect(message: string): Effect.Effect<Siwe.Message, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for SiweEffectService dependency injection
 */
export const SiweEffectTag = Context.Tag<SiweEffectService>('@tevm/ox/SiweEffect')

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
 * Live implementation of SiweEffectService
 */
export const SiweEffectLive: SiweEffectService = {
	createMessageEffect: (params) => catchOxErrors(Effect.try(() => Siwe.createMessage(params))),

	verifyMessageEffect: (params) => catchOxErrors(Effect.try(() => Siwe.verifyMessage(params))),

	parseMessageEffect: (message) => catchOxErrors(Effect.try(() => Siwe.parseMessage(message))),
}

/**
 * Layer that provides the SiweEffectService implementation
 */
export const SiweEffectLayer = Layer.succeed(SiweEffectTag, SiweEffectLive)
