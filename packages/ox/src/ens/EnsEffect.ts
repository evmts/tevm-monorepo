import { Context, Effect, Layer } from 'effect'
import * as Ens from 'ox/Ens'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox Ens
 */
export type EnsEffect = Ens.Ens

/**
 * Ox Ens effect service interface
 */
export interface EnsEffectService {
	/**
	 * Gets the address for an ENS name
	 */
	getAddressEffect(
		args: Ens.GetAddressParameters,
	): Effect.Effect<Ens.GetAddressReturnType, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Gets the ENS name for an address
	 */
	getNameEffect(
		args: Ens.GetNameParameters,
	): Effect.Effect<Ens.GetNameReturnType, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Gets the avatar for an ENS name
	 */
	getAvatarEffect(
		args: Ens.GetAvatarParameters,
	): Effect.Effect<Ens.GetAvatarReturnType, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Gets a text record for an ENS name
	 */
	getTextEffect(
		args: Ens.GetTextParameters,
	): Effect.Effect<Ens.GetTextReturnType, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Gets the universal resolver for ENS
	 */
	getUniversalResolverEffect(
		args: Ens.GetUniversalResolverParameters,
	): Effect.Effect<Ens.GetUniversalResolverReturnType, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Normalizes an ENS name
	 */
	normalizeEffect(
		args: Ens.NormalizeParameters,
	): Effect.Effect<Ens.NormalizeReturnType, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for EnsEffectService dependency injection
 */
export const EnsEffectTag = Context.Tag<EnsEffectService>('@tevm/ox/EnsEffect')

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
 * Live implementation of EnsEffectService
 */
export const EnsEffectLive: EnsEffectService = {
	getAddressEffect: (args) => catchOxErrors(Effect.try(() => Ens.getAddress(args))),

	getNameEffect: (args) => catchOxErrors(Effect.try(() => Ens.getName(args))),

	getAvatarEffect: (args) => catchOxErrors(Effect.try(() => Ens.getAvatar(args))),

	getTextEffect: (args) => catchOxErrors(Effect.try(() => Ens.getText(args))),

	getUniversalResolverEffect: (args) => catchOxErrors(Effect.try(() => Ens.getUniversalResolver(args))),

	normalizeEffect: (args) => catchOxErrors(Effect.try(() => Ens.normalize(args))),
}

/**
 * Layer that provides the EnsEffectService implementation
 */
export const EnsEffectLayer = Layer.succeed(EnsEffectTag, EnsEffectLive)
