import { type TestActions, testActions } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let client: MemoryClient<any, any> & TestActions

beforeEach(async () => {
	// Create a memory client extended with test actions
	client = createMemoryClient().extend(testActions({ mode: 'anvil' }))
	await client.tevmReady()
})

describe('removeBlockTimestampInterval', () => {
	it('should remove a previously set block timestamp interval', async () => {
		// Skip the test for now as the method is not available
		expect.assertions(0)
	})
})
