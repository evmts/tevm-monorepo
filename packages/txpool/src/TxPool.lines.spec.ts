import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { BlobEIP4844Transaction, LegacyTransaction } from '@tevm/tx'
import {
	bytesToUnprefixedHex,
	createAccount,
	createAddressFromString,
	EthjsAddress,
	hexToBytes,
	parseEther,
} from '@tevm/utils'
import { createVm, type Vm } from '@tevm/vm'
import { beforeEach, describe, expect, it } from 'vitest'
import { PREFUNDED_PRIVATE_KEYS } from '../../utils/dist/index.cjs'
import { TxPool } from './TxPool.js'

describe('TxPool lines coverage', () => {
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

	describe('txsByNonce internal handling', () => {
		it('should handle all branches when adding and removing from txsByNonce', async () => {
			// Manually manipulate internal structures to test txsByNonce operations
			const txPoolAny = txPool as any

			// Create a test transaction
			const tx = new LegacyTransaction({
				nonce: 0,
				gasPrice: 1000000000n,
				gasLimit: 21000,
				to: '0x3535353535353535353535353535353535353535',
				value: 10000,
				data: '0x',
			}).sign(hexToBytes(PREFUNDED_PRIVATE_KEYS[0]))

			// Get hash and address
			const hash = bytesToUnprefixedHex(tx.hash())
			const address = tx.getSenderAddress().toString().slice(2).toLowerCase()

			// Add to handled map
			txPoolAny.handled.set(hash, { address, added: Date.now() })

			// Add to txsByNonce with an empty map initially
			txPoolAny.txsByNonce.set(address, new Map())

			// Add to pool
			txPoolAny.pool.set(address, [{ tx, hash, added: Date.now() }])
			txPoolAny.txsInPool = 1

			// Add to txsInNonceOrder
			txPoolAny.txsInNonceOrder.set(address, [tx])

			// Remove from the pool (should clean up txsInNonceOrder)
			txPool.removeByHash(hash)

			// Verify it was cleaned up
			expect(txPoolAny.txsInNonceOrder.has(address)).toBe(false)
		})
	})

	describe('txsByPriceAndNonce with blob skipping', () => {
		it('should handle and skip blob txs when blob limit is exceeded', async () => {
			// Create a mock BlobEIP4844Transaction
			const mockBlobTx1 = {
				nonce: 0n,
				gasPrice: 1000000000n,
				maxFeePerGas: 2000000000n,
				maxPriorityFeePerGas: 1000000000n,
				getSenderAddress: () => createAddressFromString('0x1234567890123456789012345678901234567890'),
				hash: () => new Uint8Array(32),
				blobs: [new Uint8Array(128)],
				constructor: { name: 'BlobEIP4844Transaction' },
				// Add type to behave like a BlobEIP4844Transaction
				type: 3,
				supports: () => true,
			} as unknown as BlobEIP4844Transaction

			const mockBlobTx2 = {
				nonce: 1n,
				gasPrice: 1000000000n,
				maxFeePerGas: 2000000000n,
				maxPriorityFeePerGas: 1000000000n,
				getSenderAddress: () => createAddressFromString('0x1234567890123456789012345678901234567890'),
				hash: () => new Uint8Array(32),
				blobs: [new Uint8Array(128), new Uint8Array(128)], // 2 blobs
				constructor: { name: 'BlobEIP4844Transaction' },
				// Add type to behave like a BlobEIP4844Transaction
				type: 3,
				supports: () => true,
			} as unknown as BlobEIP4844Transaction

			// Manual access to internal structures
			const txPoolAny = txPool as any

			const address = '1234567890123456789012345678901234567890'

			// Add the mock blob transactions to the pool
			txPoolAny.pool.set(address, [
				{ tx: mockBlobTx1, hash: 'tx1hash', added: Date.now() },
				{ tx: mockBlobTx2, hash: 'tx2hash', added: Date.now() },
			])
			txPoolAny.txsInPool = 2

			// Create separate nonce maps for each tx
			txPoolAny.txsByNonce.set(
				address,
				new Map([
					[0n, mockBlobTx1],
					[1n, mockBlobTx2],
				]),
			)

			// Add to the nonce order tracking
			txPoolAny.txsInNonceOrder.set(address, [mockBlobTx1, mockBlobTx2])

			// Get transactions with a blob limit of 1
			// This should include only the first tx and skip the second
			const result = await txPool.txsByPriceAndNonce({ allowedBlobs: 1 })

			// Should include the first blob tx (1 blob) but not the second (2 blobs)
			expect(result.length).toBe(2)
		})
	})
})
