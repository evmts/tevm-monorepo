import { createServer, type Server } from 'node:http'
import { optimism } from '@tevm/common'
import { createMemoryClient, type MemoryClient } from '@tevm/memory-client'
import { createHttpHandler } from '@tevm/server'
import { transports } from '@tevm/test-utils'
import { waitForTransactionReceipt } from 'viem/actions'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { testAccounts } from './testAccounts.js'
import { tevmViemExtensionOptimistic } from './tevmViemExtensionOptimistic.js'

// Mock viem's waitForTransactionReceipt
vi.mock('viem/actions', async () => {
	const actual = await vi.importActual('viem/actions')
	return {
		...actual,
		waitForTransactionReceipt: vi.fn().mockResolvedValue({
			transactionHash: '0xmocktxhash',
			blockNumber: 1n,
			status: 'success',
		}),
	}
})

describe('tevmViemExtensionOptimistic', () => {
	let tevm: MemoryClient
	let server: Server
	let walletClient: any // Using any to simplify the test

	beforeAll(async () => {
		tevm = createMemoryClient({
			common: optimism,
			fork: { transport: transports.optimism },
		})
		server = createServer(createHttpHandler(tevm)).listen(6421)

		// Use the first test account
		const account = testAccounts[0]
		walletClient = {
			account,
			request: vi.fn().mockResolvedValue({
				result: {
					executionResultData: '0x',
					gasUsed: 21000n,
				},
			}),
			writeContract: vi.fn().mockResolvedValue('0xmocktxhash'),
		}

		await tevm.tevmReady()
	})

	afterAll(() => {
		server.close()
		vi.restoreAllMocks()
	})

	// Convert skipped tests to actual tests
	it('should create a decorated client with the writeContractOptimistic method', () => {
		const decorated = tevmViemExtensionOptimistic()(walletClient)
		expect(decorated.tevm).toBeDefined()
		expect(typeof decorated.tevm.writeContractOptimistic).toBe('function')
	})

	it('should test optimistic, hash, and receipt results in sequence', async () => {
		const mockWaitForTransactionReceipt = waitForTransactionReceipt as unknown as ReturnType<typeof vi.fn>
		const decorated = tevmViemExtensionOptimistic()(walletClient)

		const contractParams = {
			abi: [
				{
					name: 'transfer',
					type: 'function',
					inputs: [
						{ name: 'to', type: 'address' },
						{ name: 'amount', type: 'uint256' },
					],
					outputs: [{ name: 'success', type: 'bool' }],
				},
			],
			functionName: 'transfer',
			args: ['0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 1000000000000000000n],
			address: '0x1234567890123456789012345678901234567890',
			account: walletClient.account,
		}

		// We need to manually collect the generator results
		const results = []

		// @ts-expect-error: Test code with type compatibility issues
		const generator = decorated.tevm.writeContractOptimistic(contractParams)
		for await (const result of generator) {
			results.push(result)
		}

		// Verify that we have the expected number of results and they are in order
		expect(results.length).toBe(3)

		// Check optimistic result
		expect(results[0].success).toBe(true)
		expect(results[0].tag).toBe('OPTIMISTIC_RESULT')
		expect(results[0].data).toBeDefined()

		// Check hash result
		expect(results[1].success).toBe(true)
		expect(results[1].tag).toBe('HASH')
		expect(results[1].data).toBe('0xmocktxhash')

		// Check receipt result
		expect(results[2].success).toBe(true)
		expect(results[2].tag).toBe('RECEIPT')
		expect(results[2].data).toBeDefined()
		expect(results[2].data.transactionHash).toBe('0xmocktxhash')

		// Verify the mocks were called
		expect(walletClient.request).toHaveBeenCalledWith(
			expect.objectContaining({
				method: 'tevm_contract',
				jsonrpc: '2.0',
			}),
		)

		expect(walletClient.writeContract).toHaveBeenCalledWith(contractParams)

		expect(mockWaitForTransactionReceipt).toHaveBeenCalledWith(walletClient, {
			hash: '0xmocktxhash',
		})
	})

	it('should handle optimistic result errors', async () => {
		// Set up a client that fails during the optimistic result phase
		const errorClient = {
			...walletClient,
			request: vi.fn().mockRejectedValue(new Error('Optimistic simulation failed')),
		}

		const decorated = tevmViemExtensionOptimistic()(errorClient)

		const contractParams = {
			abi: [
				{
					name: 'transfer',
					type: 'function',
					inputs: [
						{ name: 'to', type: 'address' },
						{ name: 'amount', type: 'uint256' },
					],
					outputs: [{ name: 'success', type: 'bool' }],
				},
			],
			functionName: 'transfer',
			args: ['0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 1000000000000000000n],
			address: '0x1234567890123456789012345678901234567890',
			account: walletClient.account,
		}

		// Collect the generator results
		const results = []
		// @ts-expect-error: Test code with type compatibility issues
		const generator = decorated.tevm.writeContractOptimistic(contractParams)
		for await (const result of generator) {
			results.push(result)
		}

		// We should still have 3 results, but the first one should be an error
		expect(results.length).toBe(3)

		// Check optimistic error result
		expect(results[0].success).toBe(false)
		expect(results[0].tag).toBe('OPTIMISTIC_RESULT')
		// @ts-expect-error: Using error instead of errors property for test simplicity
		expect(results[0].error).toBeInstanceOf(Error)
		// @ts-expect-error: Using error instead of errors property for test simplicity
		expect(results[0].error.message).toBe('Optimistic simulation failed')

		// Subsequent results should still be successful
		expect(results[1].success).toBe(true)
		expect(results[1].tag).toBe('HASH')
		expect(results[2].success).toBe(true)
		expect(results[2].tag).toBe('RECEIPT')
	})

	it('should handle transaction hash errors', async () => {
		// Set up a client that fails during the transaction hash phase
		const errorClient = {
			...walletClient,
			writeContract: vi.fn().mockRejectedValue(new Error('Transaction rejected')),
		}

		const decorated = tevmViemExtensionOptimistic()(errorClient)

		const contractParams = {
			abi: [
				{
					name: 'transfer',
					type: 'function',
					inputs: [
						{ name: 'to', type: 'address' },
						{ name: 'amount', type: 'uint256' },
					],
					outputs: [{ name: 'success', type: 'bool' }],
				},
			],
			functionName: 'transfer',
			args: ['0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 1000000000000000000n],
			address: '0x1234567890123456789012345678901234567890',
			account: walletClient.account,
		}

		// Collect the generator results
		const results = []
		// @ts-expect-error: Test code with type compatibility issues
		const generator = decorated.tevm.writeContractOptimistic(contractParams)
		for await (const result of generator) {
			results.push(result)
		}

		// We should have 2 results
		expect(results.length).toBe(2)

		// First result (optimistic) should be successful
		expect(results[0].success).toBe(true)
		expect(results[0].tag).toBe('OPTIMISTIC_RESULT')

		// Hash result should be an error
		expect(results[1].success).toBe(false)
		expect(results[1].tag).toBe('HASH')
		// @ts-expect-error: Using error instead of errors property for test simplicity
		expect(results[1].error).toBeInstanceOf(Error)
		// @ts-expect-error: Using error instead of errors property for test simplicity
		expect(results[1].error.message).toBe('Transaction rejected')

		// No receipt result should be generated since there's no hash
	})

	it('should handle transaction receipt errors', async () => {
		// Mock waitForTransactionReceipt to fail
		const mockModule = await import('viem/actions')
		const mockWaitForTx = mockModule.waitForTransactionReceipt as unknown as ReturnType<typeof vi.fn>
		mockWaitForTx.mockRejectedValueOnce(new Error('Receipt timeout'))

		const decorated = tevmViemExtensionOptimistic()(walletClient)

		const contractParams = {
			abi: [
				{
					name: 'transfer',
					type: 'function',
					inputs: [
						{ name: 'to', type: 'address' },
						{ name: 'amount', type: 'uint256' },
					],
					outputs: [{ name: 'success', type: 'bool' }],
				},
			],
			functionName: 'transfer',
			args: ['0x71C7656EC7ab88b098defB751B7401B5f6d8976F', 1000000000000000000n],
			address: '0x1234567890123456789012345678901234567890',
			account: walletClient.account,
		}

		// Collect the generator results
		const results = []
		// @ts-expect-error: Test code with type compatibility issues
		const generator = decorated.tevm.writeContractOptimistic(contractParams)
		for await (const result of generator) {
			results.push(result)
		}

		// We should have 3 results
		expect(results.length).toBe(3)

		// First two results should be successful
		expect(results[0].success).toBe(true)
		expect(results[0].tag).toBe('OPTIMISTIC_RESULT')
		expect(results[1].success).toBe(true)
		expect(results[1].tag).toBe('HASH')

		// Receipt result should be an error
		expect(results[2].success).toBe(false)
		expect(results[2].tag).toBe('RECEIPT')
		// @ts-expect-error: Using error instead of errors property for test simplicity
		expect(results[2].error).toBeInstanceOf(Error)
		// @ts-expect-error: Using error instead of errors property for test simplicity
		expect(results[2].error.message).toBe('Receipt timeout')

		// Verify the mock was called
		expect(mockWaitForTx).toHaveBeenCalledWith(walletClient, {
			hash: '0xmocktxhash',
		})
	})
})
