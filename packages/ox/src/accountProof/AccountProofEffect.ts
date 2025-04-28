import { Context, Effect, Layer } from 'effect'
import * as Address from 'ox/core/Address'
import * as Bytes from 'ox/core/Bytes'
import * as Hex from 'ox/core/Hex'
import * as AccountProof from 'ox/execution/account-proof'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox AccountProof
 */
export type AccountProofEffect = AccountProof.AccountProof

/**
 * Ox AccountProof effect service interface
 */
export interface AccountProofEffectService {
	/**
	 * Parses account proof from raw RPC response in an Effect
	 */
	parseEffect(
		value: AccountProof.AccountProofJson,
	): Effect.Effect<AccountProof.AccountProof, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Verifies an account proof against the provided state root in an Effect
	 */
	verifyEffect(options: {
		proof: AccountProof.AccountProof
		address: Address.Address
		stateRoot: Hex.Hex | Bytes.Bytes
	}): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Verifies a storage proof against the provided storage root in an Effect
	 */
	verifyStorageEffect(options: {
		proof: AccountProof.StorageProof
		storageRoot: Hex.Hex | Bytes.Bytes
		slot: Hex.Hex | Bytes.Bytes
	}): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for AccountProofEffectService dependency injection
 */
export const AccountProofEffectTag = Context.Tag<AccountProofEffectService>('@tevm/ox/AccountProofEffect')

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
 * Live implementation of AccountProofEffectService
 */
export const AccountProofEffectLive: AccountProofEffectService = {
	parseEffect: (value) => catchOxErrors(Effect.try(() => AccountProof.parse(value))),

	verifyEffect: (options) => catchOxErrors(Effect.try(() => AccountProof.verify(options))),

	verifyStorageEffect: (options) => catchOxErrors(Effect.try(() => AccountProof.verifyStorage(options))),
}

/**
 * Layer that provides the AccountProofEffectService implementation
 */
export const AccountProofEffectLayer = Layer.succeed(AccountProofEffectTag, AccountProofEffectLive)
