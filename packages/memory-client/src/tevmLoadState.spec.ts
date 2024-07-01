import { describe, expect, it, beforeEach } from 'bun:test'
import { createClient, type Client } from 'viem'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmSetAccount } from './tevmSetAccount.js'
import { tevmDumpState } from './tevmDumpState.js'
import { tevmLoadState } from './tevmLoadState.js'
import { tevmGetAccount } from './tevmGetAccount.js'
import { transports } from '@tevm/test-utils'
import { optimism } from '@tevm/common'
import type { TevmTransport } from './TevmTransport.js'
import { parseEther } from 'viem'

let client: Client<TevmTransport>
const testAddress = `0x${'69'.repeat(20)}` as const

beforeEach(async () => {
	client = createClient({
		transport: createTevmTransport({
			fork: { transport: transports.optimism },
		}),
		chain: optimism,
	})
})

describe('tevmLoadState', () => {
	it('should load a previously dumped state into a new client', async () => {
		// Set an account with a specific nonce and balance
		await tevmSetAccount(client, {
			address: testAddress,
			balance: parseEther('1234'),
			nonce: 5n,
		})

		// Dump the state
		const dumpedState = await tevmDumpState(client)

		// Initialize a new client
		const newClient = createClient({
			transport: createTevmTransport({
				fork: { transport: transports.optimism },
			}),
			chain: optimism,
		})

		// Load the dumped state into the new client
		await tevmLoadState(newClient, dumpedState)

		// Verify the account information in the new client
		const accountInfo = await tevmGetAccount(newClient, { address: testAddress })
		expect(accountInfo).toBeDefined()
		expect(accountInfo.balance).toBe(parseEther('1234'))
		expect(accountInfo.nonce).toBe(5n)
	})
})
