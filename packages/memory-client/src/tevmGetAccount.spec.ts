import { optimism } from '@tevm/common'
import { requestEip1193 } from '@tevm/decorators'
import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { type Client, createClient } from 'viem'
import { parseEther } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { TevmTransport } from './MemoryClient.js'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmGetAccount } from './tevmGetAccount.js'

let client: Client<TevmTransport>
const prefundedAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

beforeEach(async () => {
	const node = createTevmNode({
		fork: { transport: transports.optimism },
	}).extend(requestEip1193())

	client = createClient({
		transport: createTevmTransport(node),
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
