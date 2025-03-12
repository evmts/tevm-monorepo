import { describe, expect, it, vi } from 'vitest'
import type { BaseVm } from '../BaseVm.js'
import { generateTxReceipt } from './generateTxResult.js'

// Helper function to create a simplified transaction mock
const createTxMock = (isTyped = false, txType = '') => {
	return {
		supports: vi.fn((capability) => {
			if (capability === 'EIP2718TypedTransaction') {
				return isTyped
			}
			return false
		}),
		type: txType,
	} as any // Type assertion for test purposes
}

describe('generateTxReceipt', () => {
	// Create a base transaction result for tests
	// Using any type to bypass TypeScript's strict checking for tests
	const createBaseTxResult = () =>
		({
			execResult: {
				logs: [],
				selfdestruct: new Set(),
				gasRefund: 0n,
				executionGasUsed: 21000n,
				returnValue: new Uint8Array(0),
			},
			gasUsed: 21000n,
			bloom: {
				bitvector: new Uint8Array(256),
				keccakFunction: () => new Uint8Array(32),
				add: () => {},
				check: () => false,
				multiCheck: () => false,
				or: () => {},
			},
			createdAddress: undefined,
			totalGasSpent: 21000n,
			// Add missing required properties
			amountSpent: 21000n,
			receipt: {},
			minerValue: 0n,
		}) as any

	it('should generate a pre-Byzantium receipt', async () => {
		// Setup VM mock with pre-Byzantium hardfork
		const stateRoot = new Uint8Array(32).fill(1)
		const vm = {
			common: {
				ethjsCommon: {
					gteHardfork: vi.fn((hf) => hf !== 'byzantium'),
				},
			},
			stateManager: {
				getStateRoot: vi.fn().mockResolvedValue(stateRoot),
			},
		} as unknown as BaseVm

		// Legacy transaction (pre-EIP2718)
		const tx = createTxMock()

		const txResult = createBaseTxResult()
		const cumulativeGasUsed = 21000n

		// Generate receipt
		const receipt = await generateTxReceipt(vm)(tx, txResult, cumulativeGasUsed)

		// Verify receipt is pre-Byzantium with stateRoot
		expect(receipt).toEqual({
			stateRoot,
			cumulativeBlockGasUsed: cumulativeGasUsed,
			bitvector: txResult.bloom.bitvector,
			logs: [],
		})

		// Verify tx.supports was called with the right capability
		expect(tx.supports).toHaveBeenCalled()

		// Verify common.gteHardfork was called with 'byzantium'
		expect(vm.common.ethjsCommon.gteHardfork).toHaveBeenCalledWith('byzantium')

		// Verify stateManager.getStateRoot was called
		expect(vm.stateManager.getStateRoot).toHaveBeenCalled()
	})

	it('should generate a post-Byzantium receipt for legacy transaction with successful execution', async () => {
		// Setup VM mock with post-Byzantium hardfork
		const vm = {
			common: {
				ethjsCommon: {
					gteHardfork: vi.fn((hf) => hf === 'byzantium'),
				},
			},
		} as unknown as BaseVm

		// Legacy transaction (pre-EIP2718)
		const tx = createTxMock()

		const txResult = createBaseTxResult()
		const cumulativeGasUsed = 21000n

		// Generate receipt
		const receipt = await generateTxReceipt(vm)(tx, txResult, cumulativeGasUsed)

		// Verify receipt is post-Byzantium with status=1 (success)
		expect(receipt).toEqual({
			status: 1,
			cumulativeBlockGasUsed: cumulativeGasUsed,
			bitvector: txResult.bloom.bitvector,
			logs: [],
		})

		// Verify tx.supports was called with the right capability
		expect(tx.supports).toHaveBeenCalled()

		// Verify common.gteHardfork was called with 'byzantium'
		expect(vm.common.ethjsCommon.gteHardfork).toHaveBeenCalledWith('byzantium')
	})

	it('should generate a post-Byzantium receipt for legacy transaction with failed execution', async () => {
		// Setup VM mock with post-Byzantium hardfork
		const vm = {
			common: {
				ethjsCommon: {
					gteHardfork: vi.fn((hf) => hf === 'byzantium'),
				},
			},
		} as unknown as BaseVm

		// Legacy transaction (pre-EIP2718)
		const tx = createTxMock()

		// Create a transaction result with an exception error
		const txResult = {
			...createBaseTxResult(),
			execResult: {
				...createBaseTxResult().execResult,
				exceptionError: { error: 'test error', errorType: 'TestError' },
			},
		}
		const cumulativeGasUsed = 21000n

		// Generate receipt
		const receipt = await generateTxReceipt(vm)(tx, txResult, cumulativeGasUsed)

		// Verify receipt is post-Byzantium with status=0 (failure)
		expect(receipt).toEqual({
			status: 0,
			cumulativeBlockGasUsed: cumulativeGasUsed,
			bitvector: txResult.bloom.bitvector,
			logs: [],
		})
	})

	it('should handle transaction with logs', async () => {
		// Setup VM mock
		const vm = {
			common: {
				ethjsCommon: {
					gteHardfork: vi.fn((hf) => hf === 'byzantium'),
				},
			},
		} as unknown as BaseVm

		// Legacy transaction
		const tx = createTxMock()

		// Create logs for the transaction (using any cast for tests)
		const logs = [
			{
				address: new Uint8Array(20).fill(1),
				data: new Uint8Array(32).fill(2),
				topics: [new Uint8Array(32).fill(3), new Uint8Array(32).fill(4)],
			},
			{
				address: new Uint8Array(20).fill(5),
				data: new Uint8Array(32).fill(6),
				topics: [new Uint8Array(32).fill(7)],
			},
		] as any

		const txResult = {
			...createBaseTxResult(),
			execResult: {
				...createBaseTxResult().execResult,
				logs,
			},
		}
		const cumulativeGasUsed = 30000n

		// Generate receipt
		const receipt = await generateTxReceipt(vm)(tx, txResult, cumulativeGasUsed)

		// Verify receipt contains the logs
		expect(receipt).toEqual({
			status: 1,
			cumulativeBlockGasUsed: cumulativeGasUsed,
			bitvector: txResult.bloom.bitvector,
			logs,
		})
	})
})
