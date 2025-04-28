import { Context, Effect, Layer } from 'effect'
import * as JsonRpcResponse from 'ox/json-rpc/response'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox JsonRpcResponse
 */
export type JsonRpcResponseEffect = JsonRpcResponse.JsonRpcResponse

/**
 * Ox JsonRpcResponse effect service interface
 */
export interface JsonRpcResponseEffectService {
	/**
	 * Create a JSON-RPC response with Effect
	 */
	createResponseEffect(
		params: JsonRpcResponse.CreateResponseParams,
	): Effect.Effect<JsonRpcResponse.JsonRpcResponse, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Parse a JSON-RPC response with Effect
	 */
	parseResponseEffect(
		response: string,
	): Effect.Effect<JsonRpcResponse.JsonRpcResponse, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Validate a JSON-RPC response with Effect
	 */
	validateResponseEffect(
		response: JsonRpcResponse.JsonRpcResponse,
	): Effect.Effect<boolean, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Get response result with Effect
	 */
	getResponseResultEffect(
		response: JsonRpcResponse.JsonRpcResponse,
	): Effect.Effect<unknown, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Get response error with Effect
	 */
	getResponseErrorEffect(
		response: JsonRpcResponse.JsonRpcResponse,
	): Effect.Effect<JsonRpcResponse.JsonRpcError | undefined, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for JsonRpcResponseEffectService dependency injection
 */
export const JsonRpcResponseEffectTag = Context.Tag<JsonRpcResponseEffectService>('@tevm/ox/JsonRpcResponseEffect')

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
 * Live implementation of JsonRpcResponseEffectService
 */
export const JsonRpcResponseEffectLive: JsonRpcResponseEffectService = {
	createResponseEffect: (params) => catchOxErrors(Effect.try(() => JsonRpcResponse.createResponse(params))),

	parseResponseEffect: (response) => catchOxErrors(Effect.try(() => JsonRpcResponse.parseResponse(response))),

	validateResponseEffect: (response) => catchOxErrors(Effect.try(() => JsonRpcResponse.validateResponse(response))),

	getResponseResultEffect: (response) => catchOxErrors(Effect.try(() => JsonRpcResponse.getResponseResult(response))),

	getResponseErrorEffect: (response) => catchOxErrors(Effect.try(() => JsonRpcResponse.getResponseError(response))),
}

/**
 * Layer that provides the JsonRpcResponseEffectService implementation
 */
export const JsonRpcResponseEffectLayer = Layer.succeed(JsonRpcResponseEffectTag, JsonRpcResponseEffectLive)
