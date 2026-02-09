import { type Address, createClient, parseEther } from 'viem'
import { getBalance, getCode, getStorageAt, getTransactionCount } from 'viem/actions'
import { assert, describe, expect, it } from 'vitest'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmGetAccount } from './tevmGetAccount.js'
import { tevmSetAccount } from './tevmSetAccount.js'

describe('Tevm Account Management', () => {
	const testAddress = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as Address

	it('should set and retrieve account state', async () => {
		// Create a client
		const client = createClient({
			transport: createTevmTransport(),
		})

		// Initial values
		const balance = parseEther('100')
		const nonce = 5n

		// Set account state
		await tevmSetAccount(client, {
			address: testAddress,
			balance,
			nonce,
		})

		// Retrieve and verify account state
		const account = await tevmGetAccount(client, {
			address: testAddress,
		})

		expect(account).toBeDefined()
		expect(account.balance).toBe(balance)
		expect(account.nonce).toBe(nonce)
	})

	it('should set and retrieve contract code', async () => {
		// Create a client
		const client = createClient({
			transport: createTevmTransport(),
		})

		// Simple contract bytecode (a basic counter contract)
		const bytecode =
			'0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80632a1afcd91461003b5780636057361d14610059575b600080fd5b610043610075565b60405161005091906100a1565b60405180910390f35b610073600480360381019061006e91906100ed565b61007b565b005b60005481565b8060008190555050565b6000819050919050565b61009b81610088565b82525050565b60006020820190506100b66000830184610092565b92915050565b600080fd5b6100ca81610088565b81146100d557600080fd5b50565b6000813590506100e7816100c1565b92915050565b600060208284031215610103576101026100bc565b5b6000610111848285016100d8565b9150509291505056fea264697066735822122044f0132d3ce474208967ede7eba7acbf4d7a69ed0c86bc6bd0f1c51583b2c3d264736f6c63430008110033'

		// Set account state with code - using string bytecode directly as the API requires
		await tevmSetAccount(client, {
			address: testAddress,
			deployedBytecode: bytecode,
		})

		// Retrieve code
		const code = await getCode(client, {
			address: testAddress,
		})

		expect(code).toBe(bytecode)
	})

	it('should set and retrieve contract storage', async () => {
		// Create a client
		const client = createClient({
			transport: createTevmTransport(),
		})

		// Storage key and value - values must be full 32-byte padded hex
		const storageKey = '0x0000000000000000000000000000000000000000000000000000000000000001'
		const storageValue = '0x000000000000000000000000000000000000000000000000000000000000002a' as `0x${string}` // hex for 42

		// Set account with storage using full 32-byte padded value
		await tevmSetAccount(client, {
			address: testAddress,
			state: {
				[storageKey]: storageValue,
			},
		})

		// Retrieve storage at slot
		const retrievedValue = await getStorageAt(client, {
			address: testAddress,
			slot: storageKey,
		})

		// The value might be returned in full 32-byte or simplified hex format
		const normalizedRetrieved = BigInt(retrievedValue ?? '0x0')
		const normalizedExpected = BigInt(storageValue)
		expect(normalizedRetrieved).toBe(normalizedExpected)
	})

	it('should update existing account state', async () => {
		// Create a client
		const client = createClient({
			transport: createTevmTransport(),
		})

		// Initial values
		const initialBalance = parseEther('100')
		const initialNonce = 5n

		// Set initial account state
		await tevmSetAccount(client, {
			address: testAddress,
			balance: initialBalance,
			nonce: initialNonce,
		})

		// Verify initial state
		const initialAccount = await tevmGetAccount(client, {
			address: testAddress,
		})

		expect(initialAccount.balance).toBe(initialBalance)
		expect(initialAccount.nonce).toBe(initialNonce)

		// Update values
		const updatedBalance = parseEther('200')
		const updatedNonce = 10n

		// Update account state
		await tevmSetAccount(client, {
			address: testAddress,
			balance: updatedBalance,
			nonce: updatedNonce,
		})

		// Verify updated state
		const updatedAccount = await tevmGetAccount(client, {
			address: testAddress,
		})

		expect(updatedAccount.balance).toBe(updatedBalance)
		expect(updatedAccount.nonce).toBe(updatedNonce)
	})

	it('should manage multiple accounts simultaneously', async () => {
		// Create a client
		const client = createClient({
			transport: createTevmTransport(),
		})

		// Create multiple addresses
		const addresses = [
			'0x1111111111111111111111111111111111111111',
			'0x2222222222222222222222222222222222222222',
			'0x3333333333333333333333333333333333333333',
		].map((addr) => addr as Address)

		// Set up accounts with different balances
		const balances = [parseEther('10'), parseEther('20'), parseEther('30')]

		for (let i = 0; i < addresses.length; i++) {
			const addr = addresses[i] as `0x${string}`
			const balance = balances[i]
			assert(balance, 'balance is undefined')
			await tevmSetAccount(client, {
				address: addr,
				balance,
				nonce: BigInt(i),
			})
		}

		// Verify all accounts have correct state
		for (let i = 0; i < addresses.length; i++) {
			const addr = addresses[i] as `0x${string}`
			const balance = await getBalance(client, { address: addr })
			// Convert number to bigint for comparison
			const nonce = await getTransactionCount(client, { address: addr })

			expect(balance).toBe(balances[i])
			// Allow for both number and bigint types
			expect(BigInt(nonce)).toBe(BigInt(i))
		}

		// Update just one account
		const updatedIndex = 1
		const updatedBalance = parseEther('100')

		await tevmSetAccount(client, {
			address: addresses[updatedIndex] as `0x${string}`,
			balance: updatedBalance,
		})

		// Verify only that account was updated
		for (let i = 0; i < addresses.length; i++) {
			const addr = addresses[i] as `0x${string}`
			const balance = await getBalance(client, { address: addr })

			if (i === updatedIndex) {
				expect(balance).toBe(updatedBalance)
			} else {
				expect(balance).toBe(balances[i])
			}
		}
	})

	it('should handle large storage structures', async () => {
		// Create a client
		const client = createClient({
			transport: createTevmTransport(),
		})

		// Create a smaller state object (10 keys is enough for testing)
		const largeState: Record<`0x${string}`, `0x${string}`> = {}

		for (let i = 0; i < 10; i++) {
			// Create storage keys in format 0x0...0{i}
			const keyPadding = i.toString(16).padStart(64, '0')
			const key = `0x${keyPadding}` as `0x${string}`

			// Create values - must be full 32-byte padded hex for state mapping
			const value = `0x${i.toString(16).padStart(64, '0')}` as `0x${string}`

			largeState[key] = value
		}

		// Set account with storage
		await tevmSetAccount(client, {
			address: testAddress,
			state: largeState,
		})

		// Verify storage slots
		for (let i = 0; i < 10; i++) {
			const keyPadding = i.toString(16).padStart(64, '0')
			const key = `0x${keyPadding}` as `0x${string}`

			const expectedValue = BigInt(i)

			const actualValue = await getStorageAt(client, {
				address: testAddress,
				slot: key,
			})

			// Storage values may be returned in different hex formats
			expect(BigInt(actualValue ?? '0x0')).toBe(expectedValue)
		}
	})
})
