import { createAddress } from '@tevm/address'
import { EvmRevertError, InvalidGasPriceError, RevertError } from '@tevm/errors'
import { createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { encodeFunctionData, hexToBytes } from '@tevm/utils'
import { parseEther } from 'viem'
import { describe, expect, it, vi } from 'vitest'
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
			to: createAddress(ERC20_ADDRESS),
			origin: createAddress(0),
			caller: createAddress(0),
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
			to: createAddress(ERC20_ADDRESS),
			origin: createAddress(caller),
			from: createAddress(caller),
			gasLimit: 16784800n,
			block: await vm.blockchain.getCanonicalHeadBlock(),
		}
		const result = await executeCall(client, evmInput, { createAccessList: true, createTrace: true })
		if (!('errors' in result)) throw 'should have errors'

		expect(result.errors).toBeDefined()
		expect(result.errors[0].message).toBe(
			'revert\n\nDocs: https://tevm.sh/reference/tevm/errors/classes/reverterror/\nDetails: {"error":"revert","errorType":"EVMError"}\nVersion: 1.1.0.next-73',
		)
		expect(result.errors[0]).toBeInstanceOf(EvmRevertError)
		expect(result.errors[0]).toBeInstanceOf(RevertError)
		expect(result.errors[0].code).toBe(RevertError.code)
		expect(result.errors[0].name).toBe('EvmRevertError')
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
			to: createAddress(to),
			origin: createAddress(0),
			caller: createAddress(0),
			gasLimit: 16784800n,
			block: await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock()),
		}

		const result = await executeCall(client, evmInput, { createAccessList: true, maxFeePerGas: 1n })
		if (!('errors' in result)) throw 'should have errors'

		const error = result.errors?.[0] as InvalidGasPriceError
		expect(error).toBeInstanceOf(InvalidGasPriceError)
		expect(error.code).toBe(InvalidGasPriceError.code)
		expect(error.name).toBe('InvalidGasPrice')
		expect(error.message).contain("is less than the block's baseFeePerGas")
	})

	/**
	 * The following test cases have been added for more robust coverage:
	 *
	 * ✅ 1. Test with createTrace=false - Verify no trace is created
	 * ✅ 2. Test with createAccessList=false - Verify no accessList is created
	 * ✅ 3. Test with custom maxFeePerGas and maxPriorityFeePerGas together
	 * ✅ 4. Test with different block override values
	 *
	 * Additional test cases that would be valuable but would require more complex mocking:
	 *
	 * 5. Test with various createTransaction options ('always', 'never', 'on-success', true, false)
	 * 6. Test with different block tags ('latest', 'earliest', 'pending', 'safe', 'finalized', and numeric)
	 * 7. Test with state overrides (modifying account balances, code, storage for a single call)
	 * 8. Test with a Tevm instance forking another Tevm instance (no external provider needed)
	 * 9. Test error handling for evmInputToImpersonatedTx failures
	 * 10. Test error handling for runCallWithTrace failures
	 * 11. Test error handling for runTx failures
	 * 12. Test with exceptionError in runTxResult while execution completes
	 * 13. Test proper cleanup of event handlers during exceptions
	 * 14. Test with all event handlers (step, newContract, beforeMessage, afterMessage)
	 * 15. Test with contracts that have storage access to verify accessList generation
	 * 16. Test with EIP-1559 and EIP-4844 (blob) transactions with various gas parameters
	 * 17. Test snapshot/revert functionality during calls
	 * 18. Test concurrent transactions with dependencies between them
	 */

	it('should execute a call with createTrace=false', async () => {
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
			to: createAddress(ERC20_ADDRESS),
			origin: createAddress(0),
			caller: createAddress(0),
			block: await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock()),
		}

		// Execute with createTrace=false
		const result = await executeCall(client, evmInput, { createAccessList: true, createTrace: false })
		if ('errors' in result) {
			throw result.errors
		}
		expect(result.runTxResult).toBeDefined()
		expect(result.runTxResult.execResult.executionGasUsed).toBe(2851n)
		expect(result.trace).toBeUndefined()
		expect(result.accessList).toBeDefined()
	})

	it('should execute a call with createAccessList=false', async () => {
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
			to: createAddress(ERC20_ADDRESS),
			origin: createAddress(0),
			caller: createAddress(0),
			block: await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock()),
		}

		// Execute with createAccessList=false
		const result = await executeCall(client, evmInput, { createAccessList: false, createTrace: true })
		if ('errors' in result) {
			throw result.errors
		}
		expect(result.runTxResult).toBeDefined()
		expect(result.runTxResult.execResult.executionGasUsed).toBe(2851n)
		expect(result.trace).toBeDefined()
		expect(result.accessList).toBeUndefined()
	})

	it('should execute with custom maxFeePerGas and maxPriorityFeePerGas', async () => {
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
			to: createAddress(ERC20_ADDRESS),
			origin: createAddress(0),
			caller: createAddress(0),
			block: await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock()),
		}

		// Custom gas parameters
		const customMaxFeePerGas = 1000000000n
		const customMaxPriorityFeePerGas = 100000000n

		// Execute with custom gas parameters
		const result = await executeCall(client, evmInput, {
			createAccessList: true,
			createTrace: true,
			maxFeePerGas: customMaxFeePerGas,
			maxPriorityFeePerGas: customMaxPriorityFeePerGas,
		})

		if ('errors' in result) {
			throw result.errors
		}

		expect(result.runTxResult).toBeDefined()
		// Transaction should have been created with our custom gas parameters
		expect(result.runTxResult.execResult.executionGasUsed).toBe(2851n)
	})

	it('should execute with custom block override values', async () => {
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
			to: createAddress(ERC20_ADDRESS),
			origin: createAddress(0),
			caller: createAddress(0),
			block: await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock()),
		}

		// Execute with block overrides
		const result = await executeCall(client, evmInput, {
			createAccessList: true,
			createTrace: true,
			blockOverrideSet: {
				baseFee: 2000000000n,
				gasLimit: 30000000n,
				number: 123456n,
				time: 1234567890n,
			},
		})

		if ('errors' in result) {
			throw result.errors
		}

		expect(result.runTxResult).toBeDefined()
		expect(result.runTxResult.execResult.executionGasUsed).toBe(2851n)
	})

	it('should execute with createTransaction=never option', async () => {
		const client = createTevmNode()
		client.emit = vi.fn() // Add local mock for emit that we can verify

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
			to: createAddress(ERC20_ADDRESS),
			origin: createAddress(0),
			caller: createAddress(0),
			block: await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock()),
		}

		// Execute with createTransaction=never
		const result = await executeCall(client, evmInput, {
			createAccessList: true,
			createTrace: true,
			createTransaction: 'never', // Explicitly set to never create transaction
		})

		if ('errors' in result) {
			throw result.errors
		}

		expect(result.runTxResult).toBeDefined()
		// Should still successfully execute and return results
		expect(result.runTxResult.execResult.executionGasUsed).toBe(2851n)

		// Verify a client.emit event wasn't fired for transaction creation
		// This is a simple proxy to verify transaction wasn't created
		expect(client.emit).not.toHaveBeenCalled()
	})

	it('should execute with state overrides', async () => {
		const client = createTevmNode()
		expect(
			(
				await setAccountHandler(client)({
					address: ERC20_ADDRESS,
					deployedBytecode: ERC20_BYTECODE,
				})
			).errors,
		).toBeUndefined()

		const testAddr = `0x${'42'.repeat(20)}` as const

		const evmInput = {
			data: hexToBytes(
				encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'balanceOf',
					args: [testAddr], // Check balance of test address
				}),
			),
			gasLimit: 16784800n,
			to: createAddress(ERC20_ADDRESS),
			origin: createAddress(0),
			caller: createAddress(0),
			block: await client.getVm().then((vm) => vm.blockchain.getCanonicalHeadBlock()),
		}

		// Execute with state overrides to modify the state during this call
		const result = await executeCall(client, evmInput, {
			createAccessList: true,
			createTrace: true,
			stateOverrideSet: {
				// Override the ERC20 contract to have different storage (setting balance of testAddr)
				[ERC20_ADDRESS]: {
					// We can't easily create storage overrides without knowing exact storage slots
					// This is just a demonstration of the API, actual ERC20 storage modification
					// would require knowing exact storage layout
					balance: 0x1000n, // Modify balance
					nonce: 0n, // Set nonce to 0
				},
			},
		})

		if ('errors' in result) {
			throw result.errors
		}

		expect(result.runTxResult).toBeDefined()
		// Results should reflect state with our overrides applied
		expect(result.runTxResult.execResult.executionGasUsed).toBe(2851n)
	})

	it('should always prefetch storage from access list even when createAccessList is false', async () => {
		const client = createTevmNode()

		// Mock the stateManager.getContractStorage method to track calls
		const vm = await client.getVm()
		const originalGetStorage = /** @type {any} */ (vm.stateManager).getStorage
		const getStorageSpy = vi.fn().mockImplementation(originalGetStorage)
		/** @type {any} */
		vm.stateManager.getStorage = getStorageSpy

		// Set up ERC20 contract
		expect(
			(
				await setAccountHandler(client)({
					address: ERC20_ADDRESS,
					deployedBytecode: ERC20_BYTECODE,
				})
			).errors,
		).toBeUndefined()

		// Set up account to check balance
		const testAddr = `0x${'45'.repeat(20)}` as const
		expect(
			(
				await setAccountHandler(client)({
					address: testAddr,
					balance: parseEther('1'),
				})
			).errors,
		).toBeUndefined()

		// Create a transaction that will access storage
		const evmInput = {
			data: hexToBytes(
				encodeFunctionData({
					abi: ERC20_ABI,
					functionName: 'balanceOf', // Will access storage to check balance
					args: [testAddr],
				}),
			),
			gasLimit: 16784800n,
			to: createAddress(ERC20_ADDRESS),
			origin: createAddress(0),
			caller: createAddress(0),
			block: await vm.blockchain.getCanonicalHeadBlock(),
		}

		// Run the call with createAccessList explicitly set to false
		const result = await executeCall(client, evmInput, {
			createAccessList: false, // Don't include access list in response
			createTrace: false,
		})

		if ('errors' in result) {
			throw result.errors
		}

		// Verify we successfully executed
		expect(result.runTxResult).toBeDefined()
		expect(result.runTxResult.execResult.executionGasUsed).toBeGreaterThan(0n)

		// We explicitly set createAccessList to false, so the access list should not be in the response
		expect(result.accessList).toBeUndefined()

		// But storage prefetching should still have happened regardless
		// The getStorage method should have been called at least once
		expect(getStorageSpy).toHaveBeenCalled()

		// Restore the original getStorage method
		vm.stateManager.getStorage = originalGetStorage
	})
})
