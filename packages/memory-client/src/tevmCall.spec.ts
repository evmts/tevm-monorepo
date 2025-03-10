import { optimism } from '@tevm/common'
import { requestEip1193 } from '@tevm/decorators'
import { createTevmNode } from '@tevm/node'
import { transports } from '@tevm/test-utils'
import { type Client, createClient } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import type { TevmTransport } from './TevmTransport.js'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmCall } from './tevmCall.js'
import { tevmMine } from './tevmMine.js'

let client: Client<TevmTransport>

beforeEach(async () => {
	const node = createTevmNode({
		fork: { transport: transports.optimism },
	}).extend(requestEip1193())
	
	client = createClient({
		transport: createTevmTransport(node),
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
