/**
 * @module @tevm/common-effect/CommonShape
 * @description Documentation for the CommonShape interface
 *
 * The CommonShape interface defines the contract for TEVM's chain configuration service.
 * It provides access to the underlying Common object, chain ID, hardfork settings,
 * enabled EIPs, and a method to create independent copies.
 *
 * ## Properties
 *
 * ### `common`
 * The underlying Common object from `@tevm/common`. This wraps both the viem Chain
 * interface and the ethereumjs Common instance (`common.ethjsCommon`).
 *
 * ### `chainId`
 * The numeric chain ID (e.g., 1 for mainnet, 10 for Optimism, 900 for tevm-devnet).
 *
 * ### `hardfork`
 * The active Ethereum hardfork. Determines which EVM features are available.
 * Default is 'prague' (latest supported hardfork).
 *
 * ### `eips`
 * Array of enabled EIP numbers. Some EIPs are enabled by default (1559, 4895, 4844, 4788, 2935).
 *
 * ### `copy()`
 * Creates an independent copy of the Common object. This is important because
 * Common objects are stateful - they contain mutable references that can be
 * modified during EVM execution. Always call `copy()` when passing Common
 * to different VM instances to avoid state corruption.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { CommonService, CommonFromConfig } from '@tevm/common-effect'
 *
 * const program = Effect.gen(function* () {
 *   const commonService = yield* CommonService
 *
 *   console.log('Chain ID:', commonService.chainId)
 *   console.log('Hardfork:', commonService.hardfork)
 *   console.log('Enabled EIPs:', commonService.eips)
 *
 *   // Create a copy for a new VM instance
 *   const commonCopy = commonService.copy()
 * })
 *
 * Effect.runPromise(
 *   program.pipe(Effect.provide(CommonFromConfig({ chainId: 1 })))
 * )
 * ```
 */

export {}
