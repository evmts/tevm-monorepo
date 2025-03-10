import { type Client, createClient } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { TevmTransport } from './TevmTransport.js'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmReady } from './tevmReady.js'

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
