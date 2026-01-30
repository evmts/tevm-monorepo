/**
 * @module @tevm/common-effect/CommonService
 * @description Effect.ts Context.Tag for the CommonService
 */
/**
 * @typedef {import('./types.js').CommonShape} CommonShape
 */
/**
 * The CommonService Context.Tag for Effect.ts dependency injection.
 *
 * This service provides chain configuration including the Common object,
 * chain ID, hardfork settings, and enabled EIPs. It is a fundamental
 * dependency for most TEVM services (Blockchain, State, EVM, VM).
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
 *   console.log('Active EIPs:', commonService.eips)
 *
 *   // Access the underlying ethereumjs Common for advanced usage
 *   const ethjsCommon = commonService.common.ethjsCommon
 *   console.log('Is EIP-1559 active?', ethjsCommon.isActivatedEIP(1559))
 *
 *   // Create a copy for a separate VM instance
 *   const commonCopy = commonService.copy()
 * })
 *
 * // Run with explicit configuration
 * Effect.runPromise(
 *   program.pipe(
 *     Effect.provide(CommonFromConfig({
 *       chainId: 1,
 *       hardfork: 'prague',
 *       eips: [7702]
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
 * import { Effect, Layer } from 'effect'
 *
 * const transportLayer = HttpTransport({ url: 'https://mainnet.optimism.io' })
 * const forkConfigLayer = Layer.provide(ForkConfigFromRpc(), transportLayer)
 * const commonLayer = Layer.provide(CommonFromFork(), forkConfigLayer)
 *
 * Effect.runPromise(
 *   program.pipe(Effect.provide(commonLayer))
 * )
 * ```
 *
 */
export const CommonService: Context.Tag<any, any>;
export type CommonShape = import("./types.js").CommonShape;
import { Context } from 'effect';
//# sourceMappingURL=CommonService.d.ts.map