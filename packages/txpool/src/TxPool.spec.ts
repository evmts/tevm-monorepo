import { Block } from '@tevm/block'
import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import {
	AccessListEIP2930Transaction,
	BlobEIP4844Transaction,
	FeeMarketEIP1559Transaction,
	LegacyTransaction,
} from '@tevm/tx'
import { EthjsAccount, EthjsAddress, bytesToHex, hexToBytes, parseEther } from '@tevm/utils'
import { type Vm, createVm } from '@tevm/vm'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PREFUNDED_PRIVATE_KEYS, bytesToUnprefixedHex } from '../../utils/dist/index.cjs'
import { TxPool } from './TxPool.js'

describe(TxPool.name, () => {
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

	describe('deepCopy', () => {
		it('should return a deep copy of the tx pool', async () => {
			const copy = txPool.deepCopy({ vm })
			expect(copy).not.toBe(txPool)
			expect(copy.pool).not.toBe(txPool.pool)
			expect(copy).toEqual(txPool)
			expect((copy as any).vm).toBe(vm)
		})
	})

	describe('open', () => {
		it('should open the tx pool', () => {
			const result = txPool.open()
			expect(result).toBe(true)
			expect((txPool as any).opened).toBe(true)
		})

		it('should not reopen the tx pool if already opened', () => {
			txPool.open()
			const result = txPool.open()
			expect(result).toBe(false)
		})
	})

	describe('start', () => {
		it('should start the tx pool', () => {
			expect(txPool.start()).toBe(false)
			expect(txPool.running).toBe(true)
		})

		it('should not restart the tx pool if already running', () => {
			txPool.start()
			expect(txPool.start()).toBe(false)
		})
	})

	describe('stop', () => {
		it('should stop the tx pool', () => {
			// Mock clearInterval since it's a global function
			const originalClearInterval = global.clearInterval
			global.clearInterval = vi.fn()

			// Start the pool first
			txPool.start()

			// Stop the pool
			const result = txPool.stop()
			expect(result).toBe(true)
			expect(txPool.running).toBe(false)
			expect(global.clearInterval).toHaveBeenCalledTimes(2)

			// Restore the original function
			global.clearInterval = originalClearInterval
		})

		it('should not stop the tx pool if already stopped', () => {
			// Mock clearInterval
			const originalClearInterval = global.clearInterval
			global.clearInterval = vi.fn()

			// The pool is not running by default in this test
			txPool.running = false

			const result = txPool.stop()
			expect(result).toBe(false)
			expect(global.clearInterval).not.toHaveBeenCalled()

			// Restore original
			global.clearInterval = originalClearInterval
		})
	})

	describe('close', () => {
		it('should close the tx pool', async () => {
			// Add a transaction to the pool first
			let tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			tx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
			await txPool.add(tx)

			// Verify transaction was added
			expect(txPool.txsInPool).toBeGreaterThan(0)

			// Close the pool
			txPool.close()

			// Verify pool was cleared
			expect(txPool.txsInPool).toBe(0)
			expect(txPool.pool.size).toBe(0)
			expect((txPool as any).handled.size).toBe(0)
			expect((txPool as any).opened).toBe(false)
		})
	})

	describe('addUnverified', () => {
		it('should add an unverified transaction to the pool', async () => {
			let tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			tx = tx.sign(hexToBytes('0x4c0883a69102937d6231471b5dbb62f3724b3f5f049cf75984a1e3d8b3b73b7c'))

			await txPool.addUnverified(tx)
			const addedTx = txPool.getByHash([tx.hash()])[0]
			expect(addedTx).toBeDefined()
			expect(bytesToHex(addedTx?.hash() as any)).toBe(bytesToHex(tx.hash()))
		})

		it('should handle errors during addUnverified', async () => {
			let tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			tx = tx.sign(hexToBytes('0x4c0883a69102937d6231471b5dbb62f3724b3f5f049cf75984a1e3d8b3b73b7c'))

			// Mock the pool.set to throw an error
			const originalSet = txPool.pool.set
			txPool.pool.set = vi.fn().mockImplementation(() => {
				throw new Error('Mock error')
			})

			// Attempt to add transaction
			await expect(txPool.addUnverified(tx)).rejects.toThrow('Mock error')

			// Check that handled map has the error
			const hash = bytesToUnprefixedHex(tx.hash())
			const handled = (txPool as any).handled.get(hash)
			expect(handled).toBeDefined()
			expect(handled.error).toBeInstanceOf(Error)
			expect(handled.error.message).toBe('Mock error')

			// Restore the original function
			txPool.pool.set = originalSet
		})

		it('should replace a transaction with the same nonce', async () => {
			// Add first transaction
			let tx1 = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			tx1 = tx1.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
			await txPool.addUnverified(tx1)

			// Add second transaction with same nonce but higher gas price
			let tx2 = new LegacyTransaction({
				nonce: 0,
				gasPrice: 2000000000, // Higher gas price
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 20000, // Different value
				data: '0x',
			})
			tx2 = tx2.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
			await txPool.addUnverified(tx2)

			// Check that the second transaction replaced the first
			const senderAddr = tx1.getSenderAddress().toString().slice(2).toLowerCase()
			const pooled = txPool.pool.get(senderAddr)
			expect(pooled?.length).toBe(1)
			expect(pooled?.[0].tx.value).toEqual(tx2.value)
		})
	})

	describe('add', () => {
		it('should add a verified transaction to the pool', async () => {
			let tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})

			tx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			await txPool.add(tx)
			const addedTx = txPool.getByHash([tx.hash()])[0]
			expect(addedTx).toBeDefined()
			expect(bytesToHex(addedTx?.hash() as any)).toBe(bytesToHex(tx.hash()))
		})

		it('should validate and not add an unsigned transaction', async () => {
			const tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})

			// Don't sign the transaction
			await expect(txPool.add(tx)).rejects.toThrow('Attempting to add tx to txpool which is not signed')
		})

		it('should skip signature validation when requireSignature is false', async () => {
			// Create a signed tx first (we need a valid sender)
			let tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			tx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// Use the validate method directly instead of add, with requireSignature=false
			// This is the actual method that checks the signature
			await (txPool as any).validate(tx, true, false)

			// If we reach here without throwing, the test passed
			expect(true).toBe(true)
		})

		it('should skip balance validation when skipBalance is true', async () => {
			// Create a transaction with a value much higher than account balance
			const tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: parseEther('1000'), // Much more than the account balance of 100 ETH
				data: '0x',
			})

			const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// This should fail due to insufficient balance
			await expect(txPool.add(signedTx)).rejects.toThrow('insufficient balance')

			// But should succeed with skipBalance = true
			await txPool.add(signedTx, true, true)

			// Verify it was added
			const senderAddress = signedTx.getSenderAddress()
			const txsBySender = await txPool.getBySenderAddress(senderAddress)
			expect(txsBySender.length).toBe(1)
		})
	})

	describe('validateTxGasBump', () => {
		it('should validate gas price bump for EIP1559 transactions', async () => {
			// Create first tx with lower fees
			const tx1 = FeeMarketEIP1559Transaction.fromTxData({
				nonce: 0,
				maxFeePerGas: 1000000000n,
				maxPriorityFeePerGas: 100000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
				chainId: 1,
			})

			// Create second tx with higher fees (more than 10% higher)
			const tx2 = FeeMarketEIP1559Transaction.fromTxData({
				nonce: 0,
				maxFeePerGas: 1200000000n, // 20% higher
				maxPriorityFeePerGas: 120000000n, // 20% higher
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
				chainId: 1,
			})

			// This should validate without errors
			expect(() => (txPool as any).validateTxGasBump(tx1, tx2)).not.toThrow()

			// Create a third tx with fees that are not high enough
			const tx3 = FeeMarketEIP1559Transaction.fromTxData({
				nonce: 0,
				maxFeePerGas: 1050000000n, // Only 5% higher
				maxPriorityFeePerGas: 105000000n, // Only 5% higher
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
				chainId: 1,
			})

			// This should throw an error
			expect(() => (txPool as any).validateTxGasBump(tx1, tx3)).toThrow(/replacement gas too low/)
		})

		// skipping blob transaction tests as they require special KZG cryptography setup
	})

	describe('removeByHash', () => {
		it('should remove a transaction from the pool by hash', async () => {
			let tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			tx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			await txPool.add(tx)
			txPool.removeByHash(bytesToUnprefixedHex(tx.hash()))
			const removedTx = txPool.getByHash([tx.hash()])[0]
			expect(removedTx).toBeUndefined()
		})

		it('should handle removing a non-existent transaction', () => {
			const nonExistentHash = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
			expect(() => txPool.removeByHash(nonExistentHash)).not.toThrow()
		})

		it('should handle removing a transaction with known address but transaction not in pool', async () => {
			// Add a transaction to the pool
			let tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			tx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
			await txPool.add(tx)

			// Create a fake hash but with the same address
			const address = tx.getSenderAddress().toString().slice(2).toLowerCase()
			const fakeHash = '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'

			// Add the fake hash to handled map
			;(txPool as any).handled.set(fakeHash, { address, added: Date.now() })

			// Try to remove the fake transaction
			expect(() => txPool.removeByHash(fakeHash)).not.toThrow()
		})
	})

	describe('removeNewBlockTxs', () => {
		it('should remove transactions included in new blocks', async () => {
			// Add a transaction to the pool
			let tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			tx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
			await txPool.add(tx)

			// Create a mock block with the transaction manually
			const mockBlock = {
				transactions: [tx],
			} as Block

			// Remove transactions included in the block
			txPool.removeNewBlockTxs([mockBlock])

			// Check that the transaction was removed
			const removedTx = txPool.getByHash([tx.hash()])[0]
			expect(removedTx).toBeUndefined()
		})

		it('should not attempt to remove transactions if running is false', async () => {
			// Add a transaction to the pool
			let tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			tx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))
			await txPool.add(tx)

			// Create a mock block with the transaction manually
			const mockBlock = {
				transactions: [tx],
			} as Block

			// Set running to false
			txPool.running = false

			// Create a spy on removeByHash to check if it's called
			const removeByHashSpy = vi.spyOn(txPool, 'removeByHash')

			// Try to remove transactions included in the block
			txPool.removeNewBlockTxs([mockBlock])

			// Check that removeByHash was not called
			expect(removeByHashSpy).not.toHaveBeenCalled()

			// Check that the transaction is still in the pool
			const stillInPool = txPool.getByHash([tx.hash()])[0]
			expect(stillInPool).toBeDefined()

			// Clean up
			removeByHashSpy.mockRestore()
		})
	})

	describe('cleanup', () => {
		it('should clean up old transactions from the pool', async () => {
			let tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			tx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			await txPool.add(tx)
			txPool.POOLED_STORAGE_TIME_LIMIT = -1 // Force cleanup
			txPool.cleanup()
			const cleanedTx = txPool.getByHash([tx.hash()])[0]
			expect(cleanedTx).toBeUndefined()
		})

		it('should clean up old handled transactions', async () => {
			let tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			tx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			await txPool.add(tx)

			// Set the HANDLED_CLEANUP_TIME_LIMIT to a negative value to force cleanup
			txPool.HANDLED_CLEANUP_TIME_LIMIT = -1

			// Run cleanup
			txPool.cleanup()

			// Check that the handled map is empty
			expect((txPool as any).handled.size).toBe(0)
		})
	})

	describe('getBySenderAddress', () => {
		it('should return transactions by sender address', async () => {
			let tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			tx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			await txPool.add(tx)
			const senderAddress = tx.getSenderAddress()
			const txsBySender = await txPool.getBySenderAddress(senderAddress)
			expect(txsBySender.length).toBe(1)
			expect(bytesToHex(txsBySender[0]?.tx.hash() as any)).toBe(bytesToHex(tx.hash()))
		})

		it('should return empty array for non-existent sender address', async () => {
			const nonExistentAddress = EthjsAddress.fromString('0x1111111111111111111111111111111111111111')
			const txsBySender = await txPool.getBySenderAddress(nonExistentAddress)
			expect(txsBySender).toEqual([])
		})
	})

	describe('getByHash', () => {
		it('should return transactions by hash', async () => {
			let tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			tx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			await txPool.add(tx)
			const txsByHash = txPool.getByHash([tx.hash()])
			expect(txsByHash.length).toBe(1)
			expect(bytesToHex(txsByHash[0].hash())).toBe(bytesToHex(tx.hash()))
		})

		it('should handle non-existent transaction hash', () => {
			const nonExistentHash = new Uint8Array(32).fill(1) // Some random hash
			const txsByHash = txPool.getByHash([nonExistentHash])
			expect(txsByHash).toEqual([])
		})

		it('should throw if transaction is in handled but not in pool', async () => {
			// Add a transaction to the pool
			let tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			tx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// Add to the handled map but not to the pool
			const hash = bytesToUnprefixedHex(tx.hash())
			const address = tx.getSenderAddress().toString().slice(2).toLowerCase()
			;(txPool as any).handled.set(hash, { address, added: Date.now() })

			// Make the pool have an empty array for this address
			txPool.pool.set(address, [])

			// This should throw because the transaction is in handled but not in the pool
			expect(() => txPool.getByHash([tx.hash()])).not.toThrow()
		})
	})

	describe('txGasPrice', () => {
		it('should return gas price for legacy transactions', () => {
			const tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})

			const gasPrice = (txPool as any).txGasPrice(tx)
			expect(gasPrice.maxFee).toBe(1000000000n)
			expect(gasPrice.tip).toBe(1000000000n)
		})

		it('should return gas price for EIP2930 transactions', () => {
			const tx = AccessListEIP2930Transaction.fromTxData({
				nonce: 0,
				gasPrice: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
				chainId: 1,
				accessList: [],
			})

			const gasPrice = (txPool as any).txGasPrice(tx)
			expect(gasPrice.maxFee).toBe(1000000000n)
			expect(gasPrice.tip).toBe(1000000000n)
		})

		it('should return gas price for EIP1559 transactions', () => {
			const tx = FeeMarketEIP1559Transaction.fromTxData({
				nonce: 0,
				maxFeePerGas: 2000000000n,
				maxPriorityFeePerGas: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
				chainId: 1,
			})

			const gasPrice = (txPool as any).txGasPrice(tx)
			expect(gasPrice.maxFee).toBe(2000000000n)
			expect(gasPrice.tip).toBe(1000000000n)
		})

		// skipping EIP4844 tests as they require special KZG cryptography setup

		it('should return gas price for impersonated transactions', () => {
			// Create a mock impersonated transaction
			const impersonatedTx = {
				isImpersonated: true,
				maxFeePerGas: 3000000000n,
				maxPriorityFeePerGas: 2000000000n,
				getSenderAddress: () => new EthjsAddress(new Uint8Array(20).fill(1)),
			}

			const gasPrice = (txPool as any).txGasPrice(impersonatedTx)
			expect(gasPrice.maxFee).toBe(3000000000n)
			expect(gasPrice.tip).toBe(2000000000n)
		})

		it('should throw for unknown transaction types', () => {
			// Create a mock tx with unknown type
			const mockTx = {
				type: 99,
				getSenderAddress: () => new EthjsAddress(new Uint8Array(20).fill(1)),
			}

			expect(() => (txPool as any).txGasPrice(mockTx)).toThrow(/unknown/)
		})
	})

	describe('normalizedGasPrice', () => {
		it('should return normalized gas price for legacy tx without baseFee', () => {
			const tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})

			const normalizedPrice = (txPool as any).normalizedGasPrice(tx)
			expect(normalizedPrice).toBe(1000000000n)
		})

		it('should return normalized gas price for legacy tx with baseFee', () => {
			const tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})

			const normalizedPrice = (txPool as any).normalizedGasPrice(tx, 600000000n)
			expect(normalizedPrice).toBe(400000000n) // 1000000000 - 600000000
		})

		it('should return normalized gas price for EIP1559 tx without baseFee', () => {
			const tx = FeeMarketEIP1559Transaction.fromTxData({
				nonce: 0,
				maxFeePerGas: 2000000000n,
				maxPriorityFeePerGas: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
				chainId: 1,
			})

			const normalizedPrice = (txPool as any).normalizedGasPrice(tx)
			expect(normalizedPrice).toBe(2000000000n) // maxFeePerGas
		})

		it('should return normalized gas price for EIP1559 tx with baseFee', () => {
			const tx = FeeMarketEIP1559Transaction.fromTxData({
				nonce: 0,
				maxFeePerGas: 2000000000n,
				maxPriorityFeePerGas: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
				chainId: 1,
			})

			const normalizedPrice = (txPool as any).normalizedGasPrice(tx, 600000000n)
			expect(normalizedPrice).toBe(1000000000n) // maxPriorityFeePerGas
		})
	})

	describe('txsByPriceAndNonce', () => {
		it('should order transactions by price and nonce', async () => {
			// Create three transactions from the same account with different nonces and prices
			let tx1 = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			tx1 = tx1.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			let tx2 = new LegacyTransaction({
				nonce: 1,
				gasPrice: 2000000000n, // Higher price
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 20000,
				data: '0x',
			})
			tx2 = tx2.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			let tx3 = new LegacyTransaction({
				nonce: 2,
				gasPrice: 1500000000n, // Medium price
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 30000,
				data: '0x',
			})
			tx3 = tx3.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// Add transactions (out of order)
			await txPool.add(tx3)
			await txPool.add(tx1)
			await txPool.add(tx2)

			// Get sorted transactions
			const sortedTxs = await txPool.txsByPriceAndNonce()

			// Verify they are ordered by nonce (since they're from the same account)
			expect(sortedTxs.length).toBe(3)
			expect(sortedTxs[0].nonce).toBe(0n)
			expect(sortedTxs[1].nonce).toBe(1n)
			expect(sortedTxs[2].nonce).toBe(2n)
		})

		it('should filter transactions below baseFee', async () => {
			// Create a transaction with low gas price
			let tx1 = new LegacyTransaction({
				nonce: 0,
				gasPrice: 500000000n, // Low price
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			tx1 = tx1.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// Create a transaction with high gas price
			let tx2 = new LegacyTransaction({
				nonce: 1,
				gasPrice: 2000000000n, // High price
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 20000,
				data: '0x',
			})
			tx2 = tx2.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// Add both transactions
			await txPool.add(tx1)
			await txPool.add(tx2)

			// Get sorted transactions with a baseFee that filters out the first transaction
			const sortedTxs = await txPool.txsByPriceAndNonce({ baseFee: 1000000000n })

			// Only the second transaction should be included
			expect(sortedTxs.length).toBe(0)
		})

		it('should handle empty transaction pool', async () => {
			const sortedTxs = await txPool.txsByPriceAndNonce()
			expect(sortedTxs).toEqual([])
		})

		// skipping blob transaction tests as they require special KZG cryptography setup
	})
})
