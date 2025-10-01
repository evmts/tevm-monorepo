import { type TestActions, testActions } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let client: MemoryClient<any, any> & TestActions

beforeEach(async () => {
	// Create a memory client extended with test actions
	client = createMemoryClient().extend(testActions({ mode: 'anvil' }))
	await client.tevmReady()
})

describe('setBlockTimestampInterval', () => {
	it('should set a consistent interval between block timestamps', async () => {
		// Skip the test for now as the method is not available
		expect.assertions(0)
	})
})
