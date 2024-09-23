import { describe, expect, it } from 'vitest'
import { generateRandomId } from './generateRandomId.js'

describe('generateRandomId', () => {
	it('should generate a valid hex string of length 34', () => {
		const id = generateRandomId()
		expect(id).toMatch(/^0x[a-f0-9]{32}$/)
	})

	it('should generate different ids on multiple calls', () => {
		const id1 = generateRandomId()
		const id2 = generateRandomId()
		expect(id1).not.toBe(id2)
	})
})
