import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { LegacyTransaction } from '@tevm/tx'
import { EthjsAddress, createAccount, createAddressFromString, hexToBytes, parseEther } from '@tevm/utils'
import { type Vm, createVm } from '@tevm/vm'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PREFUNDED_PRIVATE_KEYS } from '../../utils/dist/index.cjs'
import { TxPool } from './TxPool.js'

describe('TxPool final2 coverage', () => {
	let txPool: TxPool
	let vm: Vm
	let senderAddress: EthjsAddress
	let stateManager: any

	beforeEach(async () => {
		const common = optimism.copy()
		const blockchain = await createChain({ common })
		stateManager = createStateManager({})
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

	describe('validate method corner cases', () => {
		it('should throw when tx has higher gas than block gas limit', async () => {
			// Create a transaction with very high gas limit
			const tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000n,
				gasLimit: 50000000, // Very high gas limit
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			}).sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// Mock the blockchain.getCanonicalHeadBlock to return a block with lower gas limit
			const mockBlock = {
				header: {
					gasLimit: 30000000,
					baseFeePerGas: 1000000000n,
				},
			}
			vi.spyOn(vm.blockchain, 'getCanonicalHeadBlock').mockResolvedValue(mockBlock as any)

			// Add to pool - should throw due to gas limit
			const result = await txPool.add(tx)

			// Should have error about gas limit
			expect(result.error).toContain('exceeds block gas limit')
		})

		it('should throw when tx is not signed', async () => {
			// Create an unsigned transaction - we'll use a different approach
			const tx = {
				nonce: 0n,
				gasPrice: 1000000000n,
				gasLimit: 21000n,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000n,
				data: new Uint8Array(),
				getSenderAddress: () => senderAddress,
				hash: () => new Uint8Array(32),
				isSigned: () => false, // This is the key - returns false for isSigned
			}

			// Add to pool - should throw due to not being signed
			const result = await txPool.add(tx as any)

			// Should have error about not being signed
			expect(result.error).toContain('not signed')
		})

		it('should throw when data is too large', async () => {
			// Create a transaction with very large data
			const largeData = new Uint8Array(129 * 1024) // 129KB, above the 128KB limit
			const tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: largeData,
			}).sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// Add to pool - should throw due to data size
			const result = await txPool.add(tx)

			// Should have error about data size
			expect(result.error).toContain('too large')
		})
	})
})
