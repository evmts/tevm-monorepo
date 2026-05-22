import { createAddress } from 'tevm/address'
import { createStateManager } from 'tevm/state'
import { createAccount, hexToBytes } from 'tevm/utils'
import { describe, expect, it } from 'vitest'

describe('@tevm/state', () => {
	describe('StateManager', () => {
		it('should create a state manager', () => {
			const stateManager = createStateManager({
				loggingLevel: 'info',
			})

			expect(stateManager).toBeDefined()
			expect(stateManager.ready).toBeDefined()
			expect(stateManager.getAccountAddresses).toBeDefined()
			expect(stateManager.deepCopy).toBeDefined()
			expect(stateManager.dumpCanonicalGenesis).toBeDefined()
			expect(stateManager.clearCaches).toBeDefined()
		})
	})

	describe('Account Management', () => {
		it('should manage account state', async () => {
			const stateManager = createStateManager({})
			await stateManager.ready()
			const address = createAddress('0x1234567890123456789012345678901234567890')

			// Missing accounts return undefined
			expect(await stateManager.getAccount(address)).toBeUndefined()

			// Create or replace account state
			await stateManager.putAccount(
				address,
				createAccount({
					nonce: 0n,
					balance: 100n,
				}),
			)

			const account = await stateManager.getAccount(address)
			expect(account?.balance).toBe(100n)

			// Modify specific account fields
			await stateManager.modifyAccountFields(address, {
				nonce: 1n,
				balance: 200n,
			})

			const modifiedAccount = await stateManager.getAccount(address)
			expect(modifiedAccount?.nonce).toBe(1n)
			expect(modifiedAccount?.balance).toBe(200n)

			// Delete account
			await stateManager.deleteAccount(address)
			expect(await stateManager.getAccount(address)).toBeUndefined()
		})
	})

	describe('Contract Management', () => {
		it('should manage contract code and storage', async () => {
			const stateManager = createStateManager({})
			await stateManager.ready()
			const address = createAddress('0x1234567890123456789012345678901234567890')
			const key = hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000001')
			const value = hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000002')
			const code = new Uint8Array([1, 2, 3])

			// Get and set contract code
			await stateManager.putCode(address, code)
			const retrievedCode = await stateManager.getCode(address)
			expect(retrievedCode).toEqual(code)

			// Get and set contract storage
			await stateManager.putStorage(address, key, value)
			const retrievedValue = await stateManager.getStorage(address, key)
			expect(retrievedValue).toEqual(new Uint8Array([2]))

			// Clear contract storage
			await stateManager.clearStorage(address)
			expect(await stateManager.getStorage(address, key)).toEqual(new Uint8Array())
		})
	})

	describe('State Management', () => {
		it('should manage state checkpoints and roots', async () => {
			const stateManager = createStateManager({})
			await stateManager.ready()
			const address = createAddress('0x1234567890123456789012345678901234567890')

			await stateManager.putAccount(address, createAccount({ balance: 100n }))

			// Create checkpoint
			await stateManager.checkpoint()

			await stateManager.modifyAccountFields(address, {
				balance: 200n,
			})

			// Revert to last checkpoint
			await stateManager.revert()
			expect((await stateManager.getAccount(address))?.balance).toBe(100n)

			await stateManager.checkpoint()
			await stateManager.modifyAccountFields(address, {
				balance: 300n,
			})

			// Commit changes
			await stateManager.commit()
			expect((await stateManager.getAccount(address))?.balance).toBe(300n)

			// Get state root
			const root = await stateManager.getStateRoot()
			expect(root).toBeDefined()

			// Set state root
			await stateManager.setStateRoot(root)

			// Check if state root exists
			const exists = await stateManager.hasStateRoot(root)
			expect(exists).toBeDefined()
		})
	})

	describe('State Dumping and Proofs', () => {
		it('should dump state and generate proofs', async () => {
			const stateManager = createStateManager({})
			await stateManager.ready()
			const address = createAddress('0x1234567890123456789012345678901234567890')
			const storageKey = hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000001')
			const storageKeys = [storageKey]

			await stateManager.putCode(address, new Uint8Array([1]))
			await stateManager.putStorage(address, storageKey, new Uint8Array([1]))

			// Dump canonical genesis state
			const state = await stateManager.dumpCanonicalGenesis()
			expect(state).toBeDefined()

			// Dump storage for address
			const storage = await stateManager.dumpStorage(address)
			expect(storage).toBeDefined()

			// Dump storage range
			const range = await stateManager.dumpStorageRange(address, 0n, 10)
			expect(range.storage).toBeDefined()

			// Merkle proofs currently require a forked state manager
			await expect(stateManager.getProof(address, storageKeys)).rejects.toThrow(/fork mode/)
		})
	})

	describe('Cache Management and Copying', () => {
		it('should manage caches and create copies', async () => {
			const stateManager = createStateManager({})
			await stateManager.ready()

			// Clear all caches
			stateManager.clearCaches()

			// Access original storage cache
			expect(stateManager.originalStorageCache).toBeDefined()

			// Deep copy (independent state)
			const deepCopy = await stateManager.deepCopy()
			expect(deepCopy).toBeDefined()

			// Shallow copy (shared state)
			const shallowCopy = stateManager.shallowCopy()
			expect(shallowCopy).toBeDefined()
		})
	})
})
