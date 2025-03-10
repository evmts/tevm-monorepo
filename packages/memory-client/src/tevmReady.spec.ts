import { requestEip1193 } from '@tevm/decorators'
import { createTevmNode } from '@tevm/node'
import { type Client, createClient } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { TevmTransport } from './MemoryClient.js'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmReady } from './tevmReady.js'

let client: Client<TevmTransport>

beforeEach(async () => {
	const node = createTevmNode().extend(requestEip1193())
	client = createClient({
		transport: createTevmTransport(node),
	})
})

describe('tevmReady', () => {
	it('should assert that TEVM is ready', async () => {
		let isReady = await tevmReady(client)
		expect(isReady).toBe(true)
		isReady = await tevmReady(client)
		expect(isReady).toBe(true)
		isReady = await tevmReady(client)
		expect(isReady).toBe(true)
	})
})
