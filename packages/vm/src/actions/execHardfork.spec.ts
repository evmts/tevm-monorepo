import { describe, expect, it } from 'vitest'
import type { Hardfork } from '@tevm/common'
import { execHardfork } from './execHardfork.js'

describe('execHardfork', () => {
	it('should return the same hardfork if it is not "paris"', () => {
		const hardfork: Hardfork = 'london'
		const preMergeHf: Hardfork = 'berlin'
		const result = execHardfork(hardfork, preMergeHf)
		expect(result).toBe(hardfork)
	})

	it('should return the preMergeHf if the hardfork is "paris"', () => {
		const hardfork: Hardfork = 'paris'
		const preMergeHf: Hardfork = 'berlin'
		const result = execHardfork(hardfork, preMergeHf)
		expect(result).toBe(preMergeHf)
	})

	it('should handle strings correctly if hardfork is not "paris"', () => {
		const hardfork: Hardfork = 'istanbul'
		const preMergeHf: Hardfork = 'berlin'
		const result = execHardfork(hardfork, preMergeHf)
		expect(result).toBe(hardfork)
	})

	it('should handle strings correctly if hardfork is "paris"', () => {
		const hardfork: Hardfork = 'paris'
		const preMergeHf: Hardfork = 'berlin'
		const result = execHardfork(hardfork, preMergeHf)
		expect(result).toBe(preMergeHf)
	})

	it('should return the preMergeHf if the hardfork is "paris" even if preMergeHf is a string', () => {
		const hardfork: Hardfork = 'paris'
		const preMergeHf: Hardfork = 'berlin'
		const result = execHardfork(hardfork, preMergeHf)
		expect(result).toBe(preMergeHf)
	})

	it('should return the hardfork if it is not "paris" even if preMergeHf is a string', () => {
		const hardfork: Hardfork = 'london'
		const preMergeHf: Hardfork = 'berlin'
		const result = execHardfork(hardfork, preMergeHf)
		expect(result).toBe(hardfork)
	})

	it('should handle strings correctly if hardfork is "paris" and preMergeHf is a string', () => {
		const hardfork: Hardfork = 'paris'
		const preMergeHf: Hardfork = 'berlin'
		const result = execHardfork(hardfork, preMergeHf)
		expect(result).toBe(preMergeHf)
	})
})
