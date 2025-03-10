// note: way more tests exist in the src/test folder
// This only tests this specific unit the src/test folder has more e2e tests and examples
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from './createMemoryClient.js'

describe('createMemoryClient', () => {
	it('should create a MemoryClient with default configuration', () => {
		const client = createMemoryClient()
		expect(client).toBeDefined()
		// tevm actions
		expect(client.tevmReady).toBeDefined()
		expect(client.tevmCall).toBeDefined()
		expect(client.tevmContract).toBeDefined()
		expect(client.tevmDeploy).toBeDefined()
		expect(client.tevmMine).toBeDefined()
		expect(client.tevmLoadState).toBeDefined()
		expect(client.tevmDumpState).toBeDefined()
		expect(client.tevmSetAccount).toBeDefined()
		expect(client.tevmGetAccount).toBeDefined()
		expect(client.getBlockNumber).toBeDefined()

		// public actions
		expect(client.getBalance).toBeDefined()
		expect(client.getChainId).toBeDefined()
		expect(client.readContract).toBeDefined()
		expect(client.estimateGas).toBeDefined()

		// wallet actions
		expect(client.sendTransaction).toBeDefined()
		expect(client.writeContract).toBeDefined()

		// test actions
		expect(client.setCode).toBeDefined()
		expect(client.setBalance).toBeDefined()
		expect(client.mine).toBeDefined()
	})

	it('should create a MemoryClient with custom options', () => {
		const customOptions = {
			name: 'CustomMemoryClient',
			key: 'customMemoryClient',
		}
		const client = createMemoryClient(customOptions)
		expect(client).toBeDefined()
		expect(client.tevmReady).toBeDefined()
		expect(client.tevmCall).toBeDefined()
		expect(client.tevmContract).toBeDefined()
		expect(client.tevmDeploy).toBeDefined()
		expect(client.tevmMine).toBeDefined()
		expect(client.tevmLoadState).toBeDefined()
		expect(client.tevmDumpState).toBeDefined()
		expect(client.tevmSetAccount).toBeDefined()
		expect(client.tevmGetAccount).toBeDefined()
		expect(client.getBlockNumber).toBeDefined()
		expect(client.sendTransaction).toBeDefined()
		expect(client.setBalance).toBeDefined()
	})
})
