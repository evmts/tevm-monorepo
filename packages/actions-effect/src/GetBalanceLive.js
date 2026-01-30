import { Effect, Layer } from 'effect'
import { GetBalanceService } from './GetBalanceService.js'
import { StateManagerService } from '@tevm/state-effect'
import { InvalidParamsError } from '@tevm/errors-effect'

/**
 * @module @tevm/actions-effect/GetBalanceLive
 * @description Live implementation of the GetBalance service using StateManagerService
 */

/**
 * Validates the address format
 * @param {string} address - Address to validate
 * @returns {import('effect').Effect.Effect<`0x${string}`, import('@tevm/errors-effect').InvalidParamsError, never>}
 */
const validateAddress = (address) =>
	Effect.gen(function* () {
		if (!address || typeof address !== 'string') {
			return yield* Effect.fail(
				new InvalidParamsError({
					message: 'Address is required and must be a string',
					code: -32602,
				}),
			)
		}
		if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
			return yield* Effect.fail(
				new InvalidParamsError({
					message: `Invalid address format: ${address}. Must be a 40-character hex string prefixed with 0x`,
					code: -32602,
				}),
			)
		}
		return /** @type {`0x${string}`} */ (address.toLowerCase())
	})

/**
 * Creates the GetBalance service implementation.
 *
 * This layer provides balance query functionality using the StateManagerService.
 * Implements the eth_getBalance JSON-RPC method.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { GetBalanceService, GetBalanceLive } from '@tevm/actions-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 *
 * const program = Effect.gen(function* () {
 *   const { getBalance } = yield* GetBalanceService
 *   const balance = yield* getBalance({
 *     address: '0x1234567890123456789012345678901234567890'
 *   })
 *   return balance
 * })
 *
 * // Compose layers
 * const AppLayer = GetBalanceLive.pipe(
 *   Layer.provide(StateManagerLocal)
 * )
 *
 * Effect.runPromise(program.pipe(Effect.provide(AppLayer)))
 * ```
 *
 * @type {import('effect').Layer.Layer<
 *   import('./GetBalanceService.js').GetBalanceService,
 *   never,
 *   import('@tevm/state-effect').StateManagerService
 * >}
 */
export const GetBalanceLive = Layer.effect(
	GetBalanceService,
	Effect.gen(function* () {
		const stateManager = yield* StateManagerService

		return {
			/**
			 * @param {import('./types.js').GetBalanceParams} params
			 * @returns {import('effect').Effect.Effect<bigint, import('@tevm/errors-effect').InvalidParamsError, never>}
			 */
			getBalance: (params) =>
				Effect.gen(function* () {
					// Validate address format
					const address = yield* validateAddress(params.address)

					// Get account from state manager
					const account = yield* stateManager.getAccount(address)

					// Return balance (default to 0 if account doesn't exist)
					return account?.balance ?? 0n
				}),
		}
	}),
)
