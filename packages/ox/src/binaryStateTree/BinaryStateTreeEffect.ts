import { Context, Effect, Layer } from 'effect'
import * as BinaryStateTree from 'ox/BinaryStateTree'
import * as Bytes from 'ox/Bytes'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox BinaryStateTree
 */
export type BinaryStateTreeEffect = BinaryStateTree.BinaryStateTree

/**
 * Ox BinaryStateTree effect service interface
 */
export interface BinaryStateTreeEffectService {
	/**
	 * Creates a new BinaryStateTree
	 */
	createEffect(): Effect.Effect<BinaryStateTree.BinaryStateTree, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Inserts a key-value pair into the Binary State Tree
	 */
	insertEffect(
		tree: BinaryStateTree.BinaryStateTree,
		key: Bytes.Bytes,
		value: Bytes.Bytes,
	): Effect.Effect<void, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Computes the Merkle root of the Binary State Tree
	 */
	merkelizeEffect(
		tree: BinaryStateTree.BinaryStateTree,
	): Effect.Effect<Bytes.Bytes, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for BinaryStateTreeEffectService dependency injection
 */
export const BinaryStateTreeEffectTag = Context.Tag<BinaryStateTreeEffectService>('@tevm/ox/BinaryStateTreeEffect')

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
 * Live implementation of BinaryStateTreeEffectService
 */
export const BinaryStateTreeEffectLive: BinaryStateTreeEffectService = {
	createEffect: () => catchOxErrors(Effect.try(() => BinaryStateTree.create())),

	insertEffect: (tree, key, value) => catchOxErrors(Effect.try(() => BinaryStateTree.insert(tree, key, value))),

	merkelizeEffect: (tree) => catchOxErrors(Effect.try(() => BinaryStateTree.merkelize(tree))),
}

/**
 * Layer that provides the BinaryStateTreeEffectService implementation
 */
export const BinaryStateTreeEffectLayer = Layer.succeed(BinaryStateTreeEffectTag, BinaryStateTreeEffectLive)
