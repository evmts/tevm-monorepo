import { Block } from '@tevm/block'
import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { LegacyTransaction } from '@tevm/tx'
import { EthjsAddress, bytesToHex, createAccount, createAddressFromString, hexToBytes, parseEther } from '@tevm/utils'
import { type Vm, createVm } from '@tevm/vm'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PREFUNDED_PRIVATE_KEYS } from '../../utils/dist/index.cjs'
import { TxPool } from './TxPool.js'

describe('TxPool final coverage', () => {
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

		// Make sure txPool is opened
		txPool.open()
	})

	afterEach(() => {
		// Clean up
		vi.restoreAllMocks()
	})

	describe('cleanup method', () => {
		it('should clean up old transactions', async () => {
			// Create a transaction
			const tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			}).sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// Add to pool
			await txPool.add(tx)

			// Get before count
			const beforeCount = txPool.txsInPool
			expect(beforeCount).toBe(1)

			// Get the timestamp
			const txHash = bytesToHex(tx.hash()).slice(2).toLowerCase()
			const address = tx.getSenderAddress().toString().slice(2).toLowerCase()

			// Get the object from the pool
			const poolObjects = (txPool as any).pool.get(address)
			expect(poolObjects).toBeDefined()
			expect(poolObjects.length).toBe(1)

			// Set the added timestamp to be old
			const oldTimestamp = Date.now() - (txPool.POOLED_STORAGE_TIME_LIMIT * 60 * 1000 + 5000)
			poolObjects[0].added = oldTimestamp

			// Also set the handled timestamp to be old
			const handled = (txPool as any).handled.get(txHash)
			handled.added = oldTimestamp

			// Run cleanup
			txPool.cleanup()

			// Check that the transaction was removed
			expect(txPool.txsInPool).toBe(0)
			expect((txPool as any).pool.size).toBe(0)

			// Add a handled entry that's very old
			const veryOldTimestamp = Date.now() - (txPool.HANDLED_CLEANUP_TIME_LIMIT * 60 * 1000 + 5000)
			;(txPool as any).handled.set('testoldtx', {
				address: 'testaddress',
				added: veryOldTimestamp,
			})

			// Run cleanup again
			txPool.cleanup()

			// Should have removed the old handled entry
			expect((txPool as any).handled.has('testoldtx')).toBe(false)
		})
	})

	describe('stop method', () => {
		it('should stop the pool if running', async () => {
			// Make sure the pool is running
			txPool.running = true

			// Mock clearInterval
			const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

			// Stop the pool
			const result = txPool.stop()

			// Should return true and clear intervals
			expect(result).toBe(true)
			expect(clearIntervalSpy).toHaveBeenCalled()
			expect(txPool.running).toBe(false)

			// Stopping again should return false
			const result2 = txPool.stop()
			expect(result2).toBe(false)
		})
	})

	describe('getTransactionStatus method', () => {
		it('should return correct status for transactions', async () => {
			// Create and add a transaction
			const tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			}).sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			await txPool.add(tx)

			// Get the hash
			const txHash = bytesToHex(tx.hash())

			// Should be pending
			const status1 = await txPool.getTransactionStatus(txHash)
			expect(status1).toBe('pending')

			// Now remove from pool
			const txPoolAny = txPool as any
			const unprefixedHash = txHash.slice(2).toLowerCase()
			txPoolAny.removeByHash(unprefixedHash)

			// But keep it in handled map (simulating a mined transaction)
			// It's already in the handled map from the previous add operation

			// Should be mined
			const status2 = await txPool.getTransactionStatus(txHash)
			expect(status2).toBe('mined')

			// Now test an unknown transaction
			const status3 = await txPool.getTransactionStatus('0xffeeddccbbaa9988776655443322110000112233')
			expect(status3).toBe('unknown')
		})
	})

	describe('onBlockAdded method', () => {
		it('should remove transactions when blocks are added', async () => {
			// Create and add a transaction
			const tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			}).sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			await txPool.add(tx)

			// Verify it's in the pool
			expect(txPool.txsInPool).toBe(1)

			// Create a mock block with this transaction
			const mockBlock = {
				transactions: [tx],
			} as unknown as Block

			// Mock the removeNewBlockTxs method
			const removeNewBlockTxsSpy = vi.spyOn(txPool, 'removeNewBlockTxs')

			// Call onBlockAdded
			await txPool.onBlockAdded(mockBlock)

			// Should have called removeNewBlockTxs
			expect(removeNewBlockTxsSpy).toHaveBeenCalledWith([mockBlock])
		})
	})

	describe('getPendingTransactions method', () => {
		it('should return all pending transactions', async () => {
			// Create and add transactions
			const tx1 = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			}).sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			const tx2 = new LegacyTransaction({
				nonce: 1,
				gasPrice: 2000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 20000,
				data: '0x',
			}).sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			await txPool.add(tx1)
			await txPool.add(tx2)

			// Get pending transactions
			const pendingTxs = await txPool.getPendingTransactions()

			// Should have both transactions
			expect(pendingTxs.length).toBe(2)
		})
	})
})
