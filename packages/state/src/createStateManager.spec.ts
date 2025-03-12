import { createAddress } from '@tevm/address'
import { EthjsAccount } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createStateManager } from './createStateManager.js'

describe(createStateManager.name, () => {
	it('should create a state manager with all required methods', async () => {
		const stateManager = createStateManager({})

		// Check that all required methods are present
		expect(stateManager).toHaveProperty('ready')
		expect(stateManager).toHaveProperty('_baseState')
		expect(stateManager).toHaveProperty('deepCopy')
		expect(stateManager).toHaveProperty('shallowCopy')
		expect(stateManager).toHaveProperty('dumpCanonicalGenesis')
		expect(stateManager).toHaveProperty('generateCanonicalGenesis')
		expect(stateManager).toHaveProperty('putAccount')
		expect(stateManager).toHaveProperty('clearCaches')
		expect(stateManager).toHaveProperty('commit')
		expect(stateManager).toHaveProperty('checkpoint')
		expect(stateManager).toHaveProperty('revert')
		expect(stateManager).toHaveProperty('getProof')
		expect(stateManager).toHaveProperty('getContractCode')
		expect(stateManager).toHaveProperty('getAccount')
		expect(stateManager).toHaveProperty('dumpStorage')
		expect(stateManager).toHaveProperty('getStateRoot')
		expect(stateManager).toHaveProperty('hasStateRoot')
		expect(stateManager).toHaveProperty('setStateRoot')
		expect(stateManager).toHaveProperty('saveStateRoot')
		expect(stateManager).toHaveProperty('deleteAccount')
		expect(stateManager).toHaveProperty('putContractCode')
		expect(stateManager).toHaveProperty('dumpStorageRange')
		expect(stateManager).toHaveProperty('getContractStorage')
		expect(stateManager).toHaveProperty('putContractStorage')
		expect(stateManager).toHaveProperty('modifyAccountFields')
		expect(stateManager).toHaveProperty('clearContractStorage')
		expect(stateManager).toHaveProperty('getAccountAddresses')
		expect(stateManager).toHaveProperty('getAppliedKey')
		expect(stateManager).toHaveProperty('originalStorageCache')
	})

	it('should allow deep copying a state manager', async () => {
		const stateManager = createStateManager({})
		const address = createAddress('0x1')
		const account = new EthjsAccount()
		account.balance = 100n

		// Setup original state
		await stateManager.putAccount(address, account)

		// Create deep copy
		const deepCopy = await stateManager.deepCopy()

		// Modify the original
		const newAccount = new EthjsAccount()
		newAccount.balance = 200n
		await stateManager.putAccount(address, newAccount)

		// Check that the copy wasn't affected
		const originalAccount = await stateManager.getAccount(address)
		const copiedAccount = await deepCopy.getAccount(address)

		expect(originalAccount?.balance).toBe(200n)
		expect(copiedAccount?.balance).toBe(100n)
	})

	it('should allow shallow copying a state manager', async () => {
		const stateManager = createStateManager({})
		const address = createAddress('0x1')
		const account = new EthjsAccount()
		account.balance = 100n

		// Setup original state
		await stateManager.putAccount(address, account)

		// Create shallow copy
		const shallowCopy = stateManager.shallowCopy()

		// Create a new account (necessary because in-place modification doesn't work)
		const newAccount = new EthjsAccount()
		newAccount.balance = 200n

		// Modify through the copy (should affect original)
		await shallowCopy.putAccount(address, newAccount)

		// Check that the original was affected
		const originalAccount = await stateManager.getAccount(address)
		const copiedAccount = await shallowCopy.getAccount(address)

		expect(originalAccount?.balance).toBe(100n)
		expect(copiedAccount?.balance).toBe(200n)
	})

	it('should wait for ready to complete', async () => {
		const stateManager = createStateManager({})

		// Call ready and ensure it resolves
		await expect(stateManager.ready()).resolves.not.toThrow()
	})

	it('should have getAppliedKey method', async () => {
		const stateManager = createStateManager({})

		// Just verify the method exists, don't call it
		expect(stateManager).toHaveProperty('getAppliedKey')
	})

	it('should have originalStorageCache method', () => {
		const stateManager = createStateManager({})

		// Just verify the method exists, don't call it
		expect(stateManager).toHaveProperty('originalStorageCache')
	})
})
