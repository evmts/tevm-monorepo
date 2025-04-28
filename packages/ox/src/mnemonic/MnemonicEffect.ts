import { Context, Effect, Layer } from 'effect'
import * as Mnemonic from 'ox/Mnemonic'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox Mnemonic
 */
export type MnemonicEffect = typeof Mnemonic

/**
 * Ox Mnemonic effect service interface
 */
export interface MnemonicEffectService {
	/**
	 * Generates a random mnemonic phrase in an Effect
	 */
	randomEffect(
		wordlist: string[],
		options?: Mnemonic.random.Options,
	): Effect.Effect<string, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts a mnemonic to a master seed in an Effect
	 */
	toSeedEffect<as extends 'Bytes' | 'Hex' = 'Bytes'>(
		mnemonic: string,
		options?: Mnemonic.toSeed.Options<as>,
	): Effect.Effect<Mnemonic.toSeed.ReturnType<as>, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Validates a mnemonic with a wordlist in an Effect
	 */
	validateEffect(
		mnemonic: string,
		wordlist: string[],
	): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts a mnemonic to a HD Key in an Effect
	 */
	toHdKeyEffect(
		mnemonic: string,
		options?: Mnemonic.toHdKey.Options,
	): Effect.Effect<Mnemonic.HdKey, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts a mnemonic to a private key in an Effect
	 */
	toPrivateKeyEffect<as extends 'Bytes' | 'Hex' = 'Bytes'>(
		mnemonic: string,
		options?: Mnemonic.toPrivateKey.Options<as>,
	): Effect.Effect<Mnemonic.toPrivateKey.ReturnType<as>, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for MnemonicEffectService dependency injection
 */
export const MnemonicEffectTag = Context.Tag<MnemonicEffectService>('@tevm/ox/MnemonicEffect')

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
 * Live implementation of MnemonicEffectService
 */
export const MnemonicEffectLive: MnemonicEffectService = {
	randomEffect: (wordlist, options) => catchOxErrors(Effect.try(() => Mnemonic.random(wordlist, options))),

	toSeedEffect: (mnemonic, options) => catchOxErrors(Effect.try(() => Mnemonic.toSeed(mnemonic, options))),

	validateEffect: (mnemonic, wordlist) => catchOxErrors(Effect.try(() => Mnemonic.validate(mnemonic, wordlist))),

	toHdKeyEffect: (mnemonic, options) => catchOxErrors(Effect.try(() => Mnemonic.toHdKey(mnemonic, options))),

	toPrivateKeyEffect: (mnemonic, options) => catchOxErrors(Effect.try(() => Mnemonic.toPrivateKey(mnemonic, options))),
}

/**
 * Layer that provides the MnemonicEffectService implementation
 */
export const MnemonicEffectLayer = Layer.succeed(MnemonicEffectTag, MnemonicEffectLive)
