import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { LegacyTransaction } from '@tevm/tx'
import { EthjsAddress, bytesToHex, hexToBytes, parseEther, createAddressFromString, createAccount, } from '@tevm/utils'
import { type Vm, createVm } from '@tevm/vm'
import { beforeEach, describe, expect, it } from 'vitest'
import { PREFUNDED_PRIVATE_KEYS } from '../../utils/dist/index.cjs'
import { TxPool } from './TxPool.js'

describe('TxPool missing coverage tests', () => {
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

	describe('txsByPriceAndNonce', () => {
		it('should process transactions correctly with baseFee', async () => {
			// Create transactions with different gas prices
			const tx1 = new LegacyTransaction({
				nonce: 0,
				gasPrice: 5000000000n, // Higher than baseFee
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			}).sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// Add to pool
			await txPool.add(tx1)

			// Get transactions with baseFee lower than tx gas price (should include tx)
			const result = await txPool.txsByPriceAndNonce({ baseFee: 2000000000n })

			// Should include the transaction
			expect(result.length).toBe(1)
		})
	})

	describe('removeByHash with txsByNonce entries', () => {
		it('should clean up txsByNonce entries when removing transactions', async () => {
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

			// Get hash and address
			const txHash = bytesToHex(tx.hash()).slice(2).toLowerCase()
			const address = tx.getSenderAddress().toString().slice(2).toLowerCase()

			// Verify it's in the pool
			expect(txPool.txsInPool).toBe(1)

			// Verify it's in txsByNonce
			expect((txPool as any).txsByNonce.has(address)).toBe(true)

			// Remove it
			txPool.removeByHash(txHash)

			// Verify it's cleaned up
			expect(txPool.txsInPool).toBe(0)

			// TxsByNonce should be empty for this address now
			expect((txPool as any).txsByNonce.has(address)).toBe(false)
		})
	})

	describe('on method', () => {
		it('should register event handlers', async () => {
			// Add event handlers
			const handler1 = () => {}
			const handler2 = () => {}

			// Register event handlers
			txPool.on('txadded', handler1)
			txPool.on('txremoved', handler2)

			// Verify handlers are registered
			expect((txPool as any).events.txadded.length).toBe(1)
			expect((txPool as any).events.txremoved.length).toBe(1)

			// Verify they're the right handlers
			expect((txPool as any).events.txadded[0]).toBe(handler1)
			expect((txPool as any).events.txremoved[0]).toBe(handler2)
		})
	})
})
