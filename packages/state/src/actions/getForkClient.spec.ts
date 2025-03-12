import { http } from 'viem'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { NoForkError, getForkClient } from './getForkClient.js'

describe(getForkClient.name, () => {
	it('should return a fork client with transport function', () => {
		const state = createBaseState({
			fork: {
				transport: http('https://example.com'),
			},
		})

		const client = getForkClient(state)
		expect(client).toBeDefined()
		expect(client.transport.type).toBe('tevm')
	})

	it('should return a fork client with transport object', () => {
		const mockTransport = {
			request: async () => ({ result: 'mock' }),
		}

		const state = createBaseState({
			fork: {
				transport: mockTransport as any,
			},
		})

		const client = getForkClient(state)
		expect(client).toBeDefined()
		expect(client.transport.type).toBe('tevm')
	})

	it('should error if no fork config', () => {
		const state = createBaseState({})
		expect(() => getForkClient(state)).toThrowErrorMatchingInlineSnapshot(
			'[NoForkError: Cannot initialize a client with no fork url set]',
		)

		// Also verify the custom error properties
		try {
			getForkClient(state)
		} catch (error) {
			expect(error).toBeInstanceOf(NoForkError)
			expect((error as any).name).toBe('NoForkError')
			expect((error as any)._tag).toBe('NoForkError')
		}
	})
})
