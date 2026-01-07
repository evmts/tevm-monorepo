import { AccountNotFoundError, InvalidAddressError } from '@tevm/errors'
import { createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { numberToHex } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { getAccountHandler } from './getAccountHandler.js'

const contract = TestERC20.withAddress(`0x${'3'.repeat(40)}`)

describe('getAccount', () => {
	it('should get an account from evm', async () => {
		const client = createTevmNode()
		const res = await setAccountHandler(client)({
			address: contract.address,
			deployedBytecode: contract.deployedBytecode,
			balance: 420n,
			nonce: 69n,
		})
		expect(res.errors).toBeUndefined()
		const account = await getAccountHandler(client)({
			address: contract.address,
		})
		expect(account?.balance).toBe(420n)
		expect(account?.nonce).toBe(69n)
		expect(account.deployedBytecode).toEqualHex(contract.deployedBytecode)
	})

	it('should validate params', async () => {
		const client = createTevmNode()
		const res = await setAccountHandler(client)({
			// @ts-expect-error
			address: 'not an address',
			throwOnFail: false,
		})
		expect(res.errors).toMatchSnapshot()
	})

	it('should handle account not found', async () => {
		const client = createTevmNode()
		const account = await getAccountHandler(client)({
			throwOnFail: false,
			address: `0x${'4'.repeat(40)}`,
		})
		expect(account?.errors?.[0]).toBeInstanceOf(AccountNotFoundError)
		expect(account?.errors?.[0]?.code).toBe(AccountNotFoundError.code)
		expect(account?.balance).toBe(0n)
		expect(account?.nonce).toBe(0n)
		expect(account?.deployedBytecode).toEqualHex('0x')
		expect(account?.isContract).toBe(false)
		expect(account?.isEmpty).toBe(true)
	})

	it('should handle internal errors gracefully', async () => {
		const client = createTevmNode()
		// Simulate an internal error by passing invalid parameters to getAccountHandler
		const invalidParams = { throwOnFail: false }
		const account = await getAccountHandler(client)(invalidParams as any)
		expect(account?.errors?.[0]).toBeInstanceOf(InvalidAddressError)
		expect(account?.balance).toBe(0n)
		expect(account?.nonce).toBe(0n)
		expect(account?.deployedBytecode).toEqualHex('0x')
		expect(account?.isContract).toBe(false)
		expect(account?.isEmpty).toBe(true)
	})

	it('should return storage if requested', async () => {
		const client = createTevmNode()
		const state = {
			[numberToHex(0, { size: 32 })]: numberToHex(420, { size: 2 }),
			[numberToHex(2, { size: 32 })]: numberToHex(420, { size: 2 }),
		}
		await setAccountHandler(client)({
			address: contract.address,
			deployedBytecode: contract.deployedBytecode,
			balance: 420n,
			nonce: 69n,
			state,
		})
		const account = await getAccountHandler(client)({
			address: contract.address,
			returnStorage: true,
		})
		expect(account?.storage).toBeDefined()
		Object.entries(state).forEach(([key, value]) => {
			expect(account?.storage?.[key as any]).toEqualHex(value)
		})
		expect(account?.storage).toMatchSnapshot()
	})

	it('should handle getAccount unexpectedly throwing', async () => {
		const client = createTevmNode()
		const vm = await client.getVm()
		vm.stateManager.getAccount = () => {
			throw new Error('Unexpected error')
		}
		const account = await getAccountHandler(client)({
			address: contract.address,
			throwOnFail: false,
		})
		expect(account.errors).toBeDefined()
		expect(account.errors).toMatchSnapshot()
	})
})
