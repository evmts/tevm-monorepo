import { Context, Effect, Layer } from 'effect'
import * as RpcTransport from 'ox/json-rpc/transport'
import { BaseErrorEffect } from '../errors/ErrorsEffect.js'

/**
 * Type alias for Ox RpcTransport
 */
export type JsonRpcTransportEffect = RpcTransport.RpcTransport

/**
 * Ox RpcTransport effect service interface
 */
export interface JsonRpcTransportEffectService {
	/**
	 * Creates an HTTP JSON-RPC Transport from a URL in an Effect
	 */
	fromHttpEffect(url: string | URL): Effect.Effect<RpcTransport.RpcTransport, BaseErrorEffect<Error | undefined>, never>

	/**
	 * Creates a custom JSON-RPC Transport using a custom request handler in an Effect
	 */
	createEffect(
		handler: RpcTransport.RpcTransportHandler,
	): Effect.Effect<RpcTransport.RpcTransport, BaseErrorEffect<Error | undefined>, never>
}

/**
 * Tag for JsonRpcTransportEffectService dependency injection
 */
export const JsonRpcTransportEffectTag = Context.Tag<JsonRpcTransportEffectService>('@tevm/ox/JsonRpcTransportEffect')

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
 * Live implementation of JsonRpcTransportEffectService
 */
export const JsonRpcTransportEffectLive: JsonRpcTransportEffectService = {
	fromHttpEffect: (url) => catchOxErrors(Effect.try(() => RpcTransport.fromHttp(url))),

	createEffect: (handler) => catchOxErrors(Effect.try(() => RpcTransport.create(handler))),
}

/**
 * Layer that provides the JsonRpcTransportEffectService implementation
 */
export const JsonRpcTransportEffectLayer = Layer.succeed(JsonRpcTransportEffectTag, JsonRpcTransportEffectLive)
