import { Context } from 'effect'
import { describe, expect, it } from 'vitest'
import { GetAccountService } from './GetAccountService.js'

describe('GetAccountService', () => {
	it('should be a Context.Tag', () => {
		expect(GetAccountService).toBeDefined()
		expect(typeof GetAccountService).toBe('object')
	})

	it('should have the correct service identifier', () => {
		// Access the key from the Tag
		expect(GetAccountService.key).toBe('@tevm/actions-effect/GetAccountService')
	})

	it('should be usable as a Context.Tag for dependency injection', () => {
		// Verify the tag can be used to create context
		const mockService = {
			getAccount: () => {
				throw new Error('mock')
			},
		}
		const context = Context.make(GetAccountService, mockService)
		expect(Context.get(context, GetAccountService)).toBe(mockService)
	})
})
