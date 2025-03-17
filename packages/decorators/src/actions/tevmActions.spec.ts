import { describe, expect, it, vi } from 'vitest'
import { tevmActions } from './tevmActions.js'

// Mock the handlers from @tevm/actions
vi.mock('@tevm/actions', () => {
	const createMockHandler = (name: string) => {
		return vi.fn().mockImplementation((_client: any) => {
			return function mockHandler() {
				return `${name} result`
			}
		})
	}

	return {
		loadStateHandler: createMockHandler('loadState'),
		dumpStateHandler: createMockHandler('dumpState'),
		contractHandler: createMockHandler('contract'),
		callHandler: createMockHandler('call'),
		setAccountHandler: createMockHandler('setAccount'),
		getAccountHandler: createMockHandler('getAccount'),
		mineHandler: createMockHandler('mine'),
		deployHandler: createMockHandler('deploy'),
		dealHandler: createMockHandler('deal'),
		simulateCallHandler: createMockHandler('simulateCall'),
	}
})

describe('tevmActions', () => {
	it('should add all tevm actions to client through extension', () => {
		// Create a client with proper extension implementation
		const mockClient = {
			extend: function (extender: any) {
				// Apply the extender to this client
				const extension = extender(this)
				// Return a new client with the extension's properties
				return { ...this, ...extension }
			},
			ready: async () => {},
			logger: { debug: () => {} },
		} as any

		// Apply tevmActions to the mock client
		const extended = tevmActions()(mockClient)

		// Check that the client now has all expected methods
		expect(extended).toHaveProperty('loadState')
		expect(extended).toHaveProperty('dumpState')
		expect(extended).toHaveProperty('contract')
		expect(extended).toHaveProperty('call')
		expect(extended).toHaveProperty('setAccount')
		expect(extended).toHaveProperty('getAccount')
		expect(extended).toHaveProperty('mine')
		expect(extended).toHaveProperty('deploy')
		expect(extended).toHaveProperty('deal')
		expect(extended).toHaveProperty('simulateCall')
	})

	it('should chain extensions correctly', () => {
		// Create a simpler mock client to test the extension chaining
		const extensionCalls: string[] = []

		const mockClient = {
			extend: function (extender: any) {
				// Keep track of which extension was called
				const extension = extender(this)
				// Extract the properties added by the extender to track order
				const props = Object.keys(extension)
				if (props.length > 0 && props[0]) {
					extensionCalls.push(props[0])
				}

				// Return a new client with the new property
				return { ...this, ...extension }
			},
			ready: async () => {},
			logger: { debug: () => {} },
		} as any

		// Apply tevmActions
		tevmActions()(mockClient)

		// Verify that extensions were called in the correct order
		expect(extensionCalls).toEqual([
			'loadState',
			'dumpState',
			'contract',
			'call',
			'setAccount',
			'getAccount',
			'mine',
			'deploy',
			'deal',
			'simulateCall',
		])
	})

	it('should return methods that call the handlers with the client', () => {
		const mockClient = {
			extend: function (extender: any) {
				return { ...this, ...extender(this) }
			},
			ready: async () => {},
			logger: { debug: () => {} },
		} as any

		const extended = tevmActions()(mockClient)

		// Call one of the methods to verify it uses the handler correctly
		const result = extended.getAccount({ address: '0x123' })
		expect(result).toBe('getAccount result')
	})
})