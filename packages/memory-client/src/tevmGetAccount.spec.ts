import { describe, expect, it, beforeEach } from 'bun:test'
import { createClient, type Client } from 'viem'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmGetAccount } from './tevmGetAccount.js'
import { transports } from '@tevm/test-utils'
import { optimism } from '@tevm/common'
import type { TevmTransport } from './TevmTransport.js'
import { parseEther } from 'viem'

let client: Client<TevmTransport>
const prefundedAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

beforeEach(async () => {
	client = createClient({
		transport: createTevmTransport({
			fork: { transport: transports.optimism },
		}),
		chain: optimism,
	})
})

describe('tevmGetAccount', () => {
	it('should get the account information for a prefunded address', async () => {
		const account = await tevmGetAccount(client, { address: prefundedAddress })
		expect(account).toBeDefined()
		expect(account.balance).toBe(parseEther('1000'))
		expect(account.nonce).toBe(0n)
		expect(account).toMatchSnapshot()
	})
})
