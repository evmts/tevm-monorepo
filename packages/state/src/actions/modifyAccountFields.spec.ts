import { createAddress } from '@tevm/address'
import { EthjsAccount } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getAccount } from './getAccount.js'
import { modifyAccountFields } from './modifyAccountFields.js'
import { putAccount } from './putAccount.js'

describe(modifyAccountFields.name, () => {
	it('allows you to modify account fields with a partial config', async () => {
		const state = createBaseState({})
		await putAccount(state)(createAddress(0), EthjsAccount.fromAccountData({ nonce: 1n, balance: 2n }))
		await modifyAccountFields(state)(createAddress(0), { nonce: 2n, balance: 3n })
		const { nonce, balance } = (await getAccount(state)(createAddress(0))) ?? {}
		expect(nonce).toBe(2n)
		expect(balance).toBe(3n)
	})

	it('should create a new account if one does not exist', async () => {
		const state = createBaseState({})
		const address = createAddress('0x123')

		// Verify account doesn't exist
		const accountBefore = await getAccount(state)(address)
		expect(accountBefore).toBeUndefined()

		// Modify account fields (should create a new account)
		await modifyAccountFields(state)(address, { nonce: 5n, balance: 10n })

		// Verify account was created with the specified fields
		const accountAfter = await getAccount(state)(address)
		expect(accountAfter).not.toBeUndefined()
		expect(accountAfter?.nonce).toBe(5n)
		expect(accountAfter?.balance).toBe(10n)
	})

	it('should modify storageRoot and codeHash when provided', async () => {
		const state = createBaseState({})
		const address = createAddress('0x456')
		// StorageRoot and codeHash must be 32 bytes
		const storageRoot = new Uint8Array(32).fill(1)
		const codeHash = new Uint8Array(32).fill(2)

		// Create a new account with all fields
		await modifyAccountFields(state)(address, {
			nonce: 1n,
			balance: 2n,
			storageRoot,
			codeHash,
		})

		// Verify all fields were set
		const account = await getAccount(state)(address)
		expect(account?.nonce).toBe(1n)
		expect(account?.balance).toBe(2n)
		expect(account?.storageRoot).toEqual(storageRoot)
		expect(account?.codeHash).toEqual(codeHash)
	})

	it('should only modify specified fields', async () => {
		const state = createBaseState({})
		const address = createAddress('0x789')
		// StorageRoot and codeHash must be 32 bytes
		const initialStorageRoot = new Uint8Array(32).fill(3)
		const initialCodeHash = new Uint8Array(32).fill(4)

		// Create an initial account
		await putAccount(state)(
			address,
			EthjsAccount.fromAccountData({
				nonce: 1n,
				balance: 2n,
				storageRoot: initialStorageRoot,
				codeHash: initialCodeHash,
			}),
		)

		// Only modify balance
		await modifyAccountFields(state)(address, { balance: 100n })

		// Verify only balance was changed
		const account = await getAccount(state)(address)
		expect(account?.nonce).toBe(1n) // Unchanged
		expect(account?.balance).toBe(100n) // Changed
		expect(account?.storageRoot).toEqual(initialStorageRoot) // Unchanged
		expect(account?.codeHash).toEqual(initialCodeHash) // Unchanged
	})
})
