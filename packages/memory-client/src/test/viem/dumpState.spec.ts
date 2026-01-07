import { optimism } from '@tevm/common'
import { SimpleContract } from '@tevm/contract'
import { numberToHex, parseEther } from '@tevm/utils'
import { assert, beforeEach, describe, expect, it } from 'vitest'
import { createClient } from '../../createClient.js'
import { createMemoryClient } from '../../createMemoryClient.js'
import { createTevmTransport } from '../../createTevmTransport.js'
import type { MemoryClient } from '../../MemoryClient.js'
import { tevmDumpState } from '../../tevmDumpState.js'

let mc: MemoryClient

const testAccount1 = `0x${'11'.repeat(20)}` as const
const testAccount2 = `0x${'22'.repeat(20)}` as const

beforeEach(async () => {
	mc = createMemoryClient()
	await mc.tevmReady()

	await mc.tevmSetAccount({
		address: testAccount1,
		balance: parseEther('10'),
		nonce: 5n,
	})
})

describe('dumpState', () => {
	it('should dump the current state with account data', async () => {
		const stateDump = await mc.tevmDumpState()

		expect(stateDump).toBeDefined()
		expect(stateDump.state).toBeDefined()
		expect(typeof stateDump.state).toBe('object')

		const accountAddresses = Object.keys(stateDump.state)
		expect(accountAddresses.length).toBeGreaterThan(0)
		assert(accountAddresses[0], 'accountAddresses is empty')

		const firstAccount = stateDump.state[accountAddresses[0]]
		expect(firstAccount).toHaveProperty('balance')
		expect(firstAccount).toHaveProperty('nonce')
		expect(firstAccount).toHaveProperty('storage')
	})

	it('should work with a standard viem client', async () => {
		const client = createClient({
			transport: createTevmTransport({}),
			chain: optimism,
		})

		const stateDump = await tevmDumpState(client)

		expect(stateDump).toBeDefined()
		expect(stateDump.state).toBeDefined()
	})

	it('should include deployed contract code in the dump', async () => {
		const contractAddress = `0x${'66'.repeat(20)}` as const

		await mc.tevmSetAccount({
			address: contractAddress,
			deployedBytecode: SimpleContract.deployedBytecode,
			balance: 0n,
		})

		const stateDump = await mc.tevmDumpState()

		const contractDump = stateDump.state[contractAddress.toLowerCase()]
		assert(contractDump, 'contractDump is undefined')
		expect(contractDump).toBeDefined()
		expect(contractDump.deployedBytecode).toBe(SimpleContract.deployedBytecode)
		expect(contractDump.balance).toBe(numberToHex(0n))
	})

	it('should accurately dump custom account state with storage', async () => {
		const customAddress = `0x${'33'.repeat(20)}` as const
		const customBalance = parseEther('123.456')
		const customNonce = 42n
		const customStorageValue = '0x1234567890abcdef0000000000000000000000000000000000000000000000'
		const customStorageKey = '0x0000000000000000000000000000000000000000000000000000000000000001'

		await mc.tevmSetAccount({
			address: customAddress,
			balance: customBalance,
			nonce: customNonce,
			state: {
				[customStorageKey]: customStorageValue,
			},
		})

		const stateDump = await mc.tevmDumpState()

		const customAccountDump = stateDump.state[customAddress.toLowerCase()]
		assert(customAccountDump, 'customAccountDump is undefined')
		expect(customAccountDump.balance).toBe(numberToHex(customBalance))
		expect(customAccountDump.nonce).toBe(numberToHex(customNonce))
		expect(customAccountDump.storage).toBeDefined()
		assert(customAccountDump.storage, 'storage is undefined')
		expect(customAccountDump.storage[customStorageKey]).toBe(customStorageValue)
	})

	it('should handle minimal accounts correctly', async () => {
		const minimalAddress = `0x${'44'.repeat(20)}` as const

		await mc.tevmSetAccount({
			address: minimalAddress,
			balance: 1n,
		})

		const stateDump = await mc.tevmDumpState()

		const accountDump = stateDump.state[minimalAddress.toLowerCase()]
		assert(accountDump, 'accountDump is undefined')
		expect(accountDump.balance).toBe(numberToHex(1n))
		expect(accountDump.nonce).toBe(numberToHex(0n))
		expect(accountDump.storage).toEqual({})
		expect(accountDump.deployedBytecode === undefined || accountDump.deployedBytecode === '0x').toBe(true)
	})

	it('should handle multiple clients with isolated states', async () => {
		const secondClient = createMemoryClient()
		await secondClient.tevmReady()

		const uniqueAddress = `0x${'55'.repeat(20)}` as const
		await secondClient.tevmSetAccount({
			address: uniqueAddress,
			balance: parseEther('777'),
		})

		const firstClientDump = await mc.tevmDumpState()
		const secondClientDump = await secondClient.tevmDumpState()

		expect(firstClientDump.state[testAccount1.toLowerCase()]).toBeDefined()
		expect(secondClientDump.state[uniqueAddress.toLowerCase()]).toBeDefined()
		expect(firstClientDump.state[uniqueAddress.toLowerCase()]).toBeUndefined()
	})

	it('should capture account state changes', async () => {
		const initialDump = await mc.tevmDumpState()
		const initialAccount = initialDump.state[testAccount1.toLowerCase()]
		assert(initialAccount, 'initialAccount is undefined')
		expect(initialAccount.balance).toBe(numberToHex(parseEther('10')))
		expect(initialAccount.nonce).toBe(numberToHex(5n))

		await mc.tevmSetAccount({
			address: testAccount1,
			balance: parseEther('20'),
			nonce: 10n,
		})

		const updatedDump = await mc.tevmDumpState()
		const updatedAccount = updatedDump.state[testAccount1.toLowerCase()]
		assert(updatedAccount, 'updatedAccount is undefined')
		expect(updatedAccount.balance).toBe(numberToHex(parseEther('20')))
		expect(updatedAccount.nonce).toBe(numberToHex(10n))
	})

	it('should dump state with multiple accounts', async () => {
		await mc.tevmSetAccount({
			address: testAccount2,
			balance: parseEther('5'),
			nonce: 3n,
		})

		const stateDump = await mc.tevmDumpState()

		const account1 = stateDump.state[testAccount1.toLowerCase()]
		const account2 = stateDump.state[testAccount2.toLowerCase()]

		assert(account1, 'account1 is undefined')
		assert(account2, 'account2 is undefined')

		expect(account1.balance).toBe(numberToHex(parseEther('10')))
		expect(account1.nonce).toBe(numberToHex(5n))

		expect(account2.balance).toBe(numberToHex(parseEther('5')))
		expect(account2.nonce).toBe(numberToHex(3n))
	})
})
