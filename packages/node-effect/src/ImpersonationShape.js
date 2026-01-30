/**
 * @module @tevm/node-effect/ImpersonationShape
 * @description Documentation for the ImpersonationShape interface
 */

/**
 * ImpersonationShape Interface
 *
 * The ImpersonationShape provides Effect-wrapped methods for managing account
 * impersonation state in a Tevm node. Impersonation allows transactions to be
 * sent as if they were signed by any address, which is useful for:
 *
 * - Testing smart contracts with specific addresses
 * - Simulating transactions from whale addresses
 * - Development and debugging scenarios
 *
 * ## Methods
 *
 * ### getImpersonatedAccount
 * Returns an Effect that resolves to the currently impersonated address, or undefined
 * if no account is being impersonated.
 *
 * ```javascript
 * const program = Effect.gen(function* () {
 *   const impersonation = yield* ImpersonationService
 *   const account = yield* impersonation.getImpersonatedAccount
 *   if (account) {
 *     console.log('Currently impersonating:', account)
 *   }
 * })
 * ```
 *
 * ### setImpersonatedAccount
 * Sets the account to impersonate. Pass undefined to stop impersonation.
 *
 * ```javascript
 * const program = Effect.gen(function* () {
 *   const impersonation = yield* ImpersonationService
 *   // Start impersonating
 *   yield* impersonation.setImpersonatedAccount('0x742d35Cc6634C0532925a3b844Bc9e7595f1c3e0')
 *   // Stop impersonating
 *   yield* impersonation.setImpersonatedAccount(undefined)
 * })
 * ```
 *
 * ### getAutoImpersonate
 * Returns an Effect that resolves to whether auto-impersonation is enabled.
 * When enabled, all transaction senders are automatically impersonated.
 *
 * ```javascript
 * const program = Effect.gen(function* () {
 *   const impersonation = yield* ImpersonationService
 *   const auto = yield* impersonation.getAutoImpersonate
 *   console.log('Auto-impersonate:', auto)
 * })
 * ```
 *
 * ### setAutoImpersonate
 * Enables or disables auto-impersonation mode.
 *
 * ```javascript
 * const program = Effect.gen(function* () {
 *   const impersonation = yield* ImpersonationService
 *   // Enable auto-impersonation
 *   yield* impersonation.setAutoImpersonate(true)
 * })
 * ```
 *
 * ### deepCopy
 * Creates a deep copy of the impersonation state for isolation in tests.
 *
 * ```javascript
 * const program = Effect.gen(function* () {
 *   const impersonation = yield* ImpersonationService
 *   const copy = yield* impersonation.deepCopy()
 *   // copy is independent of original
 * })
 * ```
 *
 * @typedef {import('./types.js').ImpersonationShape} ImpersonationShape
 */

export {}
