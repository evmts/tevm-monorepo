import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { LegacyTransaction } from '@tevm/tx'
import { bytesToHex, createAccount, createAddressFromString, EthjsAddress, hexToBytes, parseEther } from '@tevm/utils'
import { createVm, type Vm } from '@tevm/vm'
import { beforeEach, describe, expect, it } from 'vitest'
import { PREFUNDED_PRIVATE_KEYS } from '../../utils/dist/index.cjs'
import { TxPool } from './TxPool.js'

describe('TxPool with transactions of different nonces', () => {
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

	describe('onChainReorganization with different nonces', () => {
		it('should handle multiple transactions with different nonces', async () => {
			// Create two transactions with different nonces
			const tx1 = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			const signedTx1 = tx1.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			const tx2 = new LegacyTransaction({
				nonce: 1, // Different nonce
				gasPrice: 2000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			const signedTx2 = tx2.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// Add tx2 to the pool
			await txPool.add(signedTx2)
			expect(txPool.txsInPool).toBe(1)

			// Create mock blocks
			const removedBlock = {
				transactions: [signedTx1],
				hash: () => new Uint8Array(32),
			} as any

			const addedBlock = {
				transactions: [],
				hash: () => new Uint8Array(32),
			} as any

			// Perform the reorg
			await txPool.onChainReorganization([removedBlock], [addedBlock])

			// Both tx1 and tx2 should be in the pool
			expect(txPool.txsInPool).toBe(2)

			// Verify both transactions are in the pool
			const tx1Hash = bytesToHex(signedTx1.hash())
			const tx1InPool = await txPool.getByHash(tx1Hash)
			expect(tx1InPool).not.toBeNull()

			const tx2Hash = bytesToHex(signedTx2.hash())
			const tx2InPool = await txPool.getByHash(tx2Hash)
			expect(tx2InPool).not.toBeNull()
		})
	})
})
