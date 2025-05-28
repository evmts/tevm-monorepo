import { createAddress } from '@tevm/address'
import { createAccount } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { getAccount } from './getAccount.js'
import { modifyAccountFields } from './modifyAccountFields.js'
import { putAccount } from './putAccount.js'

describe(modifyAccountFields.name, () => {
	it('allows you to modify account fields with a partial config', async () => {
		const state = createBaseState({})
		await putAccount(state)(createAddress(0), createAccount({ nonce: 1n, balance: 2n }))
		await modifyAccountFields(state)(createAddress(0), {
			nonce: 2n,
			balance: 3n,
		})
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
			createAccount({
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

	it('should handle explicit undefined field values', async () => {
		const state = createBaseState({})
		const address = createAddress('0xdef')

		// Create an initial account with non-zero values
		await putAccount(state)(
			address,
			createAccount({
				nonce: 5n,
				balance: 10n,
			}),
		)

		// Pass undefined for some fields - should keep existing values
		await modifyAccountFields(state)(address, {
			nonce: undefined,
			balance: 20n,
		} as any)

		// Verify only balance changed, nonce kept original value
		const account = await getAccount(state)(address)
		expect(account?.nonce).toBe(5n) // Should keep original value when undefined is passed
		expect(account?.balance).toBe(20n) // Changed
	})

	it('should handle undefined balance value', async () => {
		const state = createBaseState({})
		const address = createAddress('0xabc123')

		// Create an initial account with non-zero values
		await putAccount(state)(
			address,
			createAccount({
				nonce: 3n,
				balance: 50n,
			}),
		)

		// Pass undefined for balance - should keep existing value
		await modifyAccountFields(state)(address, {
			nonce: 4n,
			balance: undefined, // This tests line 14 specifically
		} as any)

		// Verify nonce changed, but balance kept original value
		const account = await getAccount(state)(address)
		expect(account?.nonce).toBe(4n) // Changed
		expect(account?.balance).toBe(50n) // Should keep original value when undefined is passed
	})
})
