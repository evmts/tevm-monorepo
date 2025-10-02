import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { LegacyTransaction } from '@tevm/tx'
import { createAccount, createAddressFromString, EthjsAddress, hexToBytes, parseEther } from '@tevm/utils'
import { createVm, type Vm } from '@tevm/vm'
import { beforeEach, describe, expect, it } from 'vitest'
import { PREFUNDED_PRIVATE_KEYS } from '../../utils/dist/index.cjs'
import { TxPool } from './TxPool.js'

describe('TxPool blob final coverage', () => {
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

	describe('Heap setup with txsByPriceAndNonce', () => {
		it('should use heap for transaction ordering', async () => {
			// Add a transaction to get proper heapification
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

			// Get transactions - this should exercise the heap code
			const result = await txPool.txsByPriceAndNonce()
			expect(result.length).toBe(1)

			// Test with multiple transactions with different prices
			const tx2 = new LegacyTransaction({
				nonce: 1,
				gasPrice: 2000000000n, // Higher gas price
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			}).sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			await txPool.add(tx2)

			// Get transactions - should have 2 and exercise heap sorting
			const result2 = await txPool.txsByPriceAndNonce()
			expect(result2.length).toBe(2)
		})
	})
})
