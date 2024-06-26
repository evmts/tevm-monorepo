import { beforeEach, describe, expect, it } from 'bun:test'
import { type TestActions, testActions } from 'viem'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient<any, any> & TestActions

beforeEach(async () => {
	mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
})

describe('setNextBlockTimestamp', () => {
	it.todo('should work as expected', async () => {
		await mc.setNextBlockTimestamp({ timestamp: 420n })
		expect(undefined).toBeUndefined()
	})
})
