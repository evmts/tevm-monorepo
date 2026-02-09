import { Effect, Layer, Ref } from 'effect'
import { ImpersonationService } from './ImpersonationService.js'

/**
 * @module @tevm/node-effect/ImpersonationLive
 * @description Layer that creates ImpersonationService using Effect Refs
 */

/**
 * @typedef {import('./types.js').ImpersonationShape} ImpersonationShape
 * @typedef {import('./types.js').ImpersonationLiveOptions} ImpersonationLiveOptions
 * @typedef {import('./types.js').Address} Address
 */

/**
 * Creates an ImpersonationService layer using Effect Refs for state management.
 *
 * This layer creates a service that manages impersonation state with two Refs:
 * - impersonatedAccount: The currently impersonated address
 * - autoImpersonate: Whether to auto-impersonate all transaction senders
 *
 * The service is fully isolated and can be deep-copied for test scenarios.
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { ImpersonationService, ImpersonationLive } from '@tevm/node-effect'
 *
 * const program = Effect.gen(function* () {
 *   const impersonation = yield* ImpersonationService
 *   yield* impersonation.setImpersonatedAccount('0x1234567890123456789012345678901234567890')
 *   const account = yield* impersonation.getImpersonatedAccount
 *   console.log('Impersonating:', account)
 * })
 *
 * const layer = ImpersonationLive()
 * Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 *
 * @example
 * ```javascript
 * // With initial configuration
 * const layer = ImpersonationLive({
 *   initialAccount: '0x742d35Cc6634C0532925a3b844Bc9e7595f1c3e0',
 *   autoImpersonate: true
 * })
 * ```
 *
 * @param {ImpersonationLiveOptions} [options] - Configuration options
 */
export const ImpersonationLive = (options = {}) => {
	return Layer.effect(
		ImpersonationService,
		Effect.gen(function* () {
			// Create Refs for mutable state
			/** @type {Ref.Ref<Address | undefined>} */
			const impersonatedAccountRef = yield* Ref.make(options.initialAccount)
			/** @type {Ref.Ref<boolean>} */
			const autoImpersonateRef = yield* Ref.make(options.autoImpersonate ?? false)

			/**
			 * Creates an ImpersonationShape from Refs.
			 * This helper enables the deepCopy pattern.
			 *
			 * @param {Ref.Ref<Address | undefined>} accountRef
			 * @param {Ref.Ref<boolean>} autoRef
			 * @returns {ImpersonationShape}
			 */
			const createShape = (accountRef, autoRef) => {
				/** @type {ImpersonationShape} */
				const shape = {
					getImpersonatedAccount: Ref.get(accountRef),

					setImpersonatedAccount: (address) => Ref.set(accountRef, address),

					getAutoImpersonate: Ref.get(autoRef),

					setAutoImpersonate: (enabled) => Ref.set(autoRef, enabled),

					deepCopy: () =>
						Effect.gen(function* () {
							// Read current values ATOMICALLY using Effect.all (Issue #NEW-P3-001 fix)
							// This prevents reading values at different points in time if other fibers modify them
							// between reads, which could cause the copied state to be inconsistent.
							const [currentAccount, currentAuto] = yield* Effect.all([Ref.get(accountRef), Ref.get(autoRef)])

							// Create new Refs with copied values
							const newAccountRef = yield* Ref.make(currentAccount)
							const newAutoRef = yield* Ref.make(currentAuto)

							// Return new shape
							return createShape(newAccountRef, newAutoRef)
						}),
				}
				return shape
			}

			return createShape(impersonatedAccountRef, autoImpersonateRef)
		}),
	)
}
