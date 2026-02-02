import { describe, it, expect } from 'vitest'
import { Context } from 'effect'
import { VmService } from './VmService.js'

describe('VmService', () => {
	it('should be defined', () => {
		expect(VmService).toBeDefined()
	})

	it('should be a Context.Tag', () => {
		expect(typeof VmService).toBe('object')
	})

	it('should have the correct key', () => {
		expect(Context.isTag(VmService)).toBe(true)
	})
})
