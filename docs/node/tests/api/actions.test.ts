import { createTevmNode } from 'tevm'
import {
	callHandler,
	dumpStateHandler,
	getAccountHandler,
	loadStateHandler,
	mineHandler,
	setAccountHandler,
} from 'tevm/actions'
import { parseEther } from 'viem'
import { describe, expect, it } from 'vitest'

describe('Actions Documentation Examples', () => {
	describe('Basic Actions', () => {
		it('should execute call action', async () => {
			const node = createTevmNode()

			const result = await callHandler(node)({
				to: '0x1234567890123456789012345678901234567890',
				data: '0x',
				value: 0n,
			})

			expect(result).toBeDefined()
			expect(result.executionGasUsed).toBeDefined()
		})

		it('should mine blocks', async () => {
			const node = createTevmNode()

			const result = await mineHandler(node)({
				blockCount: 1,
			})

			expect(result).toBeDefined()
			if (result.blockHashes) {
				expect(result.blockHashes.length).toBe(1)
			}
		})
	})

	describe('Account Management', () => {
		it('should manage account state', async () => {
			const node = createTevmNode()
			const address = '0x1234567890123456789012345678901234567890'

			await setAccountHandler(node)({
				address,
				balance: parseEther('100'),
			})

			const account = await getAccountHandler(node)({
				address,
				blockTag: 'latest',
			})

			expect(account.balance).toBe(parseEther('100'))
		})
	})

	describe('State Management', () => {
		it('should dump and load state', async () => {
			const node = createTevmNode()
			const address = '0x1234567890123456789012345678901234567890'

			// Set initial state
			await setAccountHandler(node)({
				address,
				balance: parseEther('100'),
			})

			// Dump state
			const state = await dumpStateHandler(node)()
			expect(state).toBeDefined()

			// Create new node
			const newNode = createTevmNode()

			// Load state
			await loadStateHandler(newNode)({
				state,
			})

			// Verify state was loaded
			const account = await getAccountHandler(newNode)({
				address,
				blockTag: 'latest',
			})

			expect(account.balance).toBe(parseEther('100'))
		})
	})

	describe('Error Handling', () => {
		it('should handle action errors', async () => {
			const node = createTevmNode()

			const result = await callHandler(node)({
				to: '0x1234567890123456789012345678901234567890',
				data: '0x',
				value: parseEther('1000'), // More than available balance
				throwOnFail: false,
			})

			expect(result.errors).toBeDefined()
		})
	})

	describe('Action Composition', () => {
		it('should compose multiple actions', async () => {
			const node = createTevmNode()
			const address = '0x1234567890123456789012345678901234567890'

			// Set account state
			await setAccountHandler(node)({
				address,
				balance: parseEther('100'),
			})

			// Execute call
			const result = await callHandler(node)({
				to: address,
				value: parseEther('10'),
			})

			expect(result.executionGasUsed).toBeDefined()

			// Mine block
			await mineHandler(node)({
				blockCount: 1,
			})

			// Verify final state
			const account = await getAccountHandler(node)({
				address,
				blockTag: 'latest',
			})

			expect(account.balance).toBeDefined()
		})
	})
})
