import { describe, expect, it } from 'vitest'
import { FilterService } from './FilterService.js'

describe('FilterService', () => {
	it('should be a Context.Tag', () => {
		expect(FilterService).toBeDefined()
		expect(FilterService.key).toBe('@tevm/node-effect/FilterService')
	})

	it('should have a unique identifier', () => {
		expect(typeof FilterService.key).toBe('string')
	})

	it('should be usable as a type tag', () => {
		// Type-level test - if this compiles, it works
		const _tag: typeof FilterService = FilterService
		expect(_tag).toBe(FilterService)
	})
})
