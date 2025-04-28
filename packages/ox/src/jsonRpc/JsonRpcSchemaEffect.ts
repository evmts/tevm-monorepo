import { Context, Effect, Layer } from 'effect'
import * as RpcSchema from 'ox/json-rpc/schema'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox RpcSchema
 */
export type JsonRpcSchemaEffect<T extends RpcSchema.RpcSchema = RpcSchema.RpcSchema> = RpcSchema.RpcSchema<T>

/**
 * Ox RpcSchema effect service interface
 */
export interface JsonRpcSchemaEffectService {
	/**
	 * Creates a statically typed RPC schema in an Effect
	 */
	fromEffect<T extends RpcSchema.RpcSchema>(schema: T): Effect.Effect<T, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for JsonRpcSchemaEffectService dependency injection
 */
export const JsonRpcSchemaEffectTag = Context.Tag<JsonRpcSchemaEffectService>('@tevm/ox/JsonRpcSchemaEffect')

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
 * Live implementation of JsonRpcSchemaEffectService
 */
export const JsonRpcSchemaEffectLive: JsonRpcSchemaEffectService = {
	fromEffect: (schema) => catchOxErrors(Effect.try(() => RpcSchema.from(schema))),
}

/**
 * Layer that provides the JsonRpcSchemaEffectService implementation
 */
export const JsonRpcSchemaEffectLayer = Layer.succeed(JsonRpcSchemaEffectTag, JsonRpcSchemaEffectLive)
