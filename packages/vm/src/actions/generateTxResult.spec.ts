import { afterAll, describe, expect, it, vi } from 'vitest'
import type { BaseVm } from '../BaseVm.js'
import { generateTxReceipt } from './generateTxResult.js'

// We need to mock the module imports inside our function
// Directly create mock objects for our test
const mockCapability = {
	EIP2718TypedTransaction: 'EIP2718TypedTransaction',
}

const mockIsBlobEIP4844Tx = vi.fn((tx: any) => tx.type === 'blob')

// Mock the actual imports in the module we're testing
vi.mock(
	'@tevm/tx',
	() => {
		return {
			Capability: mockCapability,
			isBlobEIP4844Tx: mockIsBlobEIP4844Tx,
		}
	},
	{ virtual: true },
)

// Helper function to create a simplified transaction mock
// Using a type assertion to satisfy the TypedTransaction interface
// This is a test-only simplification
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
		expect(tx.supports).toHaveBeenCalledWith('EIP2718TypedTransaction')

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
		expect(tx.supports).toHaveBeenCalledWith('EIP2718TypedTransaction')

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

	it('should generate a receipt for EIP-2718 typed transaction (non-blob)', async () => {
		// Setup VM mock
		const vm = {
			common: {
				ethjsCommon: {
					gteHardfork: vi.fn(),
				},
			},
		} as unknown as BaseVm

		// EIP-2718 typed transaction (but not blob)
		const tx = createTxMock(true, 'not-blob')

		const txResult = createBaseTxResult()
		const cumulativeGasUsed = 21000n

		// Generate receipt
		const receipt = await generateTxReceipt(vm)(tx, txResult, cumulativeGasUsed)

		// Verify receipt is a typed transaction receipt with status=1 (success)
		expect(receipt).toEqual({
			status: 1,
			cumulativeBlockGasUsed: cumulativeGasUsed,
			bitvector: txResult.bloom.bitvector,
			logs: [],
		})

		// gteHardfork should not be called for typed transactions
		expect(vm.common.ethjsCommon.gteHardfork).not.toHaveBeenCalled()
	})

	it('should generate a receipt for EIP-4844 blob transaction', async () => {
		// Setup VM mock
		const vm = {
			common: {
				ethjsCommon: {
					gteHardfork: vi.fn(),
				},
			},
		} as unknown as BaseVm

		// EIP-4844 blob transaction
		const tx = createTxMock(true, 'blob')

		const txResult = createBaseTxResult()
		const cumulativeGasUsed = 21000n
		const blobGasUsed = 10000n
		const blobGasPrice = 1000n

		// Generate receipt
		const receipt = await generateTxReceipt(vm)(tx, txResult, cumulativeGasUsed, blobGasUsed, blobGasPrice)

		// Verify receipt is a blob transaction receipt with status=1 (success)
		expect(receipt).toEqual({
			status: 1,
			blobGasUsed,
			blobGasPrice,
			cumulativeBlockGasUsed: cumulativeGasUsed,
			bitvector: txResult.bloom.bitvector,
			logs: [],
		})
	})

	it('should generate a receipt for EIP-4844 blob transaction with failed execution', async () => {
		// Setup VM mock
		const vm = {
			common: {
				ethjsCommon: {
					gteHardfork: vi.fn(),
				},
			},
		} as unknown as BaseVm

		// EIP-4844 blob transaction
		const tx = createTxMock(true, 'blob')

		// Create a transaction result with an exception error
		const txResult = {
			...createBaseTxResult(),
			execResult: {
				...createBaseTxResult().execResult,
				exceptionError: { error: 'test error', errorType: 'TestError' },
			},
		}
		const cumulativeGasUsed = 21000n
		const blobGasUsed = 10000n
		const blobGasPrice = 1000n

		// Generate receipt
		const receipt = await generateTxReceipt(vm)(tx, txResult, cumulativeGasUsed, blobGasUsed, blobGasPrice)

		// Verify receipt is a blob transaction receipt with status=0 (failure)
		expect(receipt).toEqual({
			status: 0,
			blobGasUsed,
			blobGasPrice,
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
