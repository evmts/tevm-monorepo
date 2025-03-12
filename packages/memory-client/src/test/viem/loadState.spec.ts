import { optimism } from '@tevm/common'
import { SimpleContract } from '@tevm/contract'
import { transports } from '@tevm/test-utils'
import { parseEther } from 'viem'
import { createClient } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { MemoryClient } from '../../MemoryClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'
import { createTevmTransport } from '../../createTevmTransport.js'
import { tevmDumpState } from '../../tevmDumpState.js'
import { tevmLoadState } from '../../tevmLoadState.js'
import { tevmSetAccount } from '../../tevmSetAccount.js'

let mc: MemoryClient
const testAddress = `0x${'69'.repeat(20)}` as const

beforeEach(async () => {
	mc = createMemoryClient()
	await mc.tevmReady()
})

describe('loadState', () => {
	it('should load a previously dumped state', async () => {
		// Set an account with a specific balance and nonce
		await mc.tevmSetAccount({
			address: testAddress,
			balance: parseEther('1234'),
			nonce: 5n,
		})

		// Dump the state
		const dumpedState = await mc.tevmDumpState()

		// Create a new client
		const newClient = createMemoryClient()
		await newClient.tevmReady()

		// Load the dumped state into the new client
		const result = await newClient.tevmLoadState(dumpedState)

		// Verify load was successful
		expect(result).toBeDefined()
		expect(result.success).toBe(true)

		// Verify the account information in the new client
		const accountInfo = await newClient.tevmGetAccount({ address: testAddress })
		expect(accountInfo).toBeDefined()
		expect(accountInfo.balance).toBe(parseEther('1234'))
		expect(accountInfo.nonce).toBe(5n)
	})

	it('should work with traditional client API', async () => {
		// Create a standard client
		const client = createClient({
			transport: createTevmTransport({
				fork: { transport: transports.optimism },
			}),
			chain: optimism,
		})

		// Set an account with a specific balance and nonce
		await tevmSetAccount(client, {
			address: testAddress,
			balance: parseEther('1234'),
			nonce: 5n,
		})

		// Dump the state
		const dumpedState = await tevmDumpState(client)

		// Create a new client
		const newClient = createClient({
			transport: createTevmTransport({}),
			chain: optimism,
		})

		// Load the dumped state into the new client
		const result = await tevmLoadState(newClient, dumpedState)

		// Verify load was successful
		expect(result).toBeDefined()
		expect(result.success).toBe(true)
	})
})
