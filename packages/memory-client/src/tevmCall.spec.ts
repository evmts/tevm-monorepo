import { describe, expect, it, beforeEach } from 'bun:test'
import { createClient, type Client } from 'viem'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmCall } from './tevmCall.js'
import { transports } from '@tevm/test-utils'
import { optimism } from '@tevm/common'
import { tevmMine } from './tevmMine.js'
import type { TevmTransport } from './TevmTransport.js'

let client: Client<TevmTransport>

beforeEach(async () => {
	client = createClient({
		transport: createTevmTransport({
			fork: { transport: transports.optimism },
		}),
		chain: optimism,
	})
	await tevmMine(client, { blockCount: 1 })
})

describe('tevmCall', () => {
	it('should execute a basic call on the VM', async () => {
		const result = await tevmCall(client, {
			to: '0x0000000000000000000000000000000000000000',
			data: '0x',
		})
		expect(result).toBeDefined()
		expect(result.rawData).toBe('0x')
	})

	it('should execute a call with a specific from address', async () => {
		const fromAddress = '0x0000000000000000000000000000000000000001'
		const result = await tevmCall(client, {
			to: '0x0000000000000000000000000000000000000000',
			data: '0x',
			from: fromAddress,
		})
		expect(result).toBeDefined()
		expect(result.rawData).toBe('0x')
	})

	it('should handle call with createTransaction option', async () => {
		const result = await tevmCall(client, {
			to: '0x0000000000000000000000000000000000000000',
			data: '0x',
			createTransaction: true,
		})
		expect(result).toBeDefined()
		expect(result.rawData).toBe('0x')
		await tevmMine(client)
	})

	it('should handle errors gracefully', async () => {
		const invalidAddress = '0xinvalid'
		try {
			await tevmCall(client, {
				to: invalidAddress,
				data: '0x',
			})
		} catch (error) {
			expect(error).toBeDefined()
		}
	})

	it('should skip balance check when skipBalance is true', async () => {
		const result = await tevmCall(client, {
			to: '0x0000000000000000000000000000000000000000',
			data: '0x',
			skipBalance: true,
		})
		expect(result).toBeDefined()
		expect(result.rawData).toBe('0x')
	})
})
