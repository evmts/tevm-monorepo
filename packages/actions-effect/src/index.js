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

// Re-export types for consumers
export * from './types.js'

// GetAccount action
export { GetAccountService } from './GetAccountService.js'
export { GetAccountLive } from './GetAccountLive.js'

// SetAccount action
export { SetAccountService } from './SetAccountService.js'
export { SetAccountLive } from './SetAccountLive.js'

// GetBalance action (eth_getBalance)
export { GetBalanceService } from './GetBalanceService.js'
export { GetBalanceLive } from './GetBalanceLive.js'

// GetCode action (eth_getCode)
export { GetCodeService } from './GetCodeService.js'
export { GetCodeLive } from './GetCodeLive.js'

// GetStorageAt action (eth_getStorageAt)
export { GetStorageAtService } from './GetStorageAtService.js'
export { GetStorageAtLive } from './GetStorageAtLive.js'
