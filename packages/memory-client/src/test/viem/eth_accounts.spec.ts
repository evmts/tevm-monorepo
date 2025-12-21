import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryClient } from '../../createMemoryClient.js'
import type { MemoryClient } from '../../MemoryClient.js'

let mc: MemoryClient<any, any>

beforeEach(async () => {
	mc = createMemoryClient()
})

describe('eth_accounts', () => {
	it('should return the prefunded test accounts via JSON-RPC', async () => {
		// @ts-expect-error - eth_accounts is not in the current type definitions
		const accounts = await mc.request({ method: 'eth_accounts' })
		expect(accounts).toBeDefined()
		expect(Array.isArray(accounts)).toBe(true)
		expect(accounts.length).toBe(10)
		// First account should be the standard test account
		expect(accounts[0].toLowerCase()).toBe('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
	})
})
