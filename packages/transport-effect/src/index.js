/**
 * @module @tevm/transport-effect
 * @description Effect.ts services for type-safe, composable RPC transport in TEVM
 *
 * This package provides Effect.ts-based transport services for making JSON-RPC
 * requests to Ethereum nodes. It is primarily used for TEVM's forking functionality,
 * allowing the EVM to fetch remote state from live networks.
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import {
 *   TransportService,
 *   HttpTransport,
 *   ForkConfigService,
 *   ForkConfigFromRpc
 * } from '@tevm/transport-effect'
 *
 * // Create program that uses transport
 * const program = Effect.gen(function* () {
 *   const transport = yield* TransportService
 *   const forkConfig = yield* ForkConfigService
 *
 *   console.log('Connected to chain:', forkConfig.chainId)
 *   console.log('Forking from block:', forkConfig.blockTag)
 *
 *   // Make RPC calls
 *   const balance = yield* transport.request('eth_getBalance', [
 *     '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD73',
 *     'latest'
 *   ])
 *
 *   return BigInt(balance)
 * })
 *
 * // Compose layers
 * const transportLayer = HttpTransport({ url: 'https://mainnet.optimism.io' })
 * const forkConfigLayer = Layer.provide(ForkConfigFromRpc, transportLayer)
 * const fullLayer = Layer.merge(transportLayer, forkConfigLayer)
 *
 * // Run the program
 * Effect.runPromise(program.pipe(Effect.provide(fullLayer)))
 *   .then(balance => console.log('Balance:', balance))
 * ```
 */

// Re-export types
/**
 * @typedef {import('./types.js').Hex} Hex
 * @typedef {import('./types.js').HttpTransportConfig} HttpTransportConfig
 * @typedef {import('./types.js').ForkConfigShape} ForkConfigShape
 * @typedef {import('./types.js').TransportShape} TransportShape
 */

// Transport exports
export { TransportService } from './TransportService.js'
export { HttpTransport } from './HttpTransport.js'
export { TransportNoop } from './TransportNoop.js'

// Fork config exports
export { ForkConfigService } from './ForkConfigService.js'
export { ForkConfigFromRpc } from './ForkConfigFromRpc.js'
export { ForkConfigStatic } from './ForkConfigStatic.js'
