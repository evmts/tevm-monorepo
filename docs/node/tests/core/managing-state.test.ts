import { createTevmNode, hexToBytes, http } from 'tevm'
import { createAddress } from 'tevm/address'
import { EthjsAccount } from 'tevm/utils'
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
				EthjsAccount.fromAccountData({
					nonce: 0n,
					balance: 10_000_000n,
					storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
					codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
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
			await stateManager.putContractCode(
				address,
				new Uint8Array([
					/* bytecode */
				]),
			)

			// Verify deployment
			const code = await stateManager.getContractCode(address)
			expect(code.length).toBeDefined()

			// Read storage
			const slot = hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000000')
			const value = await stateManager.getContractStorage(address, slot)
			console.log(value)

			// Dump all storage
			const storage = await stateManager.dumpStorage(address)
			expect(storage).toBeDefined()

			// Set a storage value
			const key = hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000000')
			const newValue = hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000001')
			await stateManager.putContractStorage(address, key, newValue)

			// Clear storage
			await stateManager.clearContractStorage(address)
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
				const account = EthjsAccount.fromAccountData({
					nonce: 0n,
					balance: 10_000_000n,
					storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
					codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
				})

				// Make state changes
				await stateManager.putAccount(address, account)
				await stateManager.putContractStorage(
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
			const node = createTevmNode({
				fork: {
					transport: http('https://mainnet.infura.io/v3/YOUR-KEY')({}),
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
				const account = EthjsAccount.fromAccountData({
					nonce: 0n,
					balance: 10_000_000n,
					storageRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
					codeHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
				})

				// Batch multiple state changes
				await Promise.all([
					stateManager.putAccount(testAddress, account),
					stateManager.putContractStorage(
						testAddress,
						hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000001'),
						hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000002'),
					),
				])
				await stateManager.commit()
			} catch (_error) {
				await stateManager.revert()
			}
		})
	})
})
