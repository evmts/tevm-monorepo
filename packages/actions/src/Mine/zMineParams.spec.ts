import { describe, expect, it } from 'vitest'
import { zMineParams } from './zMineParams.js'

describe('zMineParams', () => {
	describe('valid inputs', () => {
		it('should accept empty object', () => {
			const result = zMineParams.parse({})
			expect(result).toEqual({})
		})

		it('should accept blockCount', () => {
			const result = zMineParams.parse({ blockCount: 1 })
			expect(result).toEqual({ blockCount: 1 })
		})

		it('should accept blockCount of 0', () => {
			const result = zMineParams.parse({ blockCount: 0 })
			expect(result).toEqual({ blockCount: 0 })
		})

		it('should accept large blockCount', () => {
			const result = zMineParams.parse({ blockCount: 100 })
			expect(result).toEqual({ blockCount: 100 })
		})

		it('should accept interval', () => {
			const result = zMineParams.parse({ interval: 12 })
			expect(result).toEqual({ interval: 12 })
		})

		it('should accept interval of 0', () => {
			const result = zMineParams.parse({ interval: 0 })
			expect(result).toEqual({ interval: 0 })
		})

		it('should accept onBlock callback', () => {
			const onBlock = () => {}
			const result = zMineParams.parse({ onBlock })
			expect(typeof result.onBlock).toBe('function')
		})

		it('should accept onReceipt callback', () => {
			const onReceipt = () => {}
			const result = zMineParams.parse({ onReceipt })
			expect(typeof result.onReceipt).toBe('function')
		})

		it('should accept onLog callback', () => {
			const onLog = () => {}
			const result = zMineParams.parse({ onLog })
			expect(typeof result.onLog).toBe('function')
		})

		it('should accept all parameters together', () => {
			const onBlock = () => {}
			const onReceipt = () => {}
			const onLog = () => {}
			const result = zMineParams.parse({
				blockCount: 5,
				interval: 12,
				onBlock,
				onReceipt,
				onLog,
				throwOnFail: true,
			})
			expect(result.blockCount).toBe(5)
			expect(result.interval).toBe(12)
			expect(typeof result.onBlock).toBe('function')
			expect(typeof result.onReceipt).toBe('function')
			expect(typeof result.onLog).toBe('function')
			expect(result.throwOnFail).toBe(true)
		})

		it('should inherit throwOnFail from zBaseParams', () => {
			const result = zMineParams.parse({ throwOnFail: false })
			expect(result).toEqual({ throwOnFail: false })
		})
	})

	describe('invalid inputs', () => {
		it('should reject negative blockCount', () => {
			expect(() => zMineParams.parse({ blockCount: -1 })).toThrow()
		})

		it('should reject non-integer blockCount', () => {
			expect(() => zMineParams.parse({ blockCount: 1.5 })).toThrow()
		})

		it('should reject negative interval', () => {
			expect(() => zMineParams.parse({ interval: -1 })).toThrow()
		})

		it('should reject non-integer interval', () => {
			expect(() => zMineParams.parse({ interval: 1.5 })).toThrow()
		})

		it('should reject non-function onBlock', () => {
			expect(() => zMineParams.parse({ onBlock: 'not a function' })).toThrow()
		})

		it('should reject non-function onReceipt', () => {
			expect(() => zMineParams.parse({ onReceipt: 'not a function' })).toThrow()
		})

		it('should reject non-function onLog', () => {
			expect(() => zMineParams.parse({ onLog: 'not a function' })).toThrow()
		})

		it('should reject null', () => {
			expect(() => zMineParams.parse(null)).toThrow()
		})
	})
})
