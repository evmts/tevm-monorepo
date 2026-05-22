import { createTevmNode, hexToBytes, http } from 'tevm'
import { createAddress } from 'tevm/address'
import { createAccount } from 'tevm/utils'
import { describe, expect, it } from 'vitest'

describe('Managing State', () => {
	describe('Getting Started', () => {
		it('should access state manager through VM', async () => {
			const node = createTevmNode()
			const vm = await node.getVm()
			const stateManager = vm.stateManager
			expect(stateManager).toBeDefined()
		})
	})

	describe('Account Management', () => {
		it('should read and write account state', async () => {
			const node = createTevmNode()
			const vm = await node.getVm()
			const stateManager = vm.stateManager

			const address = createAddress('0x1234567890123456789012345678901234567890')
			const account = await stateManager.getAccount(address)

			if (account) {
				console.log({
					balance: account.balance,
					nonce: account.nonce,
					codeHash: account.codeHash,
					storageRoot: account.storageRoot,
				})
			}

			// Create or update an account
			await stateManager.putAccount(
				address,
				createAccount({
					nonce: 0n,
					balance: 10_000_000n,
				}),
			)

			// Delete account
			await stateManager.deleteAccount(address)
		})
	})

	describe('Contract Management', () => {
		it('should manage contract code and storage', async () => {
			const node = createTevmNode()
			const vm = await node.getVm()
			const stateManager = vm.stateManager
			const address = createAddress('0x1234567890123456789012345678901234567890')

			// Deploy contract bytecode
			await stateManager.putCode(address, new Uint8Array([1, 2, 3]))

			// Verify deployment
			const code = await stateManager.getCode(address)
			expect(code).toEqual(new Uint8Array([1, 2, 3]))

			// Read storage
			const slot = hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000000')
			const value = await stateManager.getStorage(address, slot)
			console.log(value)

			// Dump all storage
			const storage = await stateManager.dumpStorage(address)
			expect(storage).toBeDefined()

			// Set a storage value
			const key = hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000000')
			const newValue = hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000001')
			await stateManager.putStorage(address, key, newValue)

			// Clear storage
			await stateManager.clearStorage(address)
		})
	})

	describe('State Checkpoints', () => {
		it('should manage state changes atomically', async () => {
			const node = createTevmNode()
			const vm = await node.getVm()
			const stateManager = vm.stateManager

			// Create a checkpoint
			await stateManager.checkpoint()

			try {
				const address = createAddress('0x1234567890123456789012345678901234567890')
				const account = createAccount({
					nonce: 0n,
					balance: 10_000_000n,
				})

				// Make state changes
				await stateManager.putAccount(address, account)
				await stateManager.putStorage(
					address,
					hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000001'),
					hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000002'),
				)

				// Commit changes if successful
				await stateManager.commit()
			} catch (error) {
				// Revert changes on failure
				await stateManager.revert()
				console.error('State changes reverted:', error)
			}
		})
	})

	describe('State Persistence', () => {
		it('should dump and load state', async () => {
			const node = createTevmNode()
			const vm = await node.getVm()
			const stateManager = vm.stateManager

			// Get complete state
			const state = await stateManager.dumpCanonicalGenesis()
			expect(state).toBeDefined()

			// Load saved state
			await stateManager.generateCanonicalGenesis(state)
		})
	})

	describe('Fork Mode State', () => {
		it('should demonstrate lazy loading with caching', async () => {
			const rpcUrl = process.env.MAINNET_RPC_URL
			if (!rpcUrl) {
				expect(rpcUrl).toBeUndefined()
				return
			}

			const node = createTevmNode({
				fork: {
					transport: http(rpcUrl)({}),
				},
			})

			const vm = await node.getVm()
			const stateManager = vm.stateManager
			const testAddress = createAddress('0x1234567890123456789012345678901234567890')

			// First access fetches from remote
			await stateManager.getAccount(testAddress)

			// Subsequent access uses cache
			await stateManager.getAccount(testAddress)
		})
	})

	describe('Best Practices', () => {
		it('should demonstrate error handling', async () => {
			const node = createTevmNode()
			const vm = await node.getVm()
			const stateManager = vm.stateManager
			const testAddress = createAddress('0x1234567890123456789012345678901234567890')

			try {
				const account = await stateManager.getAccount(testAddress)
				if (!account) {
					throw new Error('Account not found')
				}
				// Work with account
				expect(account).toBeDefined()
			} catch (error) {
				console.error('State operation failed:', error)
			}
		})

		it('should demonstrate state isolation', async () => {
			const node = createTevmNode()
			const vm = await node.getVm()
			const stateManager = vm.stateManager

			// Create isolated copy for testing
			const isolatedState = await stateManager.deepCopy()
			expect(isolatedState).toBeDefined()
		})

		it('should demonstrate atomic operations', async () => {
			const node = createTevmNode()
			const vm = await node.getVm()
			const stateManager = vm.stateManager
			const testAddress = createAddress('0x1234567890123456789012345678901234567890')

			await stateManager.checkpoint()
			try {
				const account = createAccount({
					nonce: 0n,
					balance: 10_000_000n,
				})

				// Batch multiple state changes
				await stateManager.putAccount(testAddress, account)
				await stateManager.putStorage(
					testAddress,
					hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000001'),
					hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000002'),
				)
				await stateManager.commit()
			} catch (_error) {
				await stateManager.revert()
			}
		})
	})
})
