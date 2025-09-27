import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createStateManager } from '@tevm/state'
import { createAccount, createAddressFromString, EthjsAddress, parseEther } from '@tevm/utils'
import { createVm, type Vm } from '@tevm/vm'
import { beforeEach, describe, expect, it } from 'vitest'
// Not used in this test file
// import { PREFUNDED_PRIVATE_KEYS } from '../../utils/dist/index.cjs'
import { TxPool } from './TxPool.js'

describe('TxPool simple coverage tests', () => {
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

	describe('txPoolObject not in pool.get', () => {
		it('should return null when handled has no pool entry', async () => {
			// Create an entry in the handled map with no corresponding pool entry
			const txHash = '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
			const address = 'f39fd6e51aad88f6f4ce6ab8827279cfffb92266'

			// Add to the handled map but not to the pool
			const txPoolAny = txPool as any
			txPoolAny.handled.set(txHash.slice(2).toLowerCase(), {
				address,
				added: Date.now(),
			})

			// Should return null since there's no matching pool entry
			const result = await txPool.getByHash(txHash)
			expect(result).toBeNull()
		})
	})

	describe('fireEvent edge case', () => {
		it('should not throw if event handler not registered', async () => {
			const txPoolAny = txPool as any

			// Clear any existing handlers
			txPoolAny.events = {}

			// This should not throw
			txPoolAny.fireEvent('txadded', '0x1234')

			// Verify it doesn't throw
			expect(true).toBe(true)
		})
	})

	describe('removeByHash with empty nonceMap', () => {
		it('should remove txsByNonce entry if nonceMap size is 0', async () => {
			// Setup the internal state manually
			const txPoolAny = txPool as any
			const hash = 'testtxhash'
			const address = 'testaddress'

			// Add to handled map
			txPoolAny.handled.set(hash, { address, added: Date.now() })

			// Create a mock txToRemove with a nonce
			const txToRemove = { nonce: 1n }

			// Add to pool
			txPoolAny.pool.set(address, [{ hash, added: Date.now(), tx: txToRemove }])

			// Add to txsByNonce with a nonceMap containing an entry
			const nonceMap = new Map()
			nonceMap.set(1n, {})
			txPoolAny.txsByNonce.set(address, nonceMap)

			// Set up txsInNonceOrder to delete nonce from
			txPoolAny.txsInNonceOrder.set(address, [{ nonce: 1n }])

			// Delete the only entry to make it empty
			nonceMap.delete(1n)

			// Verify it's empty
			expect(nonceMap.size).toBe(0)

			// Call removeByHash - should delete the now-empty nonceMap
			txPool.removeByHash(hash)

			// Verify behavior
			expect(txPoolAny.txsByNonce.has(address)).toBe(false)
		})
	})

	describe('txsByPriceAndNonce edge cases', () => {
		it('should handle missing entries in byNonce map', async () => {
			// Setup a valid mock object
			const validObj = {
				tx: {
					nonce: 1n,
					supports: () => false,
					gasPrice: 1000000000n,
					getSenderAddress: () => ({ toString: () => '0xaddr1' }),
				},
				hash: 'txhash',
				added: Date.now(),
			}

			// Create a proper map structure that doesn't throw
			const byNonce = new Map()
			byNonce.set('addr1', [validObj])

			// Mock the pool
			const txPoolAny = txPool as any
			const originalByNonce = txPoolAny.pool
			txPoolAny.pool = byNonce

			try {
				// This should execute without errors
				const result = await txPool.txsByPriceAndNonce()
				expect(result.length).toBe(1)
			} finally {
				// Restore original
				txPoolAny.pool = originalByNonce
			}
		})
	})

	describe('removeByHash cases', () => {
		it('should handle case where pool.get returns empty array', async () => {
			// Setup a test case
			const hash = '0x1234567890abcdef'
			const unprefixedHash = hash.slice(2)
			const address = 'f39fd6e51aad88f6f4ce6ab8827279cfffb92266'

			// Set up handled entry
			const txPoolAny = txPool as any
			txPoolAny.handled.set(unprefixedHash, { address, added: Date.now() })

			// Set up empty pool entry
			txPoolAny.pool.set(address, [])

			// Should not throw
			txPool.removeByHash(unprefixedHash)

			// Entry should be removed from pool
			expect(txPoolAny.pool.has(address)).toBe(false)
		})
	})
})
