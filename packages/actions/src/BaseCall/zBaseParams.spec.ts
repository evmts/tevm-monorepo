import { describe, expect, it } from 'vitest'
import { zBaseParams } from './zBaseParams.js'

describe('zBaseParams', () => {
	describe('valid inputs', () => {
		it('should accept empty object', () => {
			const result = zBaseParams.parse({})
			expect(result).toEqual({})
		})

		it('should accept throwOnFail: true', () => {
			const result = zBaseParams.parse({ throwOnFail: true })
			expect(result).toEqual({ throwOnFail: true })
		})

		it('should accept throwOnFail: false', () => {
			const result = zBaseParams.parse({ throwOnFail: false })
			expect(result).toEqual({ throwOnFail: false })
		})
	})

	describe('invalid inputs', () => {
		it('should reject non-boolean throwOnFail', () => {
			expect(() => zBaseParams.parse({ throwOnFail: 'true' })).toThrow()
		})

		it('should reject number throwOnFail', () => {
			expect(() => zBaseParams.parse({ throwOnFail: 1 })).toThrow()
		})

		it('should reject null', () => {
			expect(() => zBaseParams.parse(null)).toThrow()
		})

		it('should reject undefined', () => {
			expect(() => zBaseParams.parse(undefined)).toThrow()
		})
	})

	describe('schema properties', () => {
		it('should have a description', () => {
			expect(zBaseParams.description).toBe('Properties shared across actions')
		})

		it('should have throwOnFail field description', () => {
			const shape = zBaseParams.shape
			expect(shape.throwOnFail.description).toContain('throw errors')
		})
	})
})
