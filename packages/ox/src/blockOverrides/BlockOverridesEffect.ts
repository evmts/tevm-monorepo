import { Context, Effect, Layer } from 'effect'
import * as BlockOverrides from 'ox/execution/block-overrides'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox BlockOverrides
 */
export type BlockOverridesEffect = BlockOverrides.BlockOverrides

/**
 * Ox BlockOverrides effect service interface
 */
export interface BlockOverridesEffectService {
	/**
	 * Parses block overrides in an Effect
	 */
	parseEffect(
		value: BlockOverrides.BlockOverridesJson,
	): Effect.Effect<BlockOverrides.BlockOverrides, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Formats block overrides to JSON in an Effect
	 */
	formatEffect(
		overrides: BlockOverrides.BlockOverrides,
	): Effect.Effect<BlockOverrides.BlockOverridesJson, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for BlockOverridesEffectService dependency injection
 */
export const BlockOverridesEffectTag = Context.Tag<BlockOverridesEffectService>('@tevm/ox/BlockOverridesEffect')

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
 * Live implementation of BlockOverridesEffectService
 */
export const BlockOverridesEffectLive: BlockOverridesEffectService = {
	parseEffect: (value) => catchOxErrors(Effect.try(() => BlockOverrides.parse(value))),

	formatEffect: (overrides) => catchOxErrors(Effect.try(() => BlockOverrides.format(overrides))),
}

/**
 * Layer that provides the BlockOverridesEffectService implementation
 */
export const BlockOverridesEffectLayer = Layer.succeed(BlockOverridesEffectTag, BlockOverridesEffectLive)
