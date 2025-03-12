import { type Address, type Client, createClient, createMemoryClient, hexToBytes, parseEther } from 'viem'
import { getBalance, getCode, getStorageAt, getTransactionCount } from 'viem/actions'
import { describe, expect, it } from 'vitest'
import type { TevmTransport } from './TevmTransport.js'
import { createTevmTransport } from './createTevmTransport.js'
import { tevmGetAccount } from './tevmGetAccount.js'
import { tevmSetAccount } from './tevmSetAccount.js'

describe('Tevm Account Management', () => {
	const testAddress = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' as Address
	const storageSampleKey = '0x0000000000000000000000000000000000000000000000000000000000000001'
	const storageSampleValue = '0x000000000000000000000000000000000000000000000000000000000000002a' // hex for 42

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

		// Set account state with code
		await tevmSetAccount(client, {
			address: testAddress,
			deployedBytecode: hexToBytes(bytecode),
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

		// Set account with storage
		await tevmSetAccount(client, {
			address: testAddress,
			state: {
				[storageSampleKey]: storageSampleValue,
			},
		})

		// Retrieve storage at slot
		const storageValue = await getStorageAt(client, {
			address: testAddress,
			slot: storageSampleKey,
		})

		expect(storageValue).toBe(storageSampleValue)
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
			await tevmSetAccount(client, {
				address: addresses[i],
				balance: balances[i],
				nonce: BigInt(i),
			})
		}

		// Verify all accounts have correct state
		for (let i = 0; i < addresses.length; i++) {
			const balance = await getBalance(client, { address: addresses[i] })
			const nonce = await getTransactionCount(client, { address: addresses[i] })

			expect(balance).toBe(balances[i])
			expect(nonce).toBe(BigInt(i))
		}

		// Update just one account
		const updatedIndex = 1
		const updatedBalance = parseEther('100')

		await tevmSetAccount(client, {
			address: addresses[updatedIndex],
			balance: updatedBalance,
		})

		// Verify only that account was updated
		for (let i = 0; i < addresses.length; i++) {
			const balance = await getBalance(client, { address: addresses[i] })

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

		// Create a large state object (100 keys)
		const largeState: Record<string, string> = {}

		for (let i = 0; i < 100; i++) {
			// Create storage keys in format 0x0...0{i}
			const keyPadding = i.toString(16).padStart(64, '0')
			const key = `0x${keyPadding}`

			// Create values in format 0x0...0{i*2}
			const valuePadding = (i * 2).toString(16).padStart(64, '0')
			const value = `0x${valuePadding}`

			largeState[key] = value
		}

		// Set account with large storage
		await tevmSetAccount(client, {
			address: testAddress,
			state: largeState,
		})

		// Verify a sample of storage slots
		for (let i = 0; i < 100; i += 10) {
			const keyPadding = i.toString(16).padStart(64, '0')
			const key = `0x${keyPadding}`

			const valuePadding = (i * 2).toString(16).padStart(64, '0')
			const expectedValue = `0x${valuePadding}`

			const actualValue = await getStorageAt(client, {
				address: testAddress,
				slot: key,
			})

			expect(actualValue).toBe(expectedValue)
		}
	})
})
