import { Effect, Layer } from 'effect'
import { ForkError } from '@tevm/errors-effect'
import { TransportService } from './TransportService.js'

/**
 * @module @tevm/transport-effect/TransportNoop
 * @description No-op transport layer for non-fork mode
 */

/**
 * @typedef {import('./types.js').TransportShape} TransportShape
 */

/**
 * A no-op transport layer for non-fork mode.
 *
 * This layer is used when TEVM is running without forking from a remote network.
 * Any attempt to make an RPC request will fail with a ForkError indicating that
 * no fork transport is configured.
 *
 * This is useful as a placeholder when you want to create a TEVM node that
 * doesn't fork from an external network but still need to satisfy the
 * TransportService dependency.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { TransportService, TransportNoop } from '@tevm/transport-effect'
 *
 * const program = Effect.gen(function* () {
 *   const transport = yield* TransportService
 *
 *   // This will fail with ForkError since TransportNoop is used
 *   const result = yield* transport.request('eth_chainId')
 * })
 *
 * Effect.runPromise(
 *   program.pipe(Effect.provide(TransportNoop))
 * ).catch(error => {
 *   console.log(error._tag) // 'ForkError'
 *   console.log(error.message) // 'No fork transport configured'
 * })
 * ```
 *
 * @example
 * ```javascript
 * // Using TransportNoop with a local-only TEVM node
 * import { TransportNoop, ForkConfigStatic } from '@tevm/transport-effect'
 *
 * // Create a local node without forking
 * const localNodeLayers = Layer.merge(
 *   TransportNoop,
 *   ForkConfigStatic({ chainId: 1n, blockTag: 0n })
 * )
 * ```
 *
 * @type {Layer.Layer<TransportService, never, never>}
 */
export const TransportNoop = Layer.succeed(
	TransportService,
	/** @type {TransportShape} */ ({
		request: (method) =>
			Effect.fail(
				new ForkError({
					method,
					cause: new Error('No fork transport configured'),
				})
			),
	})
)
