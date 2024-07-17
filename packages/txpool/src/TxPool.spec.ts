import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { LegacyTransaction } from '@tevm/tx'
import { EthjsAccount, EthjsAddress, bytesToHex, hexToBytes, parseEther } from '@tevm/utils'
import { type Vm, createVm } from '@tevm/vm'
import { beforeEach, describe, expect, it } from 'vitest'
import { PREFUNDED_PRIVATE_KEYS, bytesToUnprefixedHex } from '../../utils/dist/index.cjs'
import { TxPool } from './TxPool.js'

describe(TxPool.name, () => {
	let txPool: TxPool
	let vm: Vm
	// , blockchain, stateManager, evm, vm, txPool;

	beforeEach(async () => {
		const common = optimism.copy()
		const blockchain = await createChain({ common })
		const stateManager = createStateManager({})
		await stateManager.putAccount(
			EthjsAddress.fromString('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'),
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
			tx = tx.sign(Buffer.from('4c0883a69102937d6231471b5dbb62f3724b3f5f049cf75984a1e3d8b3b73b7c', 'hex'))

			await txPool.addUnverified(tx)
			const addedTx = txPool.getByHash([tx.hash()])[0]
			expect(addedTx).toBeDefined()
			expect(bytesToHex(addedTx?.hash() as any)).toBe(bytesToHex(tx.hash()))
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
	})
})
