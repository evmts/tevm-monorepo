import { describe, it, expect } from 'vitest'
import { Context } from 'effect'
import { ImpersonationService } from './ImpersonationService.js'

describe('ImpersonationService', () => {
	it('should be defined', () => {
		expect(ImpersonationService).toBeDefined()
	})

	it('should be a Context.Tag', () => {
		expect(typeof ImpersonationService).toBe('object')
		expect(Context.isTag(ImpersonationService)).toBe(true)
	})

	it('should have the correct key', () => {
		// @ts-expect-error - accessing internal key
		expect(ImpersonationService.key).toBe('@tevm/node-effect/ImpersonationService')
	})
})
