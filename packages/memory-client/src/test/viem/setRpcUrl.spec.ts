import { beforeEach, describe, expect, it } from 'bun:test'
import { type TestActions, testActions } from 'viem'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'

let mc: MemoryClient & TestActions

beforeEach(async () => {
	mc = createMemoryClient().extend(testActions({ mode: 'anvil' }))
})

describe('setRpcUrl', () => {
	it('should throw an error', async () => {
		const e = await mc
			.setRpcUrl('https://')
			.catch((e) => e)
			.then((res) => {
				if (res instanceof Error) return res
				throw new Error('should have thrown')
			})
		expect(e).toMatchSnapshot()
	})
})
