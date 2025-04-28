import { Effect } from 'effect'
import { describe, expect, it, vi } from 'vitest'
import { JsonRpcTransportEffectLive } from './JsonRpcTransportEffect.js'

describe('JsonRpcTransportEffect', () => {
	it('fromHttpEffect should create an HTTP transport', async () => {
		// Using a test URL
		const url = 'https://example.com'
		const transport = await Effect.runPromise(JsonRpcTransportEffectLive.fromHttpEffect(url))

		// Verify the transport has the expected properties
		expect(transport).toBeDefined()
		expect(typeof transport.request).toBe('function')
	})

	it('createEffect should create a custom transport', async () => {
		// Create a mock handler function
		const mockHandler = vi.fn().mockResolvedValue({ result: 'test' })

		// Create a custom transport with the mock handler
		const transport = await Effect.runPromise(JsonRpcTransportEffectLive.createEffect(mockHandler))

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

	it('should handle errors gracefully', async () => {
		// Create a mock handler that throws an error
		const mockError = new Error('Test error')
		const mockHandler = vi.fn().mockRejectedValue(mockError)

		// Create a custom transport with the mock handler
		const transport = await Effect.runPromise(JsonRpcTransportEffectLive.createEffect(mockHandler))

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
