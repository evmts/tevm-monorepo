import { describe, expect, it, beforeEach } from 'bun:test'
import { createClient, type Client } from 'viem'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmSetAccount } from './tevmSetAccount.js'
import { tevmGetAccount } from './tevmGetAccount.js'
import type { TevmTransport } from './TevmTransport.js'
import { numberToHex } from '@tevm/utils'

let client: Client<TevmTransport>

const address = `0x${'69'.repeat(20)}` as const
const balance = 1000n
const nonce = 1n
const deployedBytecode = '0x6003600501'
const state = {
	['0x' + '0'.repeat(64)]: numberToHex(42n),
}

beforeEach(async () => {
	client = createClient({
		transport: createTevmTransport(),
	})
})

describe('tevmSetAccount', () => {
	it('should set various account fields', async () => {
		// Set the account fields
		await tevmSetAccount(client, {
			address,
			balance,
			nonce,
			deployedBytecode,
			state,
		})

		// Retrieve the account and verify the fields
		const account = await tevmGetAccount(client, { address, returnStorage: true })
		expect(account.address).toBe(address)
		expect(account.balance).toBe(balance)
		expect(account.nonce).toBe(nonce)
		expect(account.deployedBytecode).toBe(deployedBytecode)
		expect(account.storage).toEqual(state)
	})
})
