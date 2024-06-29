import { describe, expect, it, beforeEach } from 'bun:test'
import { createClient, type Client } from 'viem'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmReady } from './tevmReady.js'
import type { TevmTransport } from './TevmTransport.js'

let client: Client<TevmTransport>

beforeEach(async () => {
	client = createClient({
		transport: createTevmTransport(),
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
