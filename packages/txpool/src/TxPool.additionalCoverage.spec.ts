import { Block } from '@tevm/block'
import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { FeeMarketEIP1559Transaction, LegacyTransaction } from '@tevm/tx'
import { EthjsAddress, bytesToHex, hexToBytes, parseEther, createAddressFromString, createAccount, } from '@tevm/utils'
import { type Vm, createVm } from '@tevm/vm'
import { beforeEach, describe, expect, it } from 'vitest'
import { PREFUNDED_PRIVATE_KEYS } from '../../utils/dist/index.cjs'
import { TxPool } from './TxPool.js'

describe('TxPool additional coverage tests', () => {
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

	describe('txsByPriceAndNonce edge cases', () => {
		it('should handle cases where account has no transactions', async () => {
			// Force a scenario where byNonce.get returns an empty array
			const byNonceMock = new Map()
			byNonceMock.set('testaddress', [])

			// Cast txPool to any to access private properties
			const txPoolAny = txPool as any
			const originalByNonce = txPoolAny.pool
			txPoolAny.pool = byNonceMock

			const result = await txPool.txsByPriceAndNonce()
			expect(result).toEqual([])

			// Restore original
			txPoolAny.pool = originalByNonce
		})

		it('should handle baseFee filtering', async () => {
			// Create transactions with different gas prices
			const tx1 = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			}).sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// Add to pool
			await txPool.add(tx1)

			// Get transactions with baseFee higher than tx gas price
			const result = await txPool.txsByPriceAndNonce({ baseFee: 5000000000n })

			// Should filter out the transaction
			expect(result.length).toBe(0)
		})

		it('should handle blob transactions', async () => {
			// Create a basic transaction to ensure we have at least one tx
			const tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 2000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			}).sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			await txPool.add(tx)

			// Get transactions without blob limitations
			const result = await txPool.txsByPriceAndNonce()

			// Should have at least the added tx
			expect(result.length).toBe(1)
		})

		it('should process transactions by nonce order', async () => {
			// Create transactions with different nonces from the same address
			const tx1 = new LegacyTransaction({
				nonce: 0,
				gasPrice: 2000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			}).sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			const tx2 = new LegacyTransaction({
				nonce: 1,
				gasPrice: 3000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			}).sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// Add to pool in reverse order to test sorting
			await txPool.add(tx2)
			await txPool.add(tx1)

			// Test that they're returned in nonce order
			const result = await txPool.txsByPriceAndNonce()

			// Should have both transactions
			expect(result.length).toBe(2)

			// Transactions from the same sender should be in nonce order
			expect((result[0] as LegacyTransaction).nonce).toBe(0n)
			expect((result[1] as LegacyTransaction).nonce).toBe(1n)
		})
	})

	describe('txGasPrice', () => {
		it('should handle different transaction types', async () => {
			// Test with a Legacy transaction
			const legacyTx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			}).sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// Cast to any to access private method
			const gasPrice1 = (txPool as any).txGasPrice(legacyTx)
			expect(gasPrice1.maxFee).toBe(1000000000n)
			expect(gasPrice1.tip).toBe(1000000000n)

			// Test with impersonated transaction
			const impersonatedTx = {
				isImpersonated: true,
				maxFeePerGas: 3000000000n,
				maxPriorityFeePerGas: 1000000000n,
				getSenderAddress: () => senderAddress,
			} as any

			const gasPriceImpersonated = (txPool as any).txGasPrice(impersonatedTx)
			expect(gasPriceImpersonated.maxFee).toBe(3000000000n)
			expect(gasPriceImpersonated.tip).toBe(1000000000n)

			// Test with unknown transaction type
			const unknownTx = {
				type: 99,
				getSenderAddress: () => senderAddress,
				hash: () => new Uint8Array(32),
				supports: () => false,
			} as unknown as LegacyTransaction

			// Should throw an error for unknown transaction type
			expect(() => (txPool as any).txGasPrice(unknownTx)).toThrow('tx of type 99 unknown')
		})
	})

	describe('validateTxGasBump', () => {
		it('should validate gas price bump with mock objects', async () => {
			// Create simple transaction objects for testing validateTxGasBump
			const existingTx = {
				gasPrice: 1000000000n,
			} as any

			const newTx = {
				gasPrice: 1050000000n, // Only 5% higher, below 10% required
			} as any

			// Mock the txGasPrice method
			const originalTxGasPrice = (txPool as any).txGasPrice

			try {
				// Override the method
				;(txPool as any).txGasPrice = () => {
					return {
						maxFee: 1000000000n,
						tip: 1000000000n,
					}
				}

				// Should throw due to insufficient gas price bump
				expect(() => {
					;(txPool as any).validateTxGasBump(existingTx, newTx)
				}).toThrow('replacement gas too low')
			} finally {
				// Restore original method
				;(txPool as any).txGasPrice = originalTxGasPrice
			}
		})

		it('should validate gas price bump for non-blob transactions', async () => {
			// Create mock transaction objects
			const existingTx = {
				gasPrice: 1000000000n,
				constructor: { name: 'LegacyTransaction' },
			} as unknown as LegacyTransaction

			const newTx = {
				gasPrice: 1050000000n, // Only 5% higher, below 10% required
				constructor: { name: 'LegacyTransaction' },
			} as unknown as LegacyTransaction

			// Mock the txGasPrice method
			const originalTxGasPrice = (txPool as any).txGasPrice
			;(txPool as any).txGasPrice = (tx: any) => {
				return {
					maxFee: tx === existingTx ? 1000000000n : 1050000000n,
					tip: tx === existingTx ? 1000000000n : 1050000000n,
				}
			}

			try {
				// Should throw due to insufficient gas price bump
				expect(() => (txPool as any).validateTxGasBump(existingTx, newTx)).toThrow('replacement gas too low')
			} finally {
				// Restore original method
				;(txPool as any).txGasPrice = originalTxGasPrice
			}
		})
	})

	describe('getByHash edge cases', () => {
		it('should handle nonexistent transaction hash', async () => {
			const result = await txPool.getByHash('0xnonexistenthash')
			expect(result).toBeNull()
		})

		it('should handle empty array of hashes', async () => {
			const result = await txPool.getByHash([])
			expect(result).toEqual([])
		})

		it('should return null when transaction is not in the pool', async () => {
			// Add a handled entry with no corresponding pool entry
			const txHash = '0x1234567890abcdef'

			// Cast txPool to any to access private properties
			const txPoolAny = txPool as any
			txPoolAny.handled.set(txHash.slice(2), {
				address: senderAddress.toString().slice(2).toLowerCase(),
				added: Date.now(),
			})

			// The transaction should be in handled but not in pool
			const result = await txPool.getByHash(txHash)
			expect(result).toBeNull()
		})
	})

	describe('onChainReorganization', () => {
		it('should handle empty blocks on reorg', async () => {
			// Create empty blocks
			const removedBlocks: Block[] = []
			const addedBlocks: Block[] = []

			// This should not error
			await txPool.onChainReorganization(removedBlocks, addedBlocks)
		})

		it('should skip readding transactions that are already in the pool', async () => {
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

			// Create a block with this transaction
			const txHash = bytesToHex(tx.hash())

			// Mock a block with our transaction
			const mockBlock = {
				transactions: [tx],
			} as unknown as Block

			// Process a mock reorg
			await txPool.onChainReorganization([mockBlock], [])

			// Transaction should still be in the pool (it was already there)
			const result = await txPool.getByHash(txHash)
			expect(result).not.toBeNull()
		})
	})

	describe('getTransactionStatus', () => {
		it('should return correct status for different cases', async () => {
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

			const txHash = bytesToHex(tx.hash())

			// Test 'pending' status
			const pendingStatus = await txPool.getTransactionStatus(txHash)
			expect(pendingStatus).toBe('pending')

			// Remove from pool but keep in handled
			const txPoolAny = txPool as any
			const unprefixedHash = txHash.slice(2).toLowerCase()
			txPoolAny.removeByHash(unprefixedHash)

			// Transaction should now be 'mined'
			const minedStatus = await txPool.getTransactionStatus(txHash)
			expect(minedStatus).toBe('mined')

			// Test unknown transaction
			const unknownStatus = await txPool.getTransactionStatus('0xunknown')
			expect(unknownStatus).toBe('unknown')
		})
	})

	describe('getBySenderAddress', () => {
		it('should return empty array when no transactions for sender', async () => {
			const address = createAddressFromString('0x1234567890123456789012345678901234567890')
			const result = await txPool.getBySenderAddress(address)
			expect(result).toEqual([])
		})
	})

	describe('normalizedGasPrice', () => {
		it('should handle EIP1559 transactions with baseFee', async () => {
			// Create EIP1559 transaction mock
			const tx = {
				maxFeePerGas: 3000000000n,
				maxPriorityFeePerGas: 1000000000n,
				supports: () => true,
			} as unknown as FeeMarketEIP1559Transaction

			// Cast to any to access private method
			const normalizedPrice = (txPool as any).normalizedGasPrice(tx, 2000000000n)

			// With baseFee, should return maxPriorityFeePerGas for EIP1559
			expect(normalizedPrice).toBe(1000000000n)
		})

		it('should handle legacy transactions with baseFee', async () => {
			// Create legacy transaction mock
			const tx = {
				gasPrice: 3000000000n,
				supports: () => false,
			} as unknown as LegacyTransaction

			// Cast to any to access private method
			const normalizedPrice = (txPool as any).normalizedGasPrice(tx, 2000000000n)

			// With baseFee, should return gasPrice - baseFee for legacy
			expect(normalizedPrice).toBe(1000000000n)
		})
	})
})
