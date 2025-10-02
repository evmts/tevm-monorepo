import { createWalletClient, http } from 'viem'
import { describe, expect, it } from 'vitest'
import { tevmViemExtensionOptimistic } from './tevmViemExtensionOptimistic.js'
// We don't need this import anymore
// import type { ViemTevmOptimisticClient } from './ViemTevmOptimisticClient.js'
import type { ViemTevmOptimisticClientDecorator } from './ViemTevmOptimisticClientDecorator.js'
import type { ViemTevmOptimisticExtension } from './ViemTevmOptimisticExtension.js'

describe('ViemTevmOptimisticClient', () => {
	it('should correctly type a client with tevmViemExtensionOptimistic', () => {
		// Define the extension function with the correct type
		const extension: ViemTevmOptimisticExtension = tevmViemExtensionOptimistic

		// Create the decorator with the correct type
		const decorator: ViemTevmOptimisticClientDecorator = extension()

		// Create a mock wallet client that we can extend
		const mockClient = createWalletClient({
			transport: http('https://example.com'),
			account: '0x0000000000000000000000000000000000000000',
		})

		// Apply the extension to the client
		const extendedClient = mockClient.extend(decorator)

		// Runtime type checking instead of static type assertion

		// Runtime check that the tevm property exists
		expect(extendedClient.tevm).toBeDefined()
		expect(typeof extendedClient.tevm.writeContractOptimistic).toBe('function')
	})
})
