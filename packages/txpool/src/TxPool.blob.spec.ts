import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { LegacyTransaction } from '@tevm/tx'
import { EthjsAccount, EthjsAddress, hexToBytes, parseEther } from '@tevm/utils'
import { type Vm, createVm } from '@tevm/vm'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PREFUNDED_PRIVATE_KEYS } from '../../utils/dist/index.cjs'
import { TxPool } from './TxPool.js'

// Mock the BlobEIP4844Transaction class
vi.mock('@tevm/tx', async (importOriginal) => {
	const originalModule = await importOriginal()
	return {
		...originalModule,
		BlobEIP4844Transaction: class MockBlobEIP4844Transaction {
			constructor(data = {}) {
				Object.assign(this, data)
			}
			static isBlobEIP4844Tx() {
				return true
			}
			isSigned() {
				return true
			}
			getSenderAddress() {
				return EthjsAddress.fromString('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
			}
			hash() {
				return new Uint8Array(32).fill(1)
			}
		},
		// Add flag for transaction type checks
		isBlobEIP4844Tx: (tx) =>
			tx instanceof originalModule.BlobEIP4844Transaction || tx.constructor.name === 'MockBlobEIP4844Transaction',
	}
})

describe('TxPool with Blob Transactions', () => {
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

	it('should track blob count in txsByPriceAndNonce', async () => {
		// Create a special test method that directly calls the txsByPriceAndNonce method
		// with a manually crafted blob transaction
		class TestPool extends TxPool {
			async testWithMockBlob(allowedBlobs = 1) {
				// Create a mock blob transaction
				const { BlobEIP4844Transaction } = await import('@tevm/tx')
				const mockBlob = new BlobEIP4844Transaction({
					nonce: 0n,
					blobs: [new Uint8Array(100)],
					maxFeePerGas: 2000000000n,
					maxPriorityFeePerGas: 1000000000n,
					gasLimit: 21000,
					value: 10000n,
				})

				// Directly manipulate the pool data structure to add our mock blob
				this.txsInPool = 1
				const address = mockBlob.getSenderAddress().toString().slice(2).toLowerCase()
				this.pool.set(address, [
					{
						tx: mockBlob,
						hash: Array.from(mockBlob.hash())
							.map((b) => b.toString(16).padStart(2, '0'))
							.join(''),
						added: Date.now(),
					},
				])

				// Override the heap to return our mock blob
				const originalHeapInsert = Heap.prototype.insert
				const originalHeapRemove = Heap.prototype.remove
				Heap.prototype.insert = vi.fn()
				Heap.prototype.remove = vi.fn().mockImplementation(() => {
					// Only return the mock blob once, then return undefined
					Heap.prototype.remove = vi.fn().mockReturnValue(undefined)
					return mockBlob
				})

				try {
					// Call txsByPriceAndNonce with the allowedBlobs parameter
					return await this.txsByPriceAndNonce({ allowedBlobs })
				} finally {
					// Restore the original heap methods
					Heap.prototype.insert = originalHeapInsert
					Heap.prototype.remove = originalHeapRemove
				}
			}
		}

		const testPool = new TestPool({ vm })

		// Test when blobs are allowed
		const txs1 = await testPool.testWithMockBlob(1)
		expect(txs1.length).toBe(1)

		// Test when blobs exceed limit
		const txs2 = await testPool.testWithMockBlob(0)
		expect(txs2.length).toBe(0)
	})
})

// Mock Heap for the tests
class Heap {
	length = 1
	items = []
	insert(item) {
		this.items.push(item)
	}
	remove() {
		return this.items.pop()
	}
}
