import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { anvilDealJsonRpcProcedure } from './anvilDealProcedure.js'

describe('anvilDealJsonRpcProcedure', () => {
	it('should deal ERC20 tokens', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		const result = await anvilDealJsonRpcProcedure(client)({
			method: 'anvil_deal',
			params: [
				{
					erc20: erc20.address,
					account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
					amount: '0xf4240', // 1M (6 decimals)
				},
			],
			id: 1,
			jsonrpc: '2.0',
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			id: 1,
			method: 'anvil_deal',
			result: null,
		})
	})

	it('should deal native tokens when no erc20 address provided', async () => {
		const client = createTevmNode()

		const result = await anvilDealJsonRpcProcedure(client)({
			method: 'anvil_deal',
			params: [
				{
					account: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
					amount: '0xde0b6b3a7640000', // 1 ETH
				},
			],
			id: 1,
			jsonrpc: '2.0',
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			id: 1,
			method: 'anvil_deal',
			result: null,
		})
	})
})
