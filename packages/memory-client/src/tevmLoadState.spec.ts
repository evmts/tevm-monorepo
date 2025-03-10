import { optimism } from '@tevm/common'
import { requestEip1193 } from '@tevm/decorators'
import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { type Client, createClient } from 'viem'
import { parseEther } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { TevmTransport } from './TevmTransport.js'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmDumpState } from './tevmDumpState.js'
import { tevmGetAccount } from './tevmGetAccount.js'
import { tevmLoadState } from './tevmLoadState.js'
import { tevmSetAccount } from './tevmSetAccount.js'

let client: Client<TevmTransport>
const testAddress = `0x${'69'.repeat(20)}` as const

beforeEach(async () => {
	const node = createTevmNode({
		fork: { transport: transports.optimism },
	}).extend(requestEip1193())
	
	client = createClient({
		transport: createTevmTransport(node),
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
		const node = createTevmNode({
			fork: { transport: transports.optimism },
		}).extend(requestEip1193())
		
		const newClient = createClient({
			transport: createTevmTransport(node),
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
