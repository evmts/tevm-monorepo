import { Effect, Layer, Ref } from 'effect'
import { BlockParamsService } from './BlockParamsService.js'

/**
 * @module @tevm/node-effect/BlockParamsLive
 * @description Layer that creates BlockParamsService using Effect Refs
 */

/**
 * @typedef {import('./types.js').BlockParamsShape} BlockParamsShape
 * @typedef {import('./types.js').BlockParamsLiveOptions} BlockParamsLiveOptions
 */

/**
 * Creates a BlockParamsService layer using Effect Refs for state management.
 *
 * This layer creates a service that manages block parameter overrides with Refs:
 * - nextBlockTimestamp: Override timestamp for next block
 * - nextBlockGasLimit: Override gas limit for next block
 * - nextBlockBaseFeePerGas: Override base fee (EIP-1559)
 * - minGasPrice: Minimum gas price for transactions
 * - blockTimestampInterval: Interval between blocks for auto-mining
 *
 * The service is fully isolated and can be deep-copied for test scenarios.
 *
 * @example
 * ```javascript
 * import { Effect, Layer } from 'effect'
 * import { BlockParamsService, BlockParamsLive } from '@tevm/node-effect'
 *
 * const program = Effect.gen(function* () {
 *   const blockParams = yield* BlockParamsService
 *   yield* blockParams.setNextBlockTimestamp(1700000000n)
 *   const ts = yield* blockParams.getNextBlockTimestamp
 *   console.log('Next block timestamp:', ts)
 * })
 *
 * const layer = BlockParamsLive()
 * Effect.runPromise(program.pipe(Effect.provide(layer)))
 * ```
 *
 * @example
 * ```javascript
 * // With initial configuration
 * const layer = BlockParamsLive({
 *   minGasPrice: 1000000000n, // 1 gwei
 *   blockTimestampInterval: 12n // 12 seconds
 * })
 * ```
 *
 * @param {BlockParamsLiveOptions} [options] - Configuration options
 */
export const BlockParamsLive = (options = {}) => {
	return Layer.effect(
		BlockParamsService,
		Effect.gen(function* () {
			// Create Refs for mutable state
			/** @type {Ref.Ref<bigint | undefined>} */
			const nextBlockTimestampRef = yield* Ref.make(options.nextBlockTimestamp)
			/** @type {Ref.Ref<bigint | undefined>} */
			const nextBlockGasLimitRef = yield* Ref.make(options.nextBlockGasLimit)
			/** @type {Ref.Ref<bigint | undefined>} */
			const nextBlockBaseFeePerGasRef = yield* Ref.make(options.nextBlockBaseFeePerGas)
			/** @type {Ref.Ref<bigint | undefined>} */
			const minGasPriceRef = yield* Ref.make(options.minGasPrice)
			/** @type {Ref.Ref<bigint | undefined>} */
			const blockTimestampIntervalRef = yield* Ref.make(options.blockTimestampInterval)

			/**
			 * Creates a BlockParamsShape from Refs.
			 * This helper enables the deepCopy pattern.
			 *
			 * @param {Ref.Ref<bigint | undefined>} timestampRef
			 * @param {Ref.Ref<bigint | undefined>} gasLimitRef
			 * @param {Ref.Ref<bigint | undefined>} baseFeeRef
			 * @param {Ref.Ref<bigint | undefined>} gasPriceRef
			 * @param {Ref.Ref<bigint | undefined>} intervalRef
			 * @returns {BlockParamsShape}
			 */
			const createShape = (timestampRef, gasLimitRef, baseFeeRef, gasPriceRef, intervalRef) => {
				/** @type {BlockParamsShape} */
				const shape = {
					getNextBlockTimestamp: Ref.get(timestampRef),
					setNextBlockTimestamp: (ts) => Ref.set(timestampRef, ts),

					getNextBlockGasLimit: Ref.get(gasLimitRef),
					setNextBlockGasLimit: (gl) => Ref.set(gasLimitRef, gl),

					getNextBlockBaseFeePerGas: Ref.get(baseFeeRef),
					setNextBlockBaseFeePerGas: (bf) => Ref.set(baseFeeRef, bf),

					getMinGasPrice: Ref.get(gasPriceRef),
					setMinGasPrice: (price) => Ref.set(gasPriceRef, price),

					getBlockTimestampInterval: Ref.get(intervalRef),
					setBlockTimestampInterval: (interval) => Ref.set(intervalRef, interval),

					clearNextBlockOverrides: Effect.gen(function* () {
						yield* Ref.set(timestampRef, undefined)
						yield* Ref.set(gasLimitRef, undefined)
						yield* Ref.set(baseFeeRef, undefined)
					}),

					deepCopy: () =>
						Effect.gen(function* () {
							// Read current values
							const timestamp = yield* Ref.get(timestampRef)
							const gasLimit = yield* Ref.get(gasLimitRef)
							const baseFee = yield* Ref.get(baseFeeRef)
							const gasPrice = yield* Ref.get(gasPriceRef)
							const interval = yield* Ref.get(intervalRef)

							// Create new Refs with copied values
							const newTimestampRef = yield* Ref.make(timestamp)
							const newGasLimitRef = yield* Ref.make(gasLimit)
							const newBaseFeeRef = yield* Ref.make(baseFee)
							const newGasPriceRef = yield* Ref.make(gasPrice)
							const newIntervalRef = yield* Ref.make(interval)

							// Return new shape
							return createShape(newTimestampRef, newGasLimitRef, newBaseFeeRef, newGasPriceRef, newIntervalRef)
						}),
				}
				return shape
			}

			return createShape(
				nextBlockTimestampRef,
				nextBlockGasLimitRef,
				nextBlockBaseFeePerGasRef,
				minGasPriceRef,
				blockTimestampIntervalRef,
			)
		}),
	)
}
