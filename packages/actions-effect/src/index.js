/**
 * @module @tevm/actions-effect
 * @description Effect.ts action handlers for type-safe, composable Tevm operations
 *
 * This package provides Effect-based wrappers around Tevm action handlers,
 * enabling type-safe error handling, dependency injection, and composable
 * operations.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { GetAccountService, GetAccountLive } from '@tevm/actions-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 *
 * const program = Effect.gen(function* () {
 *   const { getAccount } = yield* GetAccountService
 *   const account = yield* getAccount({
 *     address: '0x1234567890123456789012345678901234567890'
 *   })
 *   console.log(`Balance: ${account.balance}`)
 *   return account
 * })
 *
 * // Run with composed layers
 * Effect.runPromise(
 *   program.pipe(
 *     Effect.provide(GetAccountLive),
 *     Effect.provide(StateManagerLocal)
 *   )
 * )
 * ```
 */

// GetAccount action
export { GetAccountService } from './GetAccountService.js'
export { GetAccountLive } from './GetAccountLive.js'
