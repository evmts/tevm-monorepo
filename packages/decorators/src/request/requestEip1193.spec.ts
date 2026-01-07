import { describe, expect, it, vi } from 'vitest'
import { requestEip1193 } from './requestEip1193.js'

// Mock the external modules that are imported in requestEip1193.js
vi.mock('@tevm/actions', () => ({
	requestProcedure: vi.fn().mockImplementation(() => (request: any) => {
		// If mocking for error test
		if (request.method === 'error_method') {
			return Promise.resolve({ error: { code: -32000, message: 'Error message' } })
		}
		// Return successful response with the request for verification
		return Promise.resolve({ result: 'success', request })
	}),
}))

vi.mock('viem', () => ({
	withRetry: vi.fn().mockImplementation((fn, _options) => fn()),
}))

describe('requestEip1193', () => {
	it('should add request method to client', () => {
		const mockClient = {
			ready: async () => {},
			logger: { debug: () => {} },
		} as any
		const extended = requestEip1193()(mockClient)
		expect(extended).toHaveProperty('request')
		expect(typeof extended.request).toBe('function')
	})

	it('should format request properly', async () => {
		const mockClient = {
			ready: async () => {},
			logger: { debug: () => {} },
		} as any

		const extended = requestEip1193()(mockClient)

		const result = await (extended.request as any)({
			method: 'test_method',
			params: ['param1', 'param2'],
		})

		// We're checking the mocked import's behavior, not internal function calls
		expect(result).toBe('success')
	})

	it('should handle requests without params', async () => {
		const mockClient = {
			ready: async () => {},
			logger: { debug: () => {} },
		} as any

		const extended = requestEip1193()(mockClient)

		const result = await (extended.request as any)({
			method: 'test_method',
		})

		expect(result).toBe('success')
	})

	it('should throw error if response contains error', async () => {
		const mockClient = {
			ready: async () => {},
			logger: { debug: () => {} },
		} as any

		const extended = requestEip1193()(mockClient)

		await expect(
			(extended.request as any)({
				method: 'error_method',
			}),
		).rejects.toEqual({ code: -32000, message: 'Error message' })
	})
})
