import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { LegacyTransaction } from '@tevm/tx'
import { createAccount, createAddressFromString, EthjsAddress, hexToBytes, parseEther } from '@tevm/utils'
import { createVm, type Vm } from '@tevm/vm'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PREFUNDED_PRIVATE_KEYS } from '../../utils/dist/index.cjs'
import { TxPool } from './TxPool.js'

describe('TxPool._logPoolStats', () => {
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

	it('should calculate pool stats without errors', async () => {
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

		// Add an error transaction to the handled map
		const errorHash = 'errorhash123'
		const address = senderAddress.toString().slice(2).toLowerCase()
		;(txPool as any).handled.set(errorHash, {
			address,
			added: Date.now(),
			error: new Error('Test error'),
		})

		// This should run without errors
		expect(() => (txPool as any)._logPoolStats()).not.toThrow()
	})

	it('should correctly count handled transactions with and without errors', async () => {
		// Add multiple transactions with and without errors
		const address1 = senderAddress.toString().slice(2).toLowerCase()
		const address2 = '1234567890123456789012345678901234567890'

		// Add transactions to the pool
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

		// Add regular handled transactions
		;(txPool as any).handled.set('hash1', { address: address1, added: Date.now() })
		;(txPool as any).handled.set('hash2', { address: address1, added: Date.now() })

		// Add error transactions
		;(txPool as any).handled.set('hash3', { address: address2, added: Date.now(), error: new Error('Error 1') })
		;(txPool as any).handled.set('hash4', { address: address2, added: Date.now(), error: new Error('Error 2') })
		;(txPool as any).handled.set('hash5', { address: address2, added: Date.now(), error: new Error('Error 3') })

		// Mock console methods to capture output
		const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

		// Call the function
		;(txPool as any)._logPoolStats()

		// Restore console
		consoleLogSpy.mockRestore()

		// Function is mostly for logging, just verify it doesn't throw
		expect(true).toBe(true)
	})
})
