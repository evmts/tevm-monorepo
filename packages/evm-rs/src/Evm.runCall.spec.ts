import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Evm } from './Evm.js'
import { createEvm } from './createEvm.js'

describe('Evm.runCall', () => {
	let evm: any

	beforeEach(async () => {
		// Reset mock implementations before each test
		vi.resetAllMocks()

		// Create a new EVM instance
		evm = await Evm.create({
			common: {} as any,
			stateManager: {} as any,
			blockchain: {} as any,
		})
	})

	describe('Various Transaction Types', () => {
		it('should handle simple ETH transfers', async () => {
			// Setup the mock to return a specific result
			vi.spyOn(evm._wasmEvm, 'run_call').mockResolvedValueOnce({
				result: '0x',
				gas_used: 21000,
				logs: [],
			})

			const result = await evm.runCall({
				caller: '0x1000000000000000000000000000000000000000',
				to: '0x2000000000000000000000000000000000000000',
				value: '0x100000000000000000', // 0.1 ETH
				data: '0x',
				gasLimit: 21000,
			})

			// Verify call was made with the right parameters
			expect(evm._wasmEvm.run_call).toHaveBeenCalledWith(
				expect.objectContaining({
					caller: '0x1000000000000000000000000000000000000000',
					to: '0x2000000000000000000000000000000000000000',
					value: '0x100000000000000000',
					data: '0x',
					gas_limit: 21000,
				}),
			)

			// Check result structure
			expect(result.result).toBe('0x')
			expect(result.gasUsed).toBe(21000n)
			expect(result.logs).toEqual([])
		})

		it('should handle contract deployments', async () => {
			// Setup the mock to return a contract creation result
			vi.spyOn(evm._wasmEvm, 'run_call').mockResolvedValueOnce({
				result: '0x',
				gas_used: 500000,
				logs: [],
			})

			const result = await evm.runCall({
				caller: '0x1000000000000000000000000000000000000000',
				to: null, // Contract creation
				value: '0x0',
				data: '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe', // Simple contract bytecode
				gasLimit: 1000000,
			})

			// Verify call was made with the right parameters
			expect(evm._wasmEvm.run_call).toHaveBeenCalledWith(
				expect.objectContaining({
					caller: '0x1000000000000000000000000000000000000000',
					to: null,
					value: '0x0',
					data: '0x608060405234801561001057600080fd5b50610150806100206000396000f3fe',
					gas_limit: 1000000,
				}),
			)

			// Check result structure
			expect(result.result).toBe('0x')
			expect(result.gasUsed).toBe(500000n)
			expect(result.logs).toEqual([])
		})

		it('should handle ERC20 transfers', async () => {
			// Setup mock for ERC20 transfer with a log
			const recipient = '0x3000000000000000000000000000000000000000'
			const amount = '0x0000000000000000000000000000000000000000000000056bc75e2d63100000' // 100 tokens
			const transferData = `0xa9059cbb000000000000000000000000${recipient.slice(2)}${amount.slice(2)}`

			vi.spyOn(evm._wasmEvm, 'run_call').mockResolvedValueOnce({
				result: '0x0000000000000000000000000000000000000000000000000000000000000001',
				gas_used: 60000,
				logs: [
					{
						address: '0x2000000000000000000000000000000000000000',
						topics: [
							'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
							'0x0000000000000000000000001000000000000000000000000000000000000000',
							'0x0000000000000000000000003000000000000000000000000000000000000000',
						],
						data: amount,
					},
				],
			})

			const result = await evm.runCall({
				caller: '0x1000000000000000000000000000000000000000',
				to: '0x2000000000000000000000000000000000000000', // Token contract
				value: '0x0',
				data: transferData,
				gasLimit: 100000,
			})

			// Verify call was made
			expect(evm._wasmEvm.run_call).toHaveBeenCalled()

			// Check result structure
			expect(result.result).toBe('0x0000000000000000000000000000000000000000000000000000000000000001')
			expect(result.gasUsed).toBe(60000n)
			expect(result.logs.length).toBe(1)
			expect(result.logs[0].topics[0]).toBe('0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') // Transfer event topic
		})
	})

	describe('Edge Cases', () => {
		it('should handle missing optional parameters', async () => {
			// Setup mock
			vi.spyOn(evm._wasmEvm, 'run_call').mockResolvedValueOnce({
				result: '0x',
				gas_used: 21000,
				logs: [],
			})

			// Call with minimal parameters
			const result = await evm.runCall({
				caller: '0x1000000000000000000000000000000000000000',
				to: '0x2000000000000000000000000000000000000000',
			})

			// Verify call was made with the right parameters
			expect(evm._wasmEvm.run_call).toHaveBeenCalledWith(
				expect.objectContaining({
					caller: '0x1000000000000000000000000000000000000000',
					to: '0x2000000000000000000000000000000000000000',
				}),
			)

			// Result should still be processed correctly
			expect(result).toHaveProperty('result')
			expect(result).toHaveProperty('gasUsed')
			expect(result).toHaveProperty('logs')
		})

		it('should accept BigInt values', async () => {
			// Setup mock
			vi.spyOn(evm._wasmEvm, 'run_call').mockResolvedValueOnce({
				result: '0x',
				gas_used: 21000,
				logs: [],
			})

			// Call with BigInt value
			const result = await evm.runCall({
				caller: '0x1000000000000000000000000000000000000000',
				to: '0x2000000000000000000000000000000000000000',
				value: 1000000000000000000n, // 1 ETH as BigInt
				gasLimit: 21000,
			})

			// Verify the value was converted to a string
			expect(evm._wasmEvm.run_call).toHaveBeenCalledWith(
				expect.objectContaining({
					value: '1000000000000000000',
				}),
			)

			// Result should be processed correctly
			expect(result).toHaveProperty('result')
		})
	})
})
