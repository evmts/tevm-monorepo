import { describe, it, expect } from 'vitest'
import { Effect } from 'effect'
import { BlockParamsService } from './BlockParamsService.js'
import { BlockParamsLive } from './BlockParamsLive.js'

describe('BlockParamsLive', () => {
	describe('layer creation', () => {
		it('should create a layer', () => {
			const layer = BlockParamsLive()
			expect(layer).toBeDefined()
		})

		it('should accept options', () => {
			const layer = BlockParamsLive({
				nextBlockTimestamp: 1700000000n,
				nextBlockGasLimit: 30000000n,
				nextBlockBaseFeePerGas: 1000000000n,
				minGasPrice: 1000000000n,
				blockTimestampInterval: 12n,
			})
			expect(layer).toBeDefined()
		})
	})

	describe('nextBlockTimestamp', () => {
		it('should return undefined by default', async () => {
			const program = Effect.gen(function* () {
				const blockParams = yield* BlockParamsService
				return yield* blockParams.getNextBlockTimestamp
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(BlockParamsLive())))
			expect(result).toBeUndefined()
		})

		it('should set and get timestamp', async () => {
			const timestamp = 1700000000n
			const program = Effect.gen(function* () {
				const blockParams = yield* BlockParamsService
				yield* blockParams.setNextBlockTimestamp(timestamp)
				return yield* blockParams.getNextBlockTimestamp
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(BlockParamsLive())))
			expect(result).toBe(timestamp)
		})

		it('should use initial timestamp from options', async () => {
			const timestamp = 1700000000n
			const program = Effect.gen(function* () {
				const blockParams = yield* BlockParamsService
				return yield* blockParams.getNextBlockTimestamp
			})

			const result = await Effect.runPromise(
				program.pipe(Effect.provide(BlockParamsLive({ nextBlockTimestamp: timestamp }))),
			)
			expect(result).toBe(timestamp)
		})
	})

	describe('nextBlockGasLimit', () => {
		it('should return undefined by default', async () => {
			const program = Effect.gen(function* () {
				const blockParams = yield* BlockParamsService
				return yield* blockParams.getNextBlockGasLimit
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(BlockParamsLive())))
			expect(result).toBeUndefined()
		})

		it('should set and get gas limit', async () => {
			const gasLimit = 30000000n
			const program = Effect.gen(function* () {
				const blockParams = yield* BlockParamsService
				yield* blockParams.setNextBlockGasLimit(gasLimit)
				return yield* blockParams.getNextBlockGasLimit
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(BlockParamsLive())))
			expect(result).toBe(gasLimit)
		})
	})

	describe('nextBlockBaseFeePerGas', () => {
		it('should return undefined by default', async () => {
			const program = Effect.gen(function* () {
				const blockParams = yield* BlockParamsService
				return yield* blockParams.getNextBlockBaseFeePerGas
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(BlockParamsLive())))
			expect(result).toBeUndefined()
		})

		it('should set and get base fee', async () => {
			const baseFee = 1000000000n // 1 gwei
			const program = Effect.gen(function* () {
				const blockParams = yield* BlockParamsService
				yield* blockParams.setNextBlockBaseFeePerGas(baseFee)
				return yield* blockParams.getNextBlockBaseFeePerGas
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(BlockParamsLive())))
			expect(result).toBe(baseFee)
		})
	})

	describe('minGasPrice', () => {
		it('should return undefined by default', async () => {
			const program = Effect.gen(function* () {
				const blockParams = yield* BlockParamsService
				return yield* blockParams.getMinGasPrice
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(BlockParamsLive())))
			expect(result).toBeUndefined()
		})

		it('should set and get min gas price', async () => {
			const price = 1000000000n
			const program = Effect.gen(function* () {
				const blockParams = yield* BlockParamsService
				yield* blockParams.setMinGasPrice(price)
				return yield* blockParams.getMinGasPrice
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(BlockParamsLive())))
			expect(result).toBe(price)
		})

		it('should use initial min gas price from options', async () => {
			const price = 2000000000n
			const program = Effect.gen(function* () {
				const blockParams = yield* BlockParamsService
				return yield* blockParams.getMinGasPrice
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(BlockParamsLive({ minGasPrice: price }))))
			expect(result).toBe(price)
		})
	})

	describe('blockTimestampInterval', () => {
		it('should return undefined by default', async () => {
			const program = Effect.gen(function* () {
				const blockParams = yield* BlockParamsService
				return yield* blockParams.getBlockTimestampInterval
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(BlockParamsLive())))
			expect(result).toBeUndefined()
		})

		it('should set and get interval', async () => {
			const interval = 12n
			const program = Effect.gen(function* () {
				const blockParams = yield* BlockParamsService
				yield* blockParams.setBlockTimestampInterval(interval)
				return yield* blockParams.getBlockTimestampInterval
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(BlockParamsLive())))
			expect(result).toBe(interval)
		})
	})

	describe('clearNextBlockOverrides', () => {
		it('should clear timestamp, gas limit, and base fee', async () => {
			const program = Effect.gen(function* () {
				const blockParams = yield* BlockParamsService
				yield* blockParams.setNextBlockTimestamp(1700000000n)
				yield* blockParams.setNextBlockGasLimit(30000000n)
				yield* blockParams.setNextBlockBaseFeePerGas(1000000000n)

				yield* blockParams.clearNextBlockOverrides

				const timestamp = yield* blockParams.getNextBlockTimestamp
				const gasLimit = yield* blockParams.getNextBlockGasLimit
				const baseFee = yield* blockParams.getNextBlockBaseFeePerGas

				return { timestamp, gasLimit, baseFee }
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(BlockParamsLive())))
			expect(result.timestamp).toBeUndefined()
			expect(result.gasLimit).toBeUndefined()
			expect(result.baseFee).toBeUndefined()
		})

		it('should not clear minGasPrice and blockTimestampInterval', async () => {
			const program = Effect.gen(function* () {
				const blockParams = yield* BlockParamsService
				yield* blockParams.setMinGasPrice(1000000000n)
				yield* blockParams.setBlockTimestampInterval(12n)

				yield* blockParams.clearNextBlockOverrides

				const minGasPrice = yield* blockParams.getMinGasPrice
				const interval = yield* blockParams.getBlockTimestampInterval

				return { minGasPrice, interval }
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(BlockParamsLive())))
			expect(result.minGasPrice).toBe(1000000000n)
			expect(result.interval).toBe(12n)
		})
	})

	describe('deepCopy', () => {
		it('should create an independent copy', async () => {
			const program = Effect.gen(function* () {
				const blockParams = yield* BlockParamsService
				yield* blockParams.setNextBlockTimestamp(1700000000n)
				yield* blockParams.setMinGasPrice(1000000000n)

				// Create deep copy
				const copy = yield* blockParams.deepCopy()

				// Modify original
				yield* blockParams.setNextBlockTimestamp(1800000000n)

				// Check copy is unchanged
				const copiedTimestamp = yield* copy.getNextBlockTimestamp
				const originalTimestamp = yield* blockParams.getNextBlockTimestamp

				return { copiedTimestamp, originalTimestamp }
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(BlockParamsLive())))
			expect(result.copiedTimestamp).toBe(1700000000n)
			expect(result.originalTimestamp).toBe(1800000000n)
		})

		it('should copy all parameters', async () => {
			const program = Effect.gen(function* () {
				const blockParams = yield* BlockParamsService
				yield* blockParams.setNextBlockTimestamp(1700000000n)
				yield* blockParams.setNextBlockGasLimit(30000000n)
				yield* blockParams.setNextBlockBaseFeePerGas(1000000000n)
				yield* blockParams.setMinGasPrice(500000000n)
				yield* blockParams.setBlockTimestampInterval(12n)

				const copy = yield* blockParams.deepCopy()

				return {
					timestamp: yield* copy.getNextBlockTimestamp,
					gasLimit: yield* copy.getNextBlockGasLimit,
					baseFee: yield* copy.getNextBlockBaseFeePerGas,
					minGasPrice: yield* copy.getMinGasPrice,
					interval: yield* copy.getBlockTimestampInterval,
				}
			})

			const result = await Effect.runPromise(program.pipe(Effect.provide(BlockParamsLive())))
			expect(result.timestamp).toBe(1700000000n)
			expect(result.gasLimit).toBe(30000000n)
			expect(result.baseFee).toBe(1000000000n)
			expect(result.minGasPrice).toBe(500000000n)
			expect(result.interval).toBe(12n)
		})
	})
})
