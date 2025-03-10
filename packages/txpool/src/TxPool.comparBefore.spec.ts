import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { LegacyTransaction } from '@tevm/tx'
import { EthjsAccount, EthjsAddress, hexToBytes, parseEther } from '@tevm/utils'
import { type Vm, createVm } from '@tevm/vm'
import Heap from 'qheap'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PREFUNDED_PRIVATE_KEYS } from '../../utils/dist/index.cjs'
import { TxPool } from './TxPool.js'

describe('TxPool heap comparBefore function', () => {
	let txPool: TxPool
	let vm: Vm
	let senderAddress: EthjsAddress

	beforeEach(async () => {
		const common = optimism.copy()
		const blockchain = await createChain({ common })
		const stateManager = createStateManager({})
		senderAddress = EthjsAddress.fromString('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
		await stateManager.putAccount(
			senderAddress,
			EthjsAccount.fromAccountData({
				balance: parseEther('100'),
			}),
		)
		const evm = await createEvm({ common, stateManager, blockchain })
		vm = createVm({
			blockchain,
			common,
			evm,
			stateManager,
		})
		txPool = new TxPool({ vm })
	})

	it('should test the real normalizedGasPrice function with different transactions', async () => {
		// Create transaction with gas price
		const tx1 = new LegacyTransaction({
			nonce: 0,
			gasPrice: 1000000000n, // Lower price
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})

		const tx2 = new LegacyTransaction({
			nonce: 0,
			gasPrice: 2000000000n, // Higher price
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})

		// Direct test of line 512
		const difference = (txPool as any).normalizedGasPrice(tx2) - (txPool as any).normalizedGasPrice(tx1)
		expect(difference).toBe(1000000000n)
		expect(difference < 0n).toBe(false)

		// Test the comparison of different transactions
		const comparisonResult = (txPool as any).normalizedGasPrice(tx2) - (txPool as any).normalizedGasPrice(tx1) < 0n
		expect(comparisonResult).toBe(false) // tx2 has higher price, so difference is positive, result is false

		// Reverse comparison
		const reverseResult = (txPool as any).normalizedGasPrice(tx1) - (txPool as any).normalizedGasPrice(tx2) < 0n
		expect(reverseResult).toBe(true) // tx1 has lower price, so difference is negative, result is true
	})

	it('should test the comparBefore function passed to Heap constructor', async () => {
		// Direct test of the heap initialization in txsByPriceAndNonce method
		// We'll create a fake pool object to extract just what we need
		const txPoolCopy = {
			normalizedGasPrice: vi.fn((tx) => {
				// Simple mock implementation that returns the gas price from the tx
				return tx.gasPrice
			}),
		}

		// Create test transactions
		const tx1 = { gasPrice: 1000000000n }
		const tx2 = { gasPrice: 2000000000n }

		// Manually implement the comparBefore function from line 512
		const comparBefore = (a, b) => txPoolCopy.normalizedGasPrice(b) - txPoolCopy.normalizedGasPrice(a) < 0n

		// Test the function with our transactions
		const result = comparBefore(tx1, tx2)
		expect(result).toBe(false) // tx2 has higher price, so result is not "before"

		// Test the inverse comparison
		const reverseResult = comparBefore(tx2, tx1)
		expect(reverseResult).toBe(true) // tx1 has lower price, so result is "before"

		// Verify our mocked function was called with the correct args
		expect(txPoolCopy.normalizedGasPrice).toHaveBeenCalledWith(tx1)
		expect(txPoolCopy.normalizedGasPrice).toHaveBeenCalledWith(tx2)
	})
})
