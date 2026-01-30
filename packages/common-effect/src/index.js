/**
 * @module @tevm/common-effect
 * @description Effect.ts services for type-safe, composable chain configuration in TEVM
 *
 * This package provides Effect.ts-based services for managing Ethereum chain
 * configuration. It wraps the existing `@tevm/common` package with Effect.ts
 * patterns, enabling type-safe dependency injection and composable layers.
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { CommonService, CommonFromConfig, CommonLocal } from '@tevm/common-effect'
 *
 * // Program using CommonService
 * const program = Effect.gen(function* () {
 *   const common = yield* CommonService
 *
 *   console.log('Chain ID:', common.chainId)
 *   console.log('Hardfork:', common.hardfork)
 *   console.log('EIPs:', common.eips)
 *
 *   // Access underlying ethereumjs Common for advanced usage
 *   const ethjsCommon = common.common.ethjsCommon
 *   console.log('Is EIP-1559 active?', ethjsCommon.isActivatedEIP(1559))
 *
 *   // Create independent copy for separate VM instance
 *   const commonCopy = common.copy()
 *
 *   return common.chainId
 * })
 *
 * // Option 1: Use CommonLocal for local development (no fork)
 * Effect.runPromise(program.pipe(Effect.provide(CommonLocal)))
 *
 * // Option 2: Use CommonFromConfig for explicit configuration
 * Effect.runPromise(
 *   program.pipe(
 *     Effect.provide(CommonFromConfig({
 *       chainId: 1,
 *       hardfork: 'prague'
 *     }))
 *   )
 * )
 * ```
 *
 * @example
 * ```javascript
 * // Using CommonFromFork to auto-detect chain from RPC
 * import { HttpTransport, ForkConfigFromRpc } from '@tevm/transport-effect'
 * import { CommonFromFork } from '@tevm/common-effect'
 *
 * const transportLayer = HttpTransport({ url: 'https://mainnet.optimism.io' })
 * const forkConfigLayer = Layer.provide(ForkConfigFromRpc, transportLayer)
 * const commonLayer = Layer.provide(CommonFromFork(), forkConfigLayer)
 *
 * const fullLayer = Layer.mergeAll(transportLayer, forkConfigLayer, commonLayer)
 * Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
 * ```
 */

// Re-export types
/**
 * @typedef {import('./types.js').CommonShape} CommonShape
 * @typedef {import('./types.js').CommonConfigOptions} CommonConfigOptions
 * @typedef {import('./types.js').Hardfork} Hardfork
 * @typedef {import('./types.js').LogLevel} LogLevel
 */

// Service exports
export { CommonService } from './CommonService.js'

// Layer exports
export { CommonFromConfig } from './CommonFromConfig.js'
export { CommonFromFork } from './CommonFromFork.js'
export { CommonLocal } from './CommonLocal.js'
