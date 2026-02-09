import { Context } from 'effect'
import { describe, expect, it } from 'vitest'
import { BlockchainService } from './BlockchainService.js'

describe('BlockchainService', () => {
	describe('Context.Tag', () => {
		it('should be a Context.Tag', () => {
			expect(BlockchainService).toBeDefined()
			expect(typeof BlockchainService).toBe('object')
		})

		it('should have the correct tag identifier', () => {
			// Context.GenericTag creates a tag with an identifier
			const tag = BlockchainService as unknown as { key: string }
			expect(tag.key).toBe('@tevm/blockchain-effect/BlockchainService')
		})

		it('should be usable as a Context.Tag for Effect operations', () => {
			// Verify it can be used with Context.Tag operations
			expect(Context.isTag(BlockchainService)).toBe(true)
		})
	})
})
