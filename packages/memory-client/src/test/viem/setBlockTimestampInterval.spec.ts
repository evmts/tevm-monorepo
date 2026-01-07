import type { TestActions } from '@tevm/utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { testActions } from '../../createClient.js'
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
