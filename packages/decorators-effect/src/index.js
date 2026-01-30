/**
 * @module @tevm/decorators-effect
 *
 * Effect-based decorator services for TEVM clients.
 *
 * This package provides Effect.ts implementations of TEVM decorators,
 * enabling type-safe, composable, and testable client extensions.
 *
 * ## Overview
 *
 * The decorators-effect package wraps the standard @tevm/decorators
 * functionality with Effect.ts services, providing:
 *
 * - **EthActionsService**: Standard Ethereum JSON-RPC methods
 * - **TevmActionsService**: TEVM-specific operations
 * - **RequestService**: EIP-1193 compatible request handling
 * - **SendService**: JSON-RPC 2.0 send methods
 *
 * ## Usage
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import {
 *   EthActionsService,
 *   EthActionsLive,
 *   TevmActionsService,
 *   TevmActionsLive,
 *   RequestService,
 *   RequestLive,
 * } from '@tevm/decorators-effect'
 * import { StateManagerLocal } from '@tevm/state-effect'
 * import { VmLive } from '@tevm/vm-effect'
 * import { CommonLive } from '@tevm/common-effect'
 *
 * // Compose layers
 * const baseLayer = Layer.mergeAll(
 *   StateManagerLocal(),
 *   CommonLive({ chainId: 1 }),
 * )
 *
 * const ethLayer = EthActionsLive.pipe(Layer.provide(baseLayer))
 * const tevmLayer = TevmActionsLive.pipe(Layer.provide(baseLayer))
 * const requestLayer = RequestLive.pipe(
 *   Layer.provide(ethLayer),
 *   Layer.provide(tevmLayer)
 * )
 *
 * // Use services
 * const program = Effect.gen(function* () {
 *   const request = yield* RequestService
 *
 *   const blockNumber = yield* request.request({
 *     method: 'eth_blockNumber',
 *     params: []
 *   })
 *
 *   return blockNumber
 * })
 *
 * await Effect.runPromise(program.pipe(Effect.provide(requestLayer)))
 * ```
 *
 * @example Using EthActions directly
 * ```javascript
 * import { Effect } from 'effect'
 * import { EthActionsService } from '@tevm/decorators-effect'
 *
 * const program = Effect.gen(function* () {
 *   const ethActions = yield* EthActionsService
 *
 *   const blockNumber = yield* ethActions.blockNumber()
 *   const chainId = yield* ethActions.chainId()
 *   const balance = yield* ethActions.getBalance({
 *     address: '0x1234567890123456789012345678901234567890'
 *   })
 *
 *   return { blockNumber, chainId, balance }
 * })
 * ```
 *
 * @example Using TevmActions for state manipulation
 * ```javascript
 * import { Effect } from 'effect'
 * import { TevmActionsService } from '@tevm/decorators-effect'
 *
 * const program = Effect.gen(function* () {
 *   const tevmActions = yield* TevmActionsService
 *
 *   // Set up test account
 *   yield* tevmActions.setAccount({
 *     address: '0x1234567890123456789012345678901234567890',
 *     balance: 1000000000000000000n
 *   })
 *
 *   // Execute call
 *   const result = yield* tevmActions.call({
 *     to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
 *     data: '0x'
 *   })
 *
 *   return result
 * })
 * ```
 */

// Services
export { EthActionsService } from './EthActionsService.js'
export { TevmActionsService } from './TevmActionsService.js'
export { RequestService } from './RequestService.js'
export { SendService } from './SendService.js'

// Live implementations
export { EthActionsLive } from './EthActionsLive.js'
export { TevmActionsLive } from './TevmActionsLive.js'
export { RequestLive } from './RequestLive.js'
export { SendLive } from './SendLive.js'
