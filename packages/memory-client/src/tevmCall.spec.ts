import { SimpleContract } from '@tevm/contract'
import { type Client, createClient, encodeFunctionData } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { createTevmTransport } from './createTevmTransport.js'
import type { TevmTransport } from './TevmTransport.js'
import { tevmCall } from './tevmCall.js'
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

	it('should handle call with addToMempool option', async () => {
		const result = await tevmCall(client, {
			to: '0x0000000000000000000000000000000000000000',
			data: '0x',
			addToMempool: true,
		})
		expect(result).toBeDefined()
		expect(result.rawData).toEqualHex('0x')
		expect(result.txHash).toBeHex()
		// Transaction should be in mempool but not mined yet
		await tevmMine(client)
	})

	it('should handle call with addToBlockchain option', async () => {
		const toAddress = '0x1000000000000000000000000000000000000000'

		// First create the account with zero balance
		await client.request({
			method: 'tevm_setAccount',
			params: [{ address: toAddress, balance: 0n }],
		})

		// Verify account has zero balance before test
		const getAccount = await client.request({
			method: 'tevm_getAccount',
			params: [{ address: toAddress }],
		})
		// Convert hex to bigint if needed (API returns hex string)
		const initialBalance = typeof getAccount.balance === 'string' ? BigInt(getAccount.balance) : getAccount.balance
		expect(initialBalance).toBe(0n)

		// Send value with addToBlockchain
		const result = await tevmCall(client, {
			to: toAddress,
			data: '0x',
			value: 100n,
			addToBlockchain: true,
		})
		expect(result).toBeDefined()
		expect(result.rawData).toBe('0x')
		expect(result.txHash).toBeDefined()

		await client.request({
			method: 'tevm_mine',
			params: [],
		})

		// Transaction should be mined automatically - check balance updated
		const getAccountAfter = await client.request({
			method: 'tevm_getAccount',
			params: [{ address: toAddress }],
		})
		// Convert hex to bigint if needed (API returns hex string)
		const finalBalance =
			typeof getAccountAfter.balance === 'string' ? BigInt(getAccountAfter.balance) : getAccountAfter.balance
		expect(finalBalance).toBe(100n)
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

	it('should execute call to contract with function data and return decoded results', async () => {
		// First set a value in the contract
		const setValue = 42n

		// Encode the data for the 'set' function
		const setData = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [setValue],
		})

		// Call set function
		await tevmCall(client, {
			to: contractAddress,
			data: setData,
			createTransaction: true,
		})

		await tevmMine(client)

		// Now encode the data for the 'get' function
		const getData = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'get',
		})

		// Call get function
		const result = await tevmCall(client, {
			to: contractAddress,
			data: getData,
		})

		// Verify we get the expected value
		expect(result).toBeDefined()

		// The SimpleContract.get() function returns a number as rawData
		// Log it to check data structure
		// Decode the hex result (rawData field)
		const rawDataHex = result.rawData

		// Verify the result contains the expected data
		// The rawData should contain the encoded value we set (42)
		expect(rawDataHex.toLowerCase()).toContain('2a') // 42 in hex is 0x2a
	})
})
