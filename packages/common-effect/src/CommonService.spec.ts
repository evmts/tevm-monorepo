import { Context } from 'effect'
import { describe, expect, it } from 'vitest'
import { CommonService } from './CommonService.js'

describe('CommonService', () => {
	describe('Context.Tag', () => {
		it('should be a valid Context.Tag', () => {
			expect(CommonService).toBeDefined()
			expect(typeof CommonService).toBe('object')
		})

		it('should have the correct tag key', () => {
			// Context.GenericTag creates a tag with an identifier
			expect(CommonService.key).toBe('@tevm/common-effect/CommonService')
		})

		it('should be usable with Context.get', () => {
			// Create a mock context with the service
			const mockShape = {
				common: { ethjsCommon: {} } as any,
				chainId: 1,
				hardfork: 'prague' as const,
				eips: [1559],
				copy: () => ({ ethjsCommon: {} }) as any,
			}

			const context = Context.make(CommonService, mockShape)
			const retrieved = Context.get(context, CommonService)

			expect(retrieved).toBe(mockShape)
			expect(retrieved.chainId).toBe(1)
			expect(retrieved.hardfork).toBe('prague')
		})
	})
})
