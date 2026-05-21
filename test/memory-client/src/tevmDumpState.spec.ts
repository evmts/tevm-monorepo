import { optimism } from '@tevm/common'
import { createCachedOptimismTransport } from './cachedTransports.js'
import { type Client, createClient } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createTevmTransport } from '@tevm/memory-client'
import type { TevmTransport } from '@tevm/memory-client'
import { tevmDumpState } from '@tevm/memory-client'

let client: Client<TevmTransport>
const cachedTransport = createCachedOptimismTransport()

beforeEach(async () => {
	client = createClient({
		transport: createTevmTransport({
			fork: { transport: cachedTransport, blockTag: 142153711n },
		}),
		chain: optimism,
	})
})

describe('tevmDumpState', () => {
	it('should dump the state of the TEVM', async () => {
		const stateDump = await tevmDumpState(client)
		expect(stateDump).toMatchSnapshot()
	})
})
