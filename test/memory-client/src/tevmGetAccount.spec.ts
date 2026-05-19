import { optimism } from '@tevm/common'
import { createCachedOptimismTransport } from './cachedTransports.js'
import { type Client, createClient, parseEther } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createTevmTransport } from '@tevm/memory-client'
import type { TevmTransport } from '@tevm/memory-client'
import { tevmGetAccount } from '@tevm/memory-client'

let client: Client<TevmTransport>
const prefundedAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

beforeEach(async () => {
	const cachedTransport = createCachedOptimismTransport()
	client = createClient({
		transport: createTevmTransport({
			fork: { transport: cachedTransport, blockTag: 142153711n },
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
