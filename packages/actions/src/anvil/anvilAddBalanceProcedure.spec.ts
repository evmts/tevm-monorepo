import { createTevmNode } from '@tevm/node'
import { parseEther } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { getBalanceProcedure } from '../eth/getBalanceProcedure.js'
import { anvilAddBalanceJsonRpcProcedure } from './anvilAddBalanceProcedure.js'

describe('anvilAddBalanceProcedure', () => {
	it('should add balance to an account with zero balance', async () => {
		const node = createTevmNode()
		const addBalanceProcedure = anvilAddBalanceJsonRpcProcedure(node)
		const getBalance = getBalanceProcedure(node)

		const address = '0x1234567890123456789012345678901234567890'
		const amountToAdd = parseEther('1')

		// Verify starting balance is 0
		const initialBalance = await getBalance({
			jsonrpc: '2.0',
			method: 'eth_getBalance',
			params: [address, 'latest'],
			id: 1,
		})
		expect(initialBalance.result).toBe('0x0')

		// Add balance
		const result = await addBalanceProcedure({
			jsonrpc: '2.0',
			method: 'anvil_addBalance',
			params: [address, `0x${amountToAdd.toString(16)}`],
			id: 1,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_addBalance',
			result: null,
			id: 1,
		})

		// Verify new balance
		const newBalance = await getBalance({
			jsonrpc: '2.0',
			method: 'eth_getBalance',
			params: [address, 'latest'],
			id: 1,
		})
		expect(BigInt(newBalance.result)).toBe(amountToAdd)
	})

	it('should add balance to an account with existing balance', async () => {
		const node = createTevmNode()
		const addBalanceProcedure = anvilAddBalanceJsonRpcProcedure(node)
		const getBalance = getBalanceProcedure(node)

		const address = '0x1234567890123456789012345678901234567890'
		const initialAmount = parseEther('1')
		const amountToAdd = parseEther('2')

		// Set initial balance
		await addBalanceProcedure({
			jsonrpc: '2.0',
			method: 'anvil_addBalance',
			params: [address, `0x${initialAmount.toString(16)}`],
			id: 1,
		})

		// Add more balance
		const result = await addBalanceProcedure({
			jsonrpc: '2.0',
			method: 'anvil_addBalance',
			params: [address, `0x${amountToAdd.toString(16)}`],
			id: 2,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_addBalance',
			result: null,
			id: 2,
		})

		// Verify new balance is the sum
		const newBalance = await getBalance({
			jsonrpc: '2.0',
			method: 'eth_getBalance',
			params: [address, 'latest'],
			id: 1,
		})
		expect(BigInt(newBalance.result)).toBe(initialAmount + amountToAdd)
	})

	it('should work with small amounts', async () => {
		const node = createTevmNode()
		const addBalanceProcedure = anvilAddBalanceJsonRpcProcedure(node)
		const getBalance = getBalanceProcedure(node)

		const address = '0x1234567890123456789012345678901234567890'
		const amountToAdd = 1n // 1 wei

		const result = await addBalanceProcedure({
			jsonrpc: '2.0',
			method: 'anvil_addBalance',
			params: [address, '0x1'],
			id: 1,
		})

		expect(result.result).toBe(null)

		const newBalance = await getBalance({
			jsonrpc: '2.0',
			method: 'eth_getBalance',
			params: [address, 'latest'],
			id: 1,
		})
		expect(BigInt(newBalance.result)).toBe(amountToAdd)
	})

	it('should work without id in request', async () => {
		const node = createTevmNode()
		const addBalanceProcedure = anvilAddBalanceJsonRpcProcedure(node)

		const address = '0x1234567890123456789012345678901234567890'
		const amountToAdd = parseEther('1')

		const result = await addBalanceProcedure({
			jsonrpc: '2.0',
			method: 'anvil_addBalance',
			params: [address, `0x${amountToAdd.toString(16)}`],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_addBalance',
			result: null,
		})
	})

	it('should handle invalid addresses', async () => {
		const node = createTevmNode()
		const addBalanceProcedure = anvilAddBalanceJsonRpcProcedure(node)

		const invalidAddress = 'not-an-address'
		const amountToAdd = parseEther('1')

		const result = await addBalanceProcedure({
			jsonrpc: '2.0',
			method: 'anvil_addBalance',
			params: [invalidAddress, `0x${amountToAdd.toString(16)}`],
			id: 1,
		})

		expect(result.error).toBeDefined()
		expect(result.error?.code).toBe('-32000')
	})
})
