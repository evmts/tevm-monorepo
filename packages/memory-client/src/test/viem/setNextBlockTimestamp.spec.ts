import { beforeEach, describe, expect, it } from 'bun:test'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'
import { testActions, type TestActions } from 'viem'

let mc: MemoryClient & TestActions

beforeEach(async () => {
	mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
})

describe('setNextBlockTimestamp', () => {
	it.todo('should work as expected', async () => {
		await mc.setNextBlockTimestamp({ timestamp: 420n })
		expect(undefined).toBeUndefined()
	})
})
