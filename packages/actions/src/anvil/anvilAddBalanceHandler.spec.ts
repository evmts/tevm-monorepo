import { createTevmNode } from '@tevm/node'
import { parseEther } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { getBalanceHandler } from '../eth/getBalanceHandler.js'
import { anvilAddBalanceHandler } from './anvilAddBalanceHandler.js'

describe('anvilAddBalanceHandler', () => {
	it('should add balance to an account with zero balance', async () => {
		const node = createTevmNode()
		const handler = anvilAddBalanceHandler(node)
		const getBalance = getBalanceHandler(node)

		const address = '0x1234567890123456789012345678901234567890'
		const amountToAdd = parseEther('1')

		// Verify starting balance is 0
		const initialBalance = await getBalance({
			address,
			blockTag: 'latest',
		})
		expect(initialBalance).toBe(0n)

		// Add balance
		const result = await handler({
			address,
			amount: amountToAdd,
		})

		expect(result).toBeNull()

		// Verify new balance
		const newBalance = await getBalance({
			address,
			blockTag: 'latest',
		})
		expect(newBalance).toBe(amountToAdd)
	})

	it('should add balance to an account with existing balance', async () => {
		const node = createTevmNode()
		const handler = anvilAddBalanceHandler(node)
		const getBalance = getBalanceHandler(node)

		const address = '0x1234567890123456789012345678901234567890'
		const initialAmount = parseEther('1')
		const amountToAdd = parseEther('2')

		// Set initial balance
		await handler({
			address,
			amount: initialAmount,
		})

		// Add more balance
		const result = await handler({
			address,
			amount: amountToAdd,
		})

		expect(result).toBeNull()

		// Verify new balance is the sum
		const newBalance = await getBalance({
			address,
			blockTag: 'latest',
		})
		expect(newBalance).toBe(initialAmount + amountToAdd)
	})

	it('should work with small amounts (1 wei)', async () => {
		const node = createTevmNode()
		const handler = anvilAddBalanceHandler(node)
		const getBalance = getBalanceHandler(node)

		const address = '0x1234567890123456789012345678901234567890'
		const amountToAdd = 1n

		const result = await handler({
			address,
			amount: amountToAdd,
		})

		expect(result).toBeNull()

		const newBalance = await getBalance({
			address,
			blockTag: 'latest',
		})
		expect(newBalance).toBe(amountToAdd)
	})

	it('should work with very large amounts', async () => {
		const node = createTevmNode()
		const handler = anvilAddBalanceHandler(node)
		const getBalance = getBalanceHandler(node)

		const address = '0x1234567890123456789012345678901234567890'
		// Max uint256 value
		const amountToAdd = parseEther('1000000')

		const result = await handler({
			address,
			amount: amountToAdd,
		})

		expect(result).toBeNull()

		const newBalance = await getBalance({
			address,
			blockTag: 'latest',
		})
		expect(newBalance).toBe(amountToAdd)
	})

	it('should handle hex string amounts', async () => {
		const node = createTevmNode()
		const handler = anvilAddBalanceHandler(node)
		const getBalance = getBalanceHandler(node)

		const address = '0x1234567890123456789012345678901234567890'
		const amountToAdd = parseEther('1')
		const hexAmount = `0x${amountToAdd.toString(16)}` as `0x${string}`

		const result = await handler({
			address,
			amount: hexAmount,
		})

		expect(result).toBeNull()

		const newBalance = await getBalance({
			address,
			blockTag: 'latest',
		})
		expect(newBalance).toBe(amountToAdd)
	})

	it('should handle bigint amounts', async () => {
		const node = createTevmNode()
		const handler = anvilAddBalanceHandler(node)
		const getBalance = getBalanceHandler(node)

		const address = '0x1234567890123456789012345678901234567890'
		const amountToAdd = 123456789n

		const result = await handler({
			address,
			amount: amountToAdd,
		})

		expect(result).toBeNull()

		const newBalance = await getBalance({
			address,
			blockTag: 'latest',
		})
		expect(newBalance).toBe(amountToAdd)
	})

	it('should work with multiple sequential calls', async () => {
		const node = createTevmNode()
		const handler = anvilAddBalanceHandler(node)
		const getBalance = getBalanceHandler(node)

		const address = '0x1234567890123456789012345678901234567890'
		const increment = parseEther('0.1')

		// Add balance 5 times
		for (let i = 0; i < 5; i++) {
			await handler({
				address,
				amount: increment,
			})
		}

		const finalBalance = await getBalance({
			address,
			blockTag: 'latest',
		})
		expect(finalBalance).toBe(increment * 5n)
	})

	it('should handle different addresses independently', async () => {
		const node = createTevmNode()
		const handler = anvilAddBalanceHandler(node)
		const getBalance = getBalanceHandler(node)

		const address1 = '0x1234567890123456789012345678901234567890'
		const address2 = '0x0987654321098765432109876543210987654321'
		const amount1 = parseEther('1')
		const amount2 = parseEther('2')

		// Add different amounts to different addresses
		await handler({ address: address1, amount: amount1 })
		await handler({ address: address2, amount: amount2 })

		// Verify each address has its own balance
		const balance1 = await getBalance({ address: address1, blockTag: 'latest' })
		const balance2 = await getBalance({ address: address2, blockTag: 'latest' })

		expect(balance1).toBe(amount1)
		expect(balance2).toBe(amount2)
	})

	it('should preserve existing balance when adding zero', async () => {
		const node = createTevmNode()
		const handler = anvilAddBalanceHandler(node)
		const getBalance = getBalanceHandler(node)

		const address = '0x1234567890123456789012345678901234567890'
		const initialAmount = parseEther('1')

		// Set initial balance
		await handler({
			address,
			amount: initialAmount,
		})

		// Add zero
		await handler({
			address,
			amount: 0n,
		})

		// Verify balance unchanged
		const finalBalance = await getBalance({
			address,
			blockTag: 'latest',
		})
		expect(finalBalance).toBe(initialAmount)
	})

	it('should throw error for invalid address format', async () => {
		const node = createTevmNode()
		const handler = anvilAddBalanceHandler(node)

		const invalidAddress = 'not-an-address' as any

		await expect(
			handler({
				address: invalidAddress,
				amount: parseEther('1'),
			}),
		).rejects.toThrow()
	})

	it('should handle contract addresses', async () => {
		const node = createTevmNode()
		const handler = anvilAddBalanceHandler(node)
		const getBalance = getBalanceHandler(node)

		// Use a typical contract-like address
		const contractAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
		const amountToAdd = parseEther('10')

		const result = await handler({
			address: contractAddress,
			amount: amountToAdd,
		})

		expect(result).toBeNull()

		const newBalance = await getBalance({
			address: contractAddress,
			blockTag: 'latest',
		})
		expect(newBalance).toBe(amountToAdd)
	})
})
