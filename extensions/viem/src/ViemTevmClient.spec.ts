import { http, createPublicClient } from 'viem'
import { describe, expect, it } from 'vitest'
import type { ViemTevmClient } from './ViemTevmClient.js'
import type { ViemTevmClientDecorator } from './ViemTevmClientDecorator.js'
import { tevmViemExtension } from './tevmViemExtension.js'

describe('ViemTevmClient', () => {
	it('should correctly type a client with tevmViemExtension', () => {
		// This test validates the type definitions by checking
		// that the extension creates an object with the expected structure
		const extension: ViemTevmClientDecorator = tevmViemExtension()

		// Create a mock client that we can extend
		const mockClient = createPublicClient({
			transport: http('https://example.com'),
		})

		// Apply the extension to the client
		const extendedClient = mockClient.extend(extension)

		// Type assertion - if this compiles, the types are correct
		const _clientType: ViemTevmClient = extendedClient

		// Runtime check that the tevm property exists
		expect(extendedClient.tevm).toBeDefined()
		expect(extendedClient.tevm.request).toBeDefined()
		expect(extendedClient.tevm.eth).toBeDefined()
		expect(extendedClient.tevm.accounts).toBeDefined()
	})
})
