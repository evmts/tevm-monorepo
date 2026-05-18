import { SimpleContract } from '@tevm/contract'
import { type Client, createClient, encodeFunctionData } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createTevmTransport } from './createTevmTransport.js'
import type { TevmTransport } from './TevmTransport.js'
import { tevmCall } from './tevmCall.js'
import { tevmGetAccount } from './tevmGetAccount.js'
import { tevmMine } from './tevmMine.js'
import { tevmSetAccount } from './tevmSetAccount.js'

let client: Client<TevmTransport>
const contractAddress = '0x1234567890123456789012345678901234567890'

beforeEach(async () => {
	// Create a local-only transport (no forking)
	client = createClient({
		transport: createTevmTransport(),
	})

	// Deploy the SimpleContract bytecode directly
	await tevmSetAccount(client, {
		address: contractAddress,
		deployedBytecode: SimpleContract.deployedBytecode,
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
		expect(result.rawData).toEqualHex('0x')
	})

	it('should execute a call with a specific from address', async () => {
		const fromAddress = '0x0000000000000000000000000000000000000001'
		const result = await tevmCall(client, {
			to: '0x0000000000000000000000000000000000000000',
			data: '0x',
			from: fromAddress,
		})
		expect(result).toBeDefined()
		expect(result.rawData).toEqualHex('0x')
	})

	it('should handle call with deprecated createTransaction option', async () => {
		const result = await tevmCall(client, {
			to: '0x0000000000000000000000000000000000000000',
			data: '0x',
			createTransaction: true,
		})
		expect(result).toBeDefined()
		expect(result.rawData).toEqualHex('0x')
		await tevmMine(client)
	})

	it('should handle call with addToBlockchain option', async () => {
		const result = await tevmCall(client, {
			to: '0x0000000000000000000000000000000000000000',
			data: '0x',
			addToBlockchain: true,
		})
		expect(result).toBeDefined()
		expect(result.rawData).toEqualHex('0x')
		await tevmMine(client)
	})

	it('should handle call with addToMempool option', async () => {
		const result = await tevmCall(client, {
			to: '0x0000000000000000000000000000000000000000',
			data: '0x',
			addToMempool: true,
		})
		expect(result).toBeDefined()
		expect(result.rawData).toEqualHex('0x')
		expect(result.txHash).toBeHex()
		await tevmMine(client)
	})

	it('should handle call with value transfer using addToBlockchain', async () => {
		const toAddress = '0x1000000000000000000000000000000000000000'

		await tevmSetAccount(client, {
			address: toAddress,
			balance: 0n,
		})

		const initialAccount = await tevmGetAccount(client, { address: toAddress })
		expect(initialAccount.balance).toBe(0n)

		const result = await tevmCall(client, {
			to: toAddress,
			data: '0x',
			value: 100n,
			addToBlockchain: true,
		})
		expect(result).toBeDefined()
		expect(result.rawData).toBe('0x')
		expect(result.txHash).toBeDefined()

		await tevmMine(client)

		const finalAccount = await tevmGetAccount(client, { address: toAddress })
		expect(finalAccount.balance).toBe(100n)
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
		expect(result.rawData).toEqualHex('0x')
	})

	it('should execute call to contract with function data and return results', async () => {
		const setValue = 42n

		const setData = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [setValue],
		})

		await tevmCall(client, {
			to: contractAddress,
			data: setData,
			addToBlockchain: true,
		})

		await tevmMine(client)

		const getData = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'get',
		})

		const result = await tevmCall(client, {
			to: contractAddress,
			data: getData,
		})

		expect(result).toBeDefined()
		expect(result.rawData.toLowerCase()).toContain('2a')
	})
})
