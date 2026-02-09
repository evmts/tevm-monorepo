import { Context } from 'effect'
import { describe, expect, it } from 'vitest'
import { BlockParamsService } from './BlockParamsService.js'

describe('BlockParamsService', () => {
	it('should be defined', () => {
		expect(BlockParamsService).toBeDefined()
	})

	it('should be a Context.Tag', () => {
		expect(typeof BlockParamsService).toBe('object')
		expect(Context.isTag(BlockParamsService)).toBe(true)
	})

	it('should have the correct key', () => {
		// @ts-expect-error - accessing internal key
		expect(BlockParamsService.key).toBe('@tevm/node-effect/BlockParamsService')
	})
})
