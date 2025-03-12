import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { LegacyTransaction } from '@tevm/tx'
import { EthjsAccount, EthjsAddress, hexToBytes, parseEther } from '@tevm/utils'
import { type Vm, createVm } from '@tevm/vm'
import { beforeEach, describe, expect, it } from 'vitest'
import { PREFUNDED_PRIVATE_KEYS } from '../../utils/dist/index.cjs'
import { TxPool } from './TxPool.js'

describe('TxPool final tests', () => {
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

	describe('baseFee filtering for txsByPriceAndNonce', () => {
		it('should filter transactions with baseFee', async () => {
			// Create a transaction with a specific gas price
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

			// Get transactions with baseFee higher than tx gas price - should filter it out
			const result = await txPool.txsByPriceAndNonce({ baseFee: 2000000000n })

			// Should be empty because the tx has been filtered out
			expect(result.length).toBe(0)
		})
	})
})
