import { Context, Effect, Layer } from 'effect'
import * as RpcRequest from 'ox/json-rpc/request'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox JSON-RPC Request
 */
export type JsonRpcRequestEffect = RpcRequest.Request

/**
 * Type alias for Ox JSON-RPC Request parameters
 */
export type JsonRpcRequestParamsEffect = RpcRequest.Params

/**
 * Type alias for Ox JSON-RPC Request batch
 */
export type JsonRpcRequestBatchEffect = RpcRequest.Batch

/**
 * Ox JSON-RPC Request effect service interface
 */
export interface JsonRpcRequestEffectService {
	/**
	 * Creates a JSON-RPC Request in an Effect
	 */
	createEffect<TMethod extends string, TParams extends RpcRequest.Params>(request: {
		method: TMethod
		params?: TParams
		id?: number | string
		jsonrpc?: string
	}): Effect.Effect<RpcRequest.Request<TMethod, TParams>, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Creates a JSON-RPC Request batch in an Effect
	 */
	createBatchEffect<
		TRequests extends ReadonlyArray<{
			method: string
			params?: RpcRequest.Params
			id?: number | string
			jsonrpc?: string
		}>,
	>(requests: [...TRequests]): Effect.Effect<RpcRequest.Batch, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Validates a JSON-RPC Request in an Effect
	 */
	validateEffect<TMethod extends string, TParams extends RpcRequest.Params>(
		request: RpcRequest.Request<TMethod, TParams>,
	): Effect.Effect<RpcRequest.Request<TMethod, TParams>, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Validates a JSON-RPC Request batch in an Effect
	 */
	validateBatchEffect(
		batch: RpcRequest.Batch,
	): Effect.Effect<RpcRequest.Batch, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for JsonRpcRequestEffectService dependency injection
 */
export const JsonRpcRequestEffectTag = Context.Tag<JsonRpcRequestEffectService>('@tevm/ox/JsonRpcRequestEffect')

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
 * Live implementation of JsonRpcRequestEffectService
 */
export const JsonRpcRequestEffectLive: JsonRpcRequestEffectService = {
	createEffect: (request) => catchOxErrors(Effect.try(() => RpcRequest.create(request))),

	createBatchEffect: (requests) => catchOxErrors(Effect.try(() => RpcRequest.createBatch(requests))),

	validateEffect: (request) => catchOxErrors(Effect.try(() => RpcRequest.validate(request))),

	validateBatchEffect: (batch) => catchOxErrors(Effect.try(() => RpcRequest.validateBatch(batch))),
}

/**
 * Layer that provides the JsonRpcRequestEffectService implementation
 */
export const JsonRpcRequestEffectLayer = Layer.succeed(JsonRpcRequestEffectTag, JsonRpcRequestEffectLive)
