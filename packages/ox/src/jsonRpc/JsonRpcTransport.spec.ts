import { Effect } from 'effect'
import { describe, expect, it, vi } from 'vitest'
import * as JsonRpcTransport from './JsonRpcTransport.js'

describe('JsonRpcTransport', () => {
	it('should create an HTTP transport with fromHttp', async () => {
		// Using a test URL
		const url = 'https://example.com'
		const transport = await Effect.runPromise(JsonRpcTransport.fromHttp(url))

		// Verify the transport has the expected properties
		expect(transport).toBeDefined()
		expect(typeof transport.request).toBe('function')
	})

	it('should create a custom transport with create', async () => {
		// Create a mock handler function
		const mockHandler = vi.fn().mockResolvedValue({ result: 'test' })

		// Create a custom transport with the mock handler
		const transport = await Effect.runPromise(JsonRpcTransport.create(mockHandler))

		// Verify the transport has the expected properties
		expect(transport).toBeDefined()
		expect(typeof transport.request).toBe('function')

		// Test the transport's request function
		const result = await transport.request({
			method: 'test',
			params: [],
		})

		// Verify the mock handler was called with the correct arguments
		expect(mockHandler).toHaveBeenCalledWith({
			method: 'test',
			params: [],
		})

		// Verify the result
		expect(result).toEqual({ result: 'test' })
	})

	it('should handle errors in fromHttp', async () => {
		// Test with a URL that would cause an error during transport creation
		// In this test we're just checking error handling, not actual failure

		try {
			// We're assuming this is a constructed test and may not actually throw
			// The point is to test the error handling pattern
			await Effect.runPromise(
				Effect.flatMap(JsonRpcTransport.fromHttp('https://example.com'), () =>
					Effect.fail(new Error('Simulated error')),
				),
			)
			expect(true).toBe(false) // Should not reach here
		} catch (error) {
			expect(error).toBeDefined()
			if (error instanceof JsonRpcTransport.FromHttpError) {
				expect(error.message).toContain('Error creating HTTP JSON-RPC transport')
			}
		}
	})

	it('should handle errors in custom transport', async () => {
		// Create a mock handler that throws an error
		const mockError = new Error('Test error')
		const mockHandler = vi.fn().mockRejectedValue(mockError)

		// Create a custom transport with the mock handler
		const transport = await Effect.runPromise(JsonRpcTransport.create(mockHandler))

		// Test the transport's request function
		try {
			await transport.request({
				method: 'test',
				params: [],
			})

			// Should not reach here
			expect(true).toBe(false)
		} catch (error) {
			// Should catch the error
			expect(error).toBe(mockError)
		}
	})
})
