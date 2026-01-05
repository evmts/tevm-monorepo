import { describe, expect, it } from 'vitest'
import { pad, padBytes, padHex, SizeExceedsPaddingSizeError } from './pad.js'

describe('pad', () => {
	describe('padHex', () => {
		it('should pad hex to 32 bytes by default (left-aligned)', () => {
			expect(padHex('0x1234')).toBe('0x0000000000000000000000000000000000000000000000000000000000001234')
		})

		it('should pad hex to the right when dir is "right"', () => {
			expect(padHex('0x1234', { dir: 'right' })).toBe(
				'0x1234000000000000000000000000000000000000000000000000000000000000',
			)
		})

		it('should pad to custom size', () => {
			expect(padHex('0x1234', { size: 4 })).toBe('0x00001234')
			expect(padHex('0x1234', { size: 8 })).toBe('0x0000000000001234')
		})

		it('should return unchanged hex when size is null', () => {
			expect(padHex('0x1234', { size: null })).toBe('0x1234')
		})

		it('should handle empty hex', () => {
			expect(padHex('0x', { size: 4 })).toBe('0x00000000')
		})

		it('should handle single byte hex', () => {
			expect(padHex('0xff', { size: 2 })).toBe('0x00ff')
			expect(padHex('0xff', { size: 2, dir: 'right' })).toBe('0xff00')
		})

		it('should throw when hex exceeds target size', () => {
			expect(() => padHex('0x12345678', { size: 2 })).toThrow(SizeExceedsPaddingSizeError)
		})

		it('should throw SizeExceedsPaddingSizeError with correct message', () => {
			try {
				padHex('0x12345678', { size: 2 })
			} catch (e) {
				expect(e).toBeInstanceOf(SizeExceedsPaddingSizeError)
				expect((e as Error).message).toContain('4 bytes')
				expect((e as Error).message).toContain('2 bytes')
			}
		})
	})

	describe('padBytes', () => {
		it('should pad bytes to 32 by default (left-aligned)', () => {
			const result = padBytes(new Uint8Array([1, 2]))
			expect(result.length).toBe(32)
			expect(result[30]).toBe(1)
			expect(result[31]).toBe(2)
		})

		it('should pad bytes to the right when dir is "right"', () => {
			const result = padBytes(new Uint8Array([1, 2]), { dir: 'right' })
			expect(result.length).toBe(32)
			expect(result[0]).toBe(1)
			expect(result[1]).toBe(2)
			expect(result[31]).toBe(0)
		})

		it('should pad to custom size', () => {
			const result = padBytes(new Uint8Array([1, 2]), { size: 4 })
			expect(result.length).toBe(4)
			expect(Array.from(result)).toEqual([0, 0, 1, 2])
		})

		it('should return unchanged bytes when size is null', () => {
			const bytes = new Uint8Array([1, 2])
			const result = padBytes(bytes, { size: null })
			expect(result).toBe(bytes)
		})

		it('should handle empty bytes', () => {
			const result = padBytes(new Uint8Array([]), { size: 4 })
			expect(result.length).toBe(4)
			expect(Array.from(result)).toEqual([0, 0, 0, 0])
		})

		it('should throw when bytes exceed target size', () => {
			expect(() => padBytes(new Uint8Array([1, 2, 3, 4]), { size: 2 })).toThrow(SizeExceedsPaddingSizeError)
		})

		it('should throw SizeExceedsPaddingSizeError with correct message', () => {
			try {
				padBytes(new Uint8Array([1, 2, 3, 4]), { size: 2 })
			} catch (e) {
				expect(e).toBeInstanceOf(SizeExceedsPaddingSizeError)
				expect((e as Error).message).toContain('4 bytes')
				expect((e as Error).message).toContain('2 bytes')
			}
		})
	})

	describe('pad (generic)', () => {
		it('should detect hex and use padHex', () => {
			expect(pad('0x1234', { size: 4 })).toBe('0x00001234')
		})

		it('should detect bytes and use padBytes', () => {
			const result = pad(new Uint8Array([1, 2]), { size: 4 })
			expect(Array.from(result)).toEqual([0, 0, 1, 2])
		})

		it('should use default options', () => {
			expect(pad('0x1234')).toBe('0x0000000000000000000000000000000000000000000000000000000000001234')

			const bytesResult = pad(new Uint8Array([1, 2]))
			expect(bytesResult.length).toBe(32)
		})

		it('should preserve type for hex input', () => {
			const result = pad('0x1234' as `0x${string}`, { size: 4 })
			// Result should be a string (Hex type)
			expect(typeof result).toBe('string')
		})

		it('should preserve type for bytes input', () => {
			const result = pad(new Uint8Array([1, 2]), { size: 4 })
			// Result should be a Uint8Array
			expect(result).toBeInstanceOf(Uint8Array)
		})
	})

	describe('SizeExceedsPaddingSizeError', () => {
		it('should have correct name', () => {
			const error = new SizeExceedsPaddingSizeError({ size: 4, targetSize: 2, type: 'hex' })
			expect(error.name).toBe('SizeExceedsPaddingSizeError')
		})

		it('should have descriptive message for hex type', () => {
			const error = new SizeExceedsPaddingSizeError({ size: 4, targetSize: 2, type: 'hex' })
			expect(error.message).toBe('Size of hex (4 bytes) exceeds target padding size (2 bytes).')
		})

		it('should have descriptive message for bytes type', () => {
			const error = new SizeExceedsPaddingSizeError({ size: 4, targetSize: 2, type: 'bytes' })
			expect(error.message).toBe('Size of bytes (4 bytes) exceeds target padding size (2 bytes).')
		})

		it('should be an instance of Error', () => {
			const error = new SizeExceedsPaddingSizeError({ size: 4, targetSize: 2, type: 'hex' })
			expect(error).toBeInstanceOf(Error)
		})
	})
})
