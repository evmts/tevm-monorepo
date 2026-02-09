import { Context } from 'effect'
import { describe, expect, it } from 'vitest'
import { StateManagerService } from './StateManagerService.js'

describe('StateManagerService', () => {
	it('should be defined', () => {
		expect(StateManagerService).toBeDefined()
	})

	it('should be a Context.Tag', () => {
		// Context.GenericTag creates an object that acts as a Context.Tag
		expect(typeof StateManagerService).toBe('object')
	})

	it('should have the correct key', () => {
		// The key should be 'StateManagerService'
		expect(Context.isTag(StateManagerService)).toBe(true)
	})
})
