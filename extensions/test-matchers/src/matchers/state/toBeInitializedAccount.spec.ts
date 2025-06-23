import { deployHandler, setAccountHandler } from '@tevm/actions'
import { SimpleContract } from '@tevm/contract'
import { createMemoryClient } from '@tevm/memory-client'
import { createTevmNode } from '@tevm/node'
import { type Address, parseEther } from 'viem'
import { assert, beforeAll, describe, expect, it } from 'vitest'

describe('toBeInitializedAccount', () => {
	const client = createTevmNode()
	let accountWithCode: Address
	const uninitializedAccount = `0x${'1'.repeat(40)}` as Address
	const initializedAccount = `0x${'2'.repeat(40)}` as Address
	const invalidAddress = '0xinvalid'

	beforeAll(async () => {
		await setAccountHandler(client)({
			address: initializedAccount,
			balance: parseEther('1'),
			nonce: 0n,
		})

		const { createdAddress } = await deployHandler(client)({
			...SimpleContract.deploy(1n),
			addToBlockchain: true,
		})
		console.log('createdAddress', createdAddress)
		assert(createdAddress, 'createdAddress should be defined')
		accountWithCode = createdAddress
	})

	describe('should pass when an account is initialized', () => {
		it('with address', async () => {
			await expect(initializedAccount).toBeInitializedAccount(client)
		})

		it('with viem account', async () => {
			await expect({ address: initializedAccount }).toBeInitializedAccount(client)
		})

		it('with contract', async () => {
			await expect(accountWithCode).toBeInitializedAccount(client)
		})
	})

	describe('should fail when an account is not initialized', () => {
		it('with address', async () => {
			await expect(expect(uninitializedAccount).toBeInitializedAccount(client)).rejects.toThrowError(
				`account ${uninitializedAccount} not found`,
			)
		})

		it('with viem account', async () => {
			await expect(expect({ address: uninitializedAccount }).toBeInitializedAccount(client)).rejects.toThrowError(
				`account ${uninitializedAccount} not found`,
			)
		})
	})

	describe('.not modifier', () => {
		it('should pass with .not for an uninitialized account', async () => {
			await expect(uninitializedAccount).not.toBeInitializedAccount(client)
		})

		it('should fail with .not for an initialized account', async () => {
			await expect(expect(initializedAccount).not.toBeInitializedAccount(client)).rejects.toThrowError(
				`Expected account ${initializedAccount} not to be initialized`,
			)
		})

		it('should fail with .not for a contract', async () => {
			await expect(expect(accountWithCode).not.toBeInitializedAccount(client)).rejects.toThrowError(
				`Expected account ${accountWithCode} not to be initialized`,
			)
		})
	})

	describe('input validation', () => {
		it('should throw an error for an invalid address string', async () => {
			await expect(expect(invalidAddress as any).toBeInitializedAccount(client)).rejects.toThrowError(
				`Invalid address: ${invalidAddress}`,
			)
		})

		it('should throw an error for an object with an invalid address', async () => {
			await expect(expect({ address: invalidAddress } as any).toBeInitializedAccount(client)).rejects.toThrowError(
				`Invalid address: ${invalidAddress}`,
			)
		})
	})

	// TODO: unskip once eth_getProof is implemented
	describe.skip('provider', () => {
		it('should work with an EIP1193 client', async () => {
			const eip1193Client = createMemoryClient()
			await eip1193Client.tevmSetAccount({
				address: initializedAccount,
				balance: parseEther('1'),
				nonce: 0n,
			})

			await expect(initializedAccount).toBeInitializedAccount(eip1193Client)
		})
	})
})
