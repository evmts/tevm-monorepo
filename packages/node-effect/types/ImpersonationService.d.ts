/**
 * @module @tevm/node-effect/ImpersonationService
 * @description Effect Context.Tag for Impersonation service
 */
/**
 * @typedef {import('./types.js').ImpersonationShape} ImpersonationShape
 */
/**
 * ImpersonationService Context Tag for Effect-based dependency injection.
 *
 * This tag is used to inject the ImpersonationShape into Effect computations,
 * enabling type-safe access to impersonation state operations.
 *
 * Impersonation allows sending transactions as if they were signed by any address,
 * useful for testing and development scenarios.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { ImpersonationService } from '@tevm/node-effect'
 *
 * const program = Effect.gen(function* () {
 *   const impersonation = yield* ImpersonationService
 *   const account = yield* impersonation.getImpersonatedAccount
 *   console.log('Impersonated:', account)
 * })
 * ```
 *
 * @example
 * ```javascript
 * // Setting an impersonated account
 * import { Effect, Layer } from 'effect'
 * import { ImpersonationService, ImpersonationLive } from '@tevm/node-effect'
 *
 * const program = Effect.gen(function* () {
 *   const impersonation = yield* ImpersonationService
 *   yield* impersonation.setImpersonatedAccount('0x1234567890123456789012345678901234567890')
 *   const account = yield* impersonation.getImpersonatedAccount
 *   return account
 * })
 *
 * const layer = ImpersonationLive()
 * Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 */
export const ImpersonationService: Context.Tag<any, any>;
export type ImpersonationShape = import("./types.js").ImpersonationShape;
import { Context } from 'effect';
//# sourceMappingURL=ImpersonationService.d.ts.map