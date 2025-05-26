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

describe('TxPool chain reorganization', () => {
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

	describe('onChainReorganization', () => {
		it('should handle empty arrays of blocks correctly', async () => {
			// Create a transaction and add to pool
			const tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			})
			const signedTx = tx.sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			await txPool.add(signedTx)
			expect(txPool.txsInPool).toBe(1)

			// Perform reorg with empty arrays
			await txPool.onChainReorganization([], [])

			// Pool should remain unchanged
			expect(txPool.txsInPool).toBe(1)
			const txHash = bytesToHex(signedTx.hash())
			const txInPool = await txPool.getByHash(txHash)
			expect(txInPool).not.toBeNull()
		})
	})
})
