import { describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'

describe('call', () => {
	it('should work', async () => {
		const client = createMemoryClient()
		await client.tevmReady()
		// Simple test to avoid empty test suite error
		expect(client).toBeDefined()
	})
})
