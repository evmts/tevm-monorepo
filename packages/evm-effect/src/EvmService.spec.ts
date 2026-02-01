import { describe, it, expect } from 'vitest'
import { Context } from 'effect'
import { EvmService } from './EvmService.js'

describe('EvmService', () => {
	it('should be defined', () => {
		expect(EvmService).toBeDefined()
	})

	it('should be a Context.Tag', () => {
		expect(typeof EvmService).toBe('object')
	})

	it('should have the correct key', () => {
		expect(Context.isTag(EvmService)).toBe(true)
	})
})
