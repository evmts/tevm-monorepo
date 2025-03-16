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

	it('should always start with 0x prefix', () => {
		for (let i = 0; i < 10; i++) {
			expect(generateRandomId().startsWith('0x')).toBe(true)
		}
	})

	it('should maintain consistent length across multiple generations', () => {
		const ids = Array.from({ length: 5 }, () => generateRandomId())
		ids.forEach(id => {
			expect(id.length).toBe(34) // 0x + 32 chars
		})
	})
})
