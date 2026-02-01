import { Effect, Layer } from 'effect'
import { GetBalanceService } from './GetBalanceService.js'
import { StateManagerService } from '@tevm/state-effect'
import { InvalidParamsError, InternalError } from '@tevm/errors-effect'

/**
 * @module @tevm/actions-effect/GetBalanceLive
 * @description Live implementation of the GetBalance service using StateManagerService
 */

/**
 * Validates blockTag parameter - only 'latest' or undefined are supported
 * @param {import('./types.js').BlockParam} [blockTag] - Block tag to validate
 * @param {string} method - Method name for error messages
 * @returns {import('effect').Effect.Effect<'latest', import('@tevm/errors-effect').InvalidParamsError, never>}
 */
const validateBlockTag = (blockTag, method = 'eth_getBalance') =>
	Effect.gen(function* () {
		// Only 'latest' and undefined are supported
		// Historical block queries require TransportService for fork mode which is not yet implemented
		if (blockTag === undefined || blockTag === 'latest') {
			return /** @type {'latest'} */ ('latest')
		}
		return yield* Effect.fail(
			new InvalidParamsError({
				method,
				params: { blockTag },
				message: `Unsupported blockTag: ${String(blockTag)}. Only 'latest' is currently supported. Historical block queries require fork mode which is not yet implemented in actions-effect.`,
			}),
		)
	})

/**
 * Validates the address format
 * @param {string} address - Address to validate
 * @returns {import('effect').Effect.Effect<`0x${string}`, import('@tevm/errors-effect').InvalidParamsError, never>}
 */
const validateAddress = (address, method = 'eth_getBalance') =>
	Effect.gen(function* () {
		if (!address || typeof address !== 'string') {
			return yield* Effect.fail(
				new InvalidParamsError({
					method,
					params: { address },
					message: 'Address is required and must be a string',
				}),
			)
		}
		if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
			return yield* Effect.fail(
				new InvalidParamsError({
					method,
					params: { address },
					message: `Invalid address format: ${address}. Must be a 40-character hex string prefixed with 0x`,
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
 */
export const GetBalanceLive = Layer.effect(
	GetBalanceService,
	Effect.gen(function* () {
		const stateManager = yield* StateManagerService

		return {
			/**
			 * @param {import('./types.js').GetBalanceParams} params
			 */
			getBalance: (params) =>
				Effect.gen(function* () {
					// Validate address format
					const address = yield* validateAddress(params.address)

					// Validate blockTag - only 'latest' is supported
					yield* validateBlockTag(params.blockTag)

					// Get account from state manager, wrapping any errors as InternalError
					const account = yield* stateManager.getAccount(address).pipe(
						Effect.mapError(
							(e) =>
								new InternalError({
									message: `Failed to get account for balance: ${e instanceof Error ? e.message : String(e)}`,
									meta: { address, operation: 'getAccount' },
									cause: e,
								}),
						),
					)

					// Return balance (default to 0 if account doesn't exist)
					return account?.balance ?? 0n
				}),
		}
	}),
)
