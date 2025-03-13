import { EvmRevertError, InvalidGasPriceError, RevertError } from '@tevm/errors'
import { createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { EthjsAddress, encodeFunctionData, hexToBytes } from '@tevm/utils'
import { parseEther } from 'viem'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { executeCall } from './executeCall.js'

const ERC20_ADDRESS = `0x${'3'.repeat(40)}` as const
const ERC20_BYTECODE = TestERC20.deployedBytecode
const ERC20_ABI = TestERC20.abi

describe('executeCall', () => {
	it('should execute a contract call successfully', async () => {
		const client = createTevmNode()
		expect(
			(
				await setAccountHandler(client)({
					address: ERC20_ADDRESS,
					deployedBytecode: ERC20_BYTECODE,
				})
			).errors,
		).toBeUndefined()

		const evmInput = {
			data: hexToBytes(
				encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'balanceOf',
					args: [ERC20_ADDRESS],
				}),
			),
			gasLimit: 16784800n,
			to: EthjsAddress.fromString(ERC20_ADDRESS),
			origin: EthjsAddress.zero(),
			caller: EthjsAddress.zero(),
			block: await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock()),
		}

		const result = await executeCall(client, evmInput, { createAccessList: true, createTrace: true })
		if ('errors' in result) {
			throw result.errors
		}
		expect(result.runTxResult).toBeDefined()
		expect(result.runTxResult.execResult.executionGasUsed).toBe(2851n)
		expect(result.trace).toBeDefined()
		expect(result.accessList).toBeDefined()
		expect(result.trace).toMatchSnapshot()
		expect(result.accessList).toMatchSnapshot()
	})

	it('should handle contract call errors', async () => {
		const client = createTevmNode()
		const vm = await client.getVm()
		const caller = `0x${'23'.repeat(20)}` as const
		expect(
			(
				await setAccountHandler(client)({
					address: ERC20_ADDRESS,
					deployedBytecode: ERC20_BYTECODE,
				})
			).errors,
		).toBeUndefined()
		expect(
			(
				await setAccountHandler(client)({
					address: caller,
					balance: parseEther('100'),
				})
			).errors,
		).toBeUndefined()
		const notCaller = `0x${'32'.repeat(20)}` as const
		const evmInput = {
			data: hexToBytes(
				encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'transferFrom',
					args: [notCaller, caller, 90n],
				}),
			),
			to: EthjsAddress.fromString(ERC20_ADDRESS),
			origin: EthjsAddress.fromString(caller),
			from: EthjsAddress.fromString(caller),
			gasLimit: 16784800n,
			block: await vm.blockchain.getCanonicalHeadBlock(),
		}
		const result = await executeCall(client, evmInput, { createAccessList: true, createTrace: true })
		if (!('errors' in result)) {
			throw 'should have errors'
		}
		expect(result.errors).toBeDefined()
		expect(result.errors[0].message).toBe(
			'revert\n\nDocs: https://tevm.sh/reference/tevm/errors/classes/reverterror/\nDetails: {"error":"revert","errorType":"EvmError"}\nVersion: 1.1.0.next-73',
		)
		expect(result.errors[0]).toBeInstanceOf(EvmRevertError)
		expect(result.errors[0]).toBeInstanceOf(RevertError)
		expect(result.errors[0].code).toBe(-32000)
		expect(result.errors[0].name).toBe('RevertError')
	})

	it('should handle gas price too low error', async () => {
		const client = createTevmNode()
		const to = `0x${'33'.repeat(20)}` as const

		const evmInput = {
			data: hexToBytes(
				encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'balanceOf',
					args: [to],
				}),
			),
			to: EthjsAddress.fromString(to),
			origin: EthjsAddress.zero(),
			caller: EthjsAddress.zero(),
			gasLimit: 16784800n,
			block: await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock()),
		}

		const result = await executeCall(client, evmInput, { createAccessList: true, maxFeePerGas: 1n })
		if (!('errors' in result)) {
			throw 'should have errors'
		}
		expect(result.errors).toBeDefined()
		expect(result.errors[0]).toBeInstanceOf(InvalidGasPriceError)
		expect(result.errors[0].name).toBe('InvalidGasPrice')
		expect(result.errors[0].code).toBe(-32012)
		expect(result.errors[0].message).toMatchSnapshot()
	})

	describe('async storage prefetch', () => {
		// Mock AbortController
		let mockAbortController
		let mockSignal
		let originalAbortController

		beforeEach(() => {
			mockSignal = { aborted: false }
			mockAbortController = {
				signal: mockSignal,
				abort: vi.fn(() => {
					mockSignal.aborted = true
				})
			}
			originalAbortController = global.AbortController
			global.AbortController = vi.fn(() => mockAbortController)
		})

		afterEach(() => {
			global.AbortController = originalAbortController
			vi.clearAllMocks()
		})

		it('should cancel prefetch when main execution completes', async () => {
			// Create a client with a mock fork transport
			const client = createTevmNode()
			const mockForkTransport = {
				request: vi.fn().mockImplementation(({ method }) => {
					// Mock slow responses for prefetch operations
					if (method === 'eth_createAccessList') {
						return new Promise(resolve => {
							setTimeout(() => {
								resolve({
									result: {
										accessList: [
											{
												address: ERC20_ADDRESS,
												storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001']
											}
										]
									}
								})
							}, 50) // Delay the response
						})
					} else if (method === 'eth_getStorageAt') {
						return new Promise(resolve => {
							setTimeout(() => {
								resolve('0x0000000000000000000000000000000000000000000000000000000000000000')
							}, 100) // Even longer delay
						})
					}
					return Promise.resolve({})
				})
			}
			
			// Replace the client's fork transport with our mock
			client.forkTransport = mockForkTransport
			
			// Mock logger
			const mockDebug = vi.fn()
			client.logger = {
				...client.logger,
				debug: mockDebug,
				error: vi.fn()
			}

			// Set up account and execute call
			await setAccountHandler(client)({
				address: ERC20_ADDRESS,
				deployedBytecode: ERC20_BYTECODE,
			})

			const evmInput = {
				data: hexToBytes(
					encodeFunctionData({
						abi: ERC20_ABI,
						functionName: 'balanceOf',
						args: [ERC20_ADDRESS],
					}),
				),
				gasLimit: 16784800n,
				to: EthjsAddress.fromString(ERC20_ADDRESS),
				origin: EthjsAddress.zero(),
				caller: EthjsAddress.zero(),
				block: await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock()),
			}

			// Execute the call
			const result = await executeCall(client, evmInput, { createAccessList: true })
			
			// Verify that AbortController was used
			expect(global.AbortController).toHaveBeenCalled()
			
			// Verify that abort was called
			expect(mockAbortController.abort).toHaveBeenCalled()
			
			// Verify main execution completed successfully
			expect(result.runTxResult).toBeDefined()
			
			// Verify the debug logs
			expect(mockDebug).toHaveBeenCalledWith('Starting asynchronous storage prefetch')
			expect(mockDebug).toHaveBeenCalledWith('Main execution completed, cancelling any ongoing prefetch operations')
			
			// Verify the mock transport was called
			expect(mockForkTransport.request).toHaveBeenCalledWith(expect.objectContaining({
				method: 'eth_createAccessList'
			}))
		})

		it('should abort prefetch on error', async () => {
			// Create a client with a mock fork transport
			const client = createTevmNode()
			
			// Mock logger
			const mockDebug = vi.fn()
			client.logger = {
				...client.logger,
				debug: mockDebug,
				error: vi.fn()
			}

			// Mock a function that will throw an error during execution
			const mockVm = await client.getVm()
			const originalRunTx = mockVm.runTx.bind(mockVm)
			mockVm.runTx = vi.fn().mockImplementation(() => {
				throw new Error('Simulated execution error')
			})
			
			client.getVm = vi.fn().mockResolvedValue(mockVm)

			// Set up account
			await setAccountHandler(client)({
				address: ERC20_ADDRESS,
				deployedBytecode: ERC20_BYTECODE,
			})

			const evmInput = {
				data: hexToBytes(
					encodeFunctionData({
						abi: ERC20_ABI,
						functionName: 'balanceOf',
						args: [ERC20_ADDRESS],
					}),
				),
				gasLimit: 16784800n,
				to: EthjsAddress.fromString(ERC20_ADDRESS),
				origin: EthjsAddress.zero(),
				caller: EthjsAddress.zero(),
				block: await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock()),
			}

			// Execute the call, which should fail
			await executeCall(client, evmInput, { createAccessList: true })
			
			// Verify that AbortController was used
			expect(global.AbortController).toHaveBeenCalled()
			
			// Verify that abort was called due to the error
			expect(mockAbortController.abort).toHaveBeenCalled()
			
			// Verify the debug logs
			expect(mockDebug).toHaveBeenCalledWith('Main execution encountered an error, cancelling any ongoing prefetch operations')
			
			// Restore original method
			mockVm.runTx = originalRunTx
		})
	})
})
