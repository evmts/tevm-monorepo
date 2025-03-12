import { EvmRevertError, InvalidGasPriceError, RevertError } from '@tevm/errors'
import { createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { EthjsAddress, encodeFunctionData, hexToBytes } from '@tevm/utils'
import { parseEther } from 'viem'
import { describe, expect, it } from 'vitest'
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

	/**
	 * TODO: Add the following test cases for more robust coverage:
	 * 
	 * 1. Test with createTrace=false - Verify no trace is created
	 * 2. Test with createAccessList=false - Verify no accessList is created
	 * 3. Test with custom maxFeePerGas and maxPriorityFeePerGas together
	 * 4. Test with different block override values
	 * 5. Test error handling for evmInputToImpersonatedTx failures
	 * 6. Test error handling for runCallWithTrace failures
	 * 7. Test error handling for runTx failures
	 * 8. Test with exceptionError in runTxResult while execution completes
	 * 9. Test proper cleanup of event handlers during exceptions
	 * 10. Test with all event handlers (step, newContract, beforeMessage, afterMessage)
	 * 11. Test with complex contract interactions that might trigger edge cases
	 * 12. Test with a contract that has storage access to verify accessList
	 * 13. Test trace content structure for various operations
	 * 14. Test for memory leaks with repeated calls and handlers
	 * 15. Test behavior with invalid VM/client state
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
			to: EthjsAddress.fromString(ERC20_ADDRESS),
			origin: EthjsAddress.zero(),
			caller: EthjsAddress.zero(),
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
			to: EthjsAddress.fromString(ERC20_ADDRESS),
			origin: EthjsAddress.zero(),
			caller: EthjsAddress.zero(),
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
			to: EthjsAddress.fromString(ERC20_ADDRESS),
			origin: EthjsAddress.zero(),
			caller: EthjsAddress.zero(),
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
			maxPriorityFeePerGas: customMaxPriorityFeePerGas
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
			to: EthjsAddress.fromString(ERC20_ADDRESS),
			origin: EthjsAddress.zero(),
			caller: EthjsAddress.zero(),
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
				timestamp: 1234567890n
			}
		})
		
		if ('errors' in result) {
			throw result.errors
		}
		
		expect(result.runTxResult).toBeDefined()
		expect(result.runTxResult.execResult.executionGasUsed).toBe(2851n)
	})
})
