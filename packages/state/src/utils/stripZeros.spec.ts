import { InternalError } from '@tevm/errors'
import { describe, expect, it } from 'vitest'
import { stripZeros } from './stripZeros.js'

describe('stripZeros', () => {
	it('should strip leading zeros from the Uint8Array', () => {
		const input = new Uint8Array([0, 0, 0, 1, 2, 3])
		const expected = new Uint8Array([1, 2, 3])
		expect(stripZeros(input)).toEqual(expected)
	})

	it('should return the same array if there are no leading zeros', () => {
		const input = new Uint8Array([1, 2, 3])
		expect(stripZeros(input)).toEqual(input)
	})

	it('should return an 1 0 if all elements are zero', () => {
		const input = new Uint8Array([0, 0, 0])
		const expected = new Uint8Array([0])
		expect(stripZeros(input)).toEqual(expected)
	})

	it('should return an empty array if the input is already empty', () => {
		const input = new Uint8Array([])
		const expected = new Uint8Array([])
		expect(stripZeros(input)).toEqual(expected)
	})

	it('should throw an InternalError if the input is not a Uint8Array', () => {
		expect(() => stripZeros({} as any)).toThrow(InternalError)
		expect(() => stripZeros('string' as any)).toThrow(InternalError)
		expect(() => stripZeros(123 as any)).toThrow(InternalError)
	})
})
