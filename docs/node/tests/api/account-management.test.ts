import { createTevmNode } from 'tevm'
import { getAccountHandler, setAccountHandler } from 'tevm/actions'
import { parseEther } from 'viem'
import { describe, expect, it } from 'vitest'

describe('Account Management Documentation Examples', () => {
	describe('Basic Usage', () => {
		it('should get account state', async () => {
			const node = createTevmNode()
			const address = '0x1234567890123456789012345678901234567890'

			const account = await getAccountHandler(node)({
				address,
				blockTag: 'latest',
				returnStorage: true,
			})

			expect(account).toBeDefined()
			expect(account.balance).toBeDefined()
			expect(account.nonce).toBeDefined()
			expect(account.deployedBytecode).toBeDefined()
		})

		it('should set account balance', async () => {
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

	describe('Contract Deployment', () => {
		it('should deploy contract code', async () => {
			const node = createTevmNode()
			const address = '0x1234567890123456789012345678901234567890'
			const bytecode =
				'0x6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea2646970667358221220d28cf161457f7da811e391bf21de2cf0f9b8762e8df55e4847403bcce364946264736f6c63430008130033'

			await setAccountHandler(node)({
				address,
				deployedBytecode: bytecode,
				state: {
					'0x0000000000000000000000000000000000000000000000000000000000000000':
						'0x0000000000000000000000000000000000000000000000000000000000000001',
				},
			})

			const account = await getAccountHandler(node)({
				address,
				returnStorage: true,
			})

			expect(account.deployedBytecode).toBe(bytecode)
			expect(account.isContract).toBe(true)
			expect(account.storage).toBeDefined()
		})
	})

	describe('Error Handling', () => {
		it('should handle errors gracefully', async () => {
			const node = createTevmNode()
			const address = '0x1234567890123456789012345678901234567890'

			const result = await setAccountHandler(node)({
				address,
				balance: parseEther('100'),
				throwOnFail: false,
			})

			expect(result.errors).toBeUndefined()
		})
	})

	describe('State Consistency', () => {
		it('should check account exists before modifying', async () => {
			const node = createTevmNode()
			const address = '0x1234567890123456789012345678901234567890'
			const amount = parseEther('10')

			const account = await getAccountHandler(node)({ address })
			if (!account.isEmpty) {
				await setAccountHandler(node)({
					address,
					balance: account.balance + amount,
				})
			}

			const updatedAccount = await getAccountHandler(node)({ address })
			expect(updatedAccount.balance).toBeDefined()
		})
	})
})
