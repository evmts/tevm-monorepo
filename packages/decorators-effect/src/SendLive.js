/**
 * @module @tevm/decorators-effect/SendLive
 * Live implementation of the Send service for JSON-RPC
 */

import { Effect, Layer } from 'effect'
import { SendService } from './SendService.js'
import { RequestService } from './RequestService.js'

/**
 * Live implementation of SendService.
 *
 * Provides JSON-RPC 2.0 compliant send methods by wrapping
 * the RequestService.
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { SendService, SendLive } from '@tevm/decorators-effect'
 * import { RequestLive } from './RequestLive.js'
 *
 * const layer = SendLive.pipe(
 *   Layer.provide(RequestLive)
 * )
 *
 * const program = Effect.gen(function* () {
 *   const sendService = yield* SendService
 *   return yield* sendService.send({
 *     jsonrpc: '2.0',
 *     method: 'eth_blockNumber',
 *     params: [],
 *     id: 1
 *   })
 * })
 *
 * await Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 *
 * @type {Layer.Layer<SendService, never, RequestService>}
 */
export const SendLive = Layer.effect(
	SendService,
	Effect.gen(function* () {
		const requestService = yield* RequestService

		return {
			send: (request) =>
				Effect.gen(function* () {
					const result = yield* requestService
						.request({
							method: request.method,
							params: request.params,
						})
						.pipe(
							Effect.map((result) => ({
								jsonrpc: /** @type {const} */ ('2.0'),
								result,
								id: request.id,
							})),
							Effect.catchAll((error) =>
								Effect.succeed({
									jsonrpc: /** @type {const} */ ('2.0'),
									error: {
										// Preserve error-specific codes (RFC §6.3, JSON-RPC 2.0 spec)
										code: /** @type {any} */ (error).code ?? -32603,
										message: error.message || 'Internal error',
									},
									id: request.id,
								})
							)
						)
					return result
				}),

			sendBulk: (requests) =>
				Effect.all(
					requests.map((request) =>
						Effect.gen(function* () {
							const result = yield* requestService
								.request({
									method: request.method,
									params: request.params,
								})
								.pipe(
									Effect.map((result) => ({
										jsonrpc: /** @type {const} */ ('2.0'),
										result,
										id: request.id,
									})),
									Effect.catchAll((error) =>
										Effect.succeed({
											jsonrpc: /** @type {const} */ ('2.0'),
											error: {
												// Preserve error-specific codes (RFC §6.3, JSON-RPC 2.0 spec)
												code: /** @type {any} */ (error).code ?? -32603,
												message: error.message || 'Internal error',
											},
											id: request.id,
										})
									)
								)
							return result
						})
					)
				),
		}
	})
)
