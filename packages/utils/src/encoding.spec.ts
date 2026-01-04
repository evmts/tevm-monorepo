import { describe, expect, it } from 'vitest'
import { KeyEncoding, ValueEncoding } from './encoding.js'

describe('KeyEncoding', () => {
	it('should have String encoding', () => {
		expect(KeyEncoding.String).toBe('string')
	})

	it('should have Bytes encoding', () => {
		expect(KeyEncoding.Bytes).toBe('view')
	})

	it('should have Number encoding', () => {
		expect(KeyEncoding.Number).toBe('number')
	})

	it('should have exactly 3 encoding types', () => {
		expect(Object.keys(KeyEncoding)).toHaveLength(3)
	})
})

describe('ValueEncoding', () => {
	it('should have String encoding', () => {
		expect(ValueEncoding.String).toBe('string')
	})

	it('should have Bytes encoding', () => {
		expect(ValueEncoding.Bytes).toBe('view')
	})

	it('should have JSON encoding', () => {
		expect(ValueEncoding.JSON).toBe('json')
	})

	it('should have exactly 3 encoding types', () => {
		expect(Object.keys(ValueEncoding)).toHaveLength(3)
	})
})
