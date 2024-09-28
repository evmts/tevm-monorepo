import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { numberToHex, parseEther } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { getAccountProcedure } from '../GetAccount/getAccountProcedure.js'
import { anvilSetBalanceJsonRpcProcedure } from './anvilSetBalanceProcedure.js'

describe('anvilSetBalanceJsonRpcProcedure', () => {
	it('should set the balance for a given address', async () => {
		const client = createTevmNode()
		const procedure = anvilSetBalanceJsonRpcProcedure(client)
		const address = createAddress('0x1234567890123456789012345678901234567890')
		const newBalance = parseEther('100')

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setBalance',
			params: [address.toString(), numberToHex(newBalance)],
			id: 1,
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setBalance',
			result: null,
			id: 1,
		})

		// Verify the balance was actually set
		const getAccount = getAccountProcedure(client)
		const accountState = await getAccount({
			jsonrpc: '2.0',
			method: 'tevm_getAccount',
			params: [{ address: address.toString() }],
			id: 2,
		})

		expect(accountState.result?.balance).toBe(numberToHex(newBalance))
	})

	it('should handle requests without an id', async () => {
		const client = createTevmNode()
		const procedure = anvilSetBalanceJsonRpcProcedure(client)
		const address = createAddress('0x1234567890123456789012345678901234567890')
		const newBalance = parseEther('100')

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setBalance',
			params: [address.toString(), numberToHex(newBalance)],
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setBalance',
			result: null,
		})
	})

	it('should handle errors from setAccountProcedure', async () => {
		const client = createTevmNode()
		const procedure = anvilSetBalanceJsonRpcProcedure(client)
		const invalidAddress = '0xinvalid'
		const newBalance = parseEther('100')

		const result = await procedure({
			jsonrpc: '2.0',
			method: 'anvil_setBalance',
			params: [invalidAddress, numberToHex(newBalance)],
			id: 1,
		})

		expect(result).toHaveProperty('error')
		expect(result.error).toHaveProperty('message')
		expect(result.jsonrpc).toBe('2.0')
		expect(result.method).toBe('anvil_setBalance')
		expect(result.id).toBe(1)
	})
})
