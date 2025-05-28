import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { LegacyTransaction, TransactionFactory } from '@tevm/tx'
import { EthjsAddress, createAccount, createAddressFromString, hexToBytes, parseEther } from '@tevm/utils'
import { type Vm, createVm } from '@tevm/vm'
import Heap from 'qheap'
import { beforeEach, describe, expect, it } from 'vitest'
import { PREFUNDED_PRIVATE_KEYS } from '../../utils/dist/index.cjs'
import { TxPool } from './TxPool.js'

describe('TxPool private heap methods', () => {
	let txPool: TxPool
	let vm: Vm
	let senderAddress: EthjsAddress

	beforeEach(async () => {
		const common = optimism.copy()
		const blockchain = await createChain({ common })
		const stateManager = createStateManager({})
		senderAddress = createAddressFromString('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266')
		await stateManager.putAccount(
			senderAddress,
			createAccount({
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

	it('should test the heap comparBefore function directly', async () => {
		// Create two transactions with different gas prices
		const tx1 = new LegacyTransaction({
			nonce: 0,
			gasPrice: 1000000000n,
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

		// Create a heap with our comparison function
		const heap = new Heap({
			comparBefore: (a: any, b: any) =>
				(txPool as any).normalizedGasPrice(b) - (txPool as any).normalizedGasPrice(a) < 0n,
		})

		// Add transactions to the heap
		heap.insert(tx1)
		heap.insert(tx2)

		// The higher price tx should come out first
		const first = heap.remove()
		expect((first as any).gasPrice).toBe(2000000000n)
	})

	it('should test the heap comparBefore function with baseFee', async () => {
		// Create two transactions - one legacy and one EIP1559
		const legacyTx = new LegacyTransaction({
			nonce: 0,
			gasPrice: 1500000000n,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})

		const eip1559Tx = TransactionFactory({
			nonce: 0,
			maxFeePerGas: 2000000000n,
			maxPriorityFeePerGas: 1000000000n,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
			chainId: 1,
			type: 2,
		})

		// With this baseFee, the effective tip of the legacy tx will be 1500000000 - 1000000000 = 500000000
		// The EIP1559 tx has a priority fee of 1000000000, which is higher
		const baseFee = 1000000000n

		// Create a heap with our comparison function using baseFee
		const heap = new Heap({
			comparBefore: (a: any, b: any) =>
				(txPool as any).normalizedGasPrice(b, baseFee) - (txPool as any).normalizedGasPrice(a, baseFee) < 0n,
		})

		// Add transactions to the heap
		heap.insert(legacyTx)
		heap.insert(eip1559Tx)

		// The EIP1559 tx should come out first because it has a higher priority fee
		const first = heap.remove()
		expect(first).toBe(eip1559Tx)

		// The legacy tx should come out second
		const second = heap.remove()
		expect(second).toBe(legacyTx)
	})

	it('should test normalizedGasPrice with zero baseFee', async () => {
		// Create an EIP1559 transaction
		const tx = TransactionFactory({
			nonce: 0,
			maxFeePerGas: 2000000000n,
			maxPriorityFeePerGas: 1000000000n,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
			chainId: 1,
			type: 2,
		})

		// Test with 0n baseFee - this should return maxFeePerGas
		const price = (txPool as any).normalizedGasPrice(tx, 0n)
		expect(price).toBe(2000000000n)
	})

	it('should sort transactions by gas price when calling txsByPriceAndNonce', async () => {
		// Create transactions with different gas prices
		const privateKey = hexToBytes(PREFUNDED_PRIVATE_KEYS[0])

		// Higher gas price transaction
		let highPriceTx = new LegacyTransaction({
			nonce: 0,
			gasPrice: 2000000000n, // 2 Gwei
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		highPriceTx = highPriceTx.sign(privateKey)

		// Lower gas price transaction
		let lowPriceTx = new LegacyTransaction({
			nonce: 1, // Different nonce so both can be in the pool
			gasPrice: 1000000000n, // 1 Gwei
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})
		lowPriceTx = lowPriceTx.sign(privateKey)

		// Add transactions to the pool (add low price first)
		await txPool.add(lowPriceTx)
		await txPool.add(highPriceTx)

		// Get transactions sorted by price and nonce
		const txs = await txPool.txsByPriceAndNonce()

		// Verify the order - highest gas price should be first
		expect(txs.length).toBe(2)
		expect(txs[0]?.hash()).toEqual(highPriceTx.hash())
		expect(txs[1]?.hash()).toEqual(lowPriceTx.hash())

		// Test with a baseFee parameter
		const baseFee = 500000000n // 0.5 Gwei
		const txsWithBaseFee = await txPool.txsByPriceAndNonce({ baseFee })

		// Order should still be the same with baseFee
		expect(txsWithBaseFee.length).toBe(2)
		expect(txsWithBaseFee[0]?.hash()).toEqual(highPriceTx.hash())
		expect(txsWithBaseFee[1]?.hash()).toEqual(lowPriceTx.hash())
	})

	// Test the heap comparison function directly for different transaction order
	it('should correctly compare transactions when they have equal gas price', async () => {
		// Create two transactions with the same gas price
		const tx1 = new LegacyTransaction({
			nonce: 0,
			gasPrice: 1000000000n,
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 10000,
			data: '0x',
		})

		const tx2 = new LegacyTransaction({
			nonce: 0,
			gasPrice: 1000000000n, // Same price
			gasLimit: 21000,
			to: '0x3535353535353535353535353535353535353535',
			value: 20000, // Different value
			data: '0x',
		})

		// Create a heap with our comparison function
		const heap = new Heap({
			comparBefore: (a: any, b: any) =>
				(txPool as any).normalizedGasPrice(b) - (txPool as any).normalizedGasPrice(a) < 0n,
		})

		// Add transactions to the heap
		heap.insert(tx1)
		heap.insert(tx2)

		// With equal gas price, the order of insertion should be preserved
		const first = heap.remove()
		const second = heap.remove()

		expect(first).toBe(tx1) // First inserted
		expect(second).toBe(tx2) // Second inserted
	})
})
