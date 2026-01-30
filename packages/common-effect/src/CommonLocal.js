import { Layer } from 'effect'
import { createCommon, tevmDefault } from '@tevm/common'
import { CommonService } from './CommonService.js'

/**
 * @module @tevm/common-effect/CommonLocal
 * @description Pre-built layer for local/non-fork mode using tevm-devnet defaults
 */

/**
 * @typedef {import('./types.js').CommonShape} CommonShape
 */

/**
 * Pre-built CommonService layer for local/non-fork mode.
 *
 * This layer provides a CommonService configured with TEVM's default devnet
 * settings (chain ID 900, hardfork 'prague'). It's a convenience export for
 * use cases where you don't need to fork from a remote network.
 *
 * The layer has no dependencies, making it easy to use in isolation.
 *
 * @example
 * ```javascript
 * import { Effect } from 'effect'
 * import { CommonService, CommonLocal } from '@tevm/common-effect'
 *
 * const program = Effect.gen(function* () {
 *   const common = yield* CommonService
 *   console.log('Chain ID:', common.chainId) // 900
 *   console.log('Hardfork:', common.hardfork) // 'prague'
 * })
 *
 * Effect.runPromise(program.pipe(Effect.provide(CommonLocal)))
 * ```
 *
 * @example
 * ```javascript
 * // CommonLocal is equivalent to:
 * const CommonLocal = CommonFromConfig({
 *   chainId: 900,
 *   hardfork: 'prague'
 * })
 * ```
 *
 * @type {Layer.Layer<CommonService, never, never>}
 */
export const CommonLocal = (() => {
	const common = createCommon({
		...tevmDefault,
		id: 900,
		hardfork: 'prague',
		eips: [],
		loggingLevel: 'warn',
	}).copy()

	return Layer.succeed(
		CommonService,
		/** @type {CommonShape} */ ({
			common,
			chainId: 900,
			hardfork: 'prague',
			eips: common.ethjsCommon.eips(),
			copy: () => common.copy(),
		}),
	)
})()
