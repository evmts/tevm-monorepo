import { Context, Effect, Layer } from 'effect'
import * as StateOverrides from 'ox/StateOverrides'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox StateOverrides
 */
export type StateOverridesEffect<bigintType = bigint> = StateOverrides.StateOverrides<bigintType>

/**
 * Type alias for Ox RPC StateOverrides
 */
export type RpcStateOverridesEffect = StateOverrides.Rpc

/**
 * Type alias for Ox AccountOverrides
 */
export type AccountOverridesEffect<bigintType = bigint> = StateOverrides.AccountOverrides<bigintType>

/**
 * Type alias for Ox RPC AccountOverrides
 */
export type RpcAccountOverridesEffect = StateOverrides.RpcAccountOverrides

/**
 * Type alias for Ox AccountStorage
 */
export type AccountStorageEffect = StateOverrides.AccountStorage

/**
 * Ox StateOverrides effect service interface
 */
export interface StateOverridesEffectService {
	/**
	 * Converts RPC state overrides to StateOverrides with Effect
	 */
	fromRpcEffect(
		rpcStateOverrides: StateOverrides.Rpc,
	): Effect.Effect<StateOverrides.StateOverrides, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Converts StateOverrides to RPC state overrides with Effect
	 */
	toRpcEffect(
		stateOverrides: StateOverrides.StateOverrides,
	): Effect.Effect<StateOverrides.Rpc, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for StateOverridesEffectService dependency injection
 */
export const StateOverridesEffectTag = Context.Tag<StateOverridesEffectService>('@tevm/ox/StateOverridesEffect')

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
 * Live implementation of StateOverridesEffectService
 */
export const StateOverridesEffectLive: StateOverridesEffectService = {
	fromRpcEffect: (rpcStateOverrides) => catchOxErrors(Effect.try(() => StateOverrides.fromRpc(rpcStateOverrides))),

	toRpcEffect: (stateOverrides) => catchOxErrors(Effect.try(() => StateOverrides.toRpc(stateOverrides))),
}

/**
 * Layer that provides the StateOverridesEffectService implementation
 */
export const StateOverridesEffectLayer = Layer.succeed(StateOverridesEffectTag, StateOverridesEffectLive)
