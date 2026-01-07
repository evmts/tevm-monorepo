import { nativeHttp } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getForkClient, NoForkError } from './getForkClient.js'

describe(getForkClient.name, () => {
	it('should return a fork client with transport function', () => {
		const state = createBaseState({
			fork: {
				transport: nativeHttp('https://example.com'),
			},
		})

		const client = getForkClient(state)
		expect(client).toBeDefined()
		// Verify the client has the expected methods
		expect(typeof client.getBytecode).toBe('function')
		expect(typeof client.getStorageAt).toBe('function')
		expect(typeof client.getProof).toBe('function')
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
		// Verify the client has the expected methods
		expect(typeof client.getBytecode).toBe('function')
		expect(typeof client.getStorageAt).toBe('function')
		expect(typeof client.getProof).toBe('function')
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
