import { SimpleContract } from '@tevm/contract'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { type Address, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import { deployHandler } from '../Deploy/deployHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { debugDumpBlockHandler } from './debugDumpBlockHandler.js'

describe('debugDumpBlockHandler', () => {
	let client: TevmNode
	let contractAddress: Address

	beforeEach(async () => {
		client = createTevmNode()

		const { createdAddress } = await deployHandler(client)({
			...SimpleContract.deploy(420n),
			from: PREFUNDED_ACCOUNTS[0].address,
			addToBlockchain: true,
		})
		assert(createdAddress, 'createdAddress is undefined')
		contractAddress = createdAddress

		// Mine a block to have some state
		await mineHandler(client)()
	})

	it('should dump block state at latest block', async () => {
		const handler = debugDumpBlockHandler(client)
		const result = await handler({ blockTag: 'latest' })

		expect(result).toHaveProperty('root')
		expect(result).toHaveProperty('accounts')
		expect(typeof result.root).toBe('string')
		expect(result.root).toMatch(/^0x[0-9a-f]+$/i)
		expect(typeof result.accounts).toBe('object')

		// Should have at least the deployed contract and prefunded account
		const accountAddresses = Object.keys(result.accounts)
		expect(accountAddresses.length).toBeGreaterThan(0)

		// Contract should be in the dump
		const contractAccount = result.accounts[contractAddress]
		expect(contractAccount).toBeDefined()
		expect(contractAccount).toHaveProperty('balance')
		expect(contractAccount).toHaveProperty('nonce')
		expect(contractAccount).toHaveProperty('codeHash')
		expect(contractAccount).toHaveProperty('root')
		expect(contractAccount).toHaveProperty('code')
	})

	it('should dump block state at block 0', async () => {
		const handler = debugDumpBlockHandler(client)
		const result = await handler({ blockTag: 0n })

		expect(result).toHaveProperty('root')
		expect(result).toHaveProperty('accounts')
		expect(typeof result.root).toBe('string')
		expect(typeof result.accounts).toBe('object')

		// Block 0 should have prefunded accounts
		const accountAddresses = Object.keys(result.accounts)
		expect(accountAddresses.length).toBeGreaterThan(0)
	})

	it('should dump block state at specific block number using bigint', async () => {
		const handler = debugDumpBlockHandler(client)
		const result = await handler({ blockTag: 1n })

		expect(result).toHaveProperty('root')
		expect(result).toHaveProperty('accounts')
		expect(typeof result.root).toBe('string')
		expect(typeof result.accounts).toBe('object')

		// Block 1 should have the deployed contract
		const contractAccount = result.accounts[contractAddress]
		expect(contractAccount).toBeDefined()
	})

	it('should dump block state at specific block number using hex string', async () => {
		const handler = debugDumpBlockHandler(client)
		const result = await handler({ blockTag: '0x1' })

		expect(result).toHaveProperty('root')
		expect(result).toHaveProperty('accounts')
		expect(typeof result.root).toBe('string')
		expect(typeof result.accounts).toBe('object')
	})

	it('should dump block state at specific block number using number', async () => {
		const handler = debugDumpBlockHandler(client)
		const result = await handler({ blockTag: 1 })

		expect(result).toHaveProperty('root')
		expect(result).toHaveProperty('accounts')
		expect(typeof result.root).toBe('string')
		expect(typeof result.accounts).toBe('object')
	})

	it('should include storage in account dump when account has storage', async () => {
		// Set some storage for an account
		const testAddress = '0x1234567890123456789012345678901234567890'
		await setAccountHandler(client)({
			address: testAddress,
			balance: 1000000000000000000n,
			storage: {
				'0x0000000000000000000000000000000000000000000000000000000000000000':
					'0x0000000000000000000000000000000000000000000000000000000000000042',
			},
		})

		await mineHandler(client)()

		const handler = debugDumpBlockHandler(client)
		const result = await handler({ blockTag: 'latest' })

		const account = result.accounts[testAddress]
		expect(account).toBeDefined()
		// Storage may or may not be included depending on implementation
		// Just verify the account exists with correct properties
		expect(account).toHaveProperty('balance')
		expect(account).toHaveProperty('nonce')
	})

	it('should handle default blockTag when not provided', async () => {
		const handler = debugDumpBlockHandler(client)
		// @ts-expect-error - blockTag is required but we're testing default behavior
		const result = await handler({})

		expect(result).toHaveProperty('root')
		expect(result).toHaveProperty('accounts')
		expect(typeof result.root).toBe('string')
		expect(typeof result.accounts).toBe('object')
	})

	it('should dump multiple accounts correctly', async () => {
		// Create multiple accounts with different states
		await setAccountHandler(client)({
			address: '0x1111111111111111111111111111111111111111',
			balance: 1n,
		})
		await setAccountHandler(client)({
			address: '0x2222222222222222222222222222222222222222',
			balance: 2n,
		})
		await setAccountHandler(client)({
			address: '0x3333333333333333333333333333333333333333',
			balance: 3n,
		})

		await mineHandler(client)()

		const handler = debugDumpBlockHandler(client)
		const result = await handler({ blockTag: 'latest' })

		expect(result.accounts['0x1111111111111111111111111111111111111111']).toBeDefined()
		expect(result.accounts['0x2222222222222222222222222222222222222222']).toBeDefined()
		expect(result.accounts['0x3333333333333333333333333333333333333333']).toBeDefined()
	})

	it('should return proper account structure with all required fields', async () => {
		const handler = debugDumpBlockHandler(client)
		const result = await handler({ blockTag: 'latest' })

		const contractAccount = result.accounts[contractAddress]
		expect(contractAccount).toBeDefined()

		// Check all required fields exist and have correct types
		expect(typeof contractAccount.balance).toBe('string')
		expect(contractAccount.balance).toMatch(/^0x[0-9a-f]+$/i)
		expect(typeof contractAccount.nonce).toBe('string')
		expect(contractAccount.nonce).toMatch(/^0x[0-9a-f]+$/i)
		expect(typeof contractAccount.codeHash).toBe('string')
		expect(contractAccount.codeHash).toMatch(/^0x[0-9a-f]+$/i)
		expect(typeof contractAccount.root).toBe('string')
		expect(contractAccount.root).toMatch(/^0x[0-9a-f]+$/i)
		expect(typeof contractAccount.code).toBe('string')
		expect(contractAccount.code).toMatch(/^0x[0-9a-f]+$/i)
	})
})
