import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { anvilDealErc20JsonRpcProcedure } from './anvilDealErc20Procedure.js'

describe('anvilDealErc20JsonRpcProcedure', () => {
	it('should set ERC20 token balance', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		const result = await anvilDealErc20JsonRpcProcedure(client)({
			method: 'anvil_dealErc20',
			params: [
				{
					erc20: erc20.address,
					account: account,
					amount: '0xf4240', // 1M (6 decimals)
				},
			],
			id: 1,
			jsonrpc: '2.0',
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			id: 1,
			method: 'anvil_dealErc20',
			result: null,
		})

		// Verify the balance was set correctly
		const balanceResult = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'balanceOf',
			args: [account],
		})

		expect(balanceResult.data).toBe(1000000n)
	})

	it('should handle invalid ERC20 address', async () => {
		const client = createTevmNode()
		const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const invalidErc20 = '0x0000000000000000000000000000000000000001'

		const result = await anvilDealErc20JsonRpcProcedure(client)({
			method: 'anvil_dealErc20',
			params: [
				{
					erc20: invalidErc20,
					account: account,
					amount: '0xf4240',
				},
			],
			id: 1,
			jsonrpc: '2.0',
		})

		expect(result).toHaveProperty('error')
	})

	it('should handle request without id', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		const result = await anvilDealErc20JsonRpcProcedure(client)({
			method: 'anvil_dealErc20',
			params: [
				{
					erc20: erc20.address,
					account: account,
					amount: '0xf4240',
				},
			],
			jsonrpc: '2.0',
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_dealErc20',
			result: null,
		})
		expect(result).not.toHaveProperty('id')
	})

	it('should set different amounts for different accounts', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const account1 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const account2 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		// Set balance for account1
		await anvilDealErc20JsonRpcProcedure(client)({
			method: 'anvil_dealErc20',
			params: [
				{
					erc20: erc20.address,
					account: account1,
					amount: '0xf4240', // 1M
				},
			],
			id: 1,
			jsonrpc: '2.0',
		})

		// Set balance for account2
		await anvilDealErc20JsonRpcProcedure(client)({
			method: 'anvil_dealErc20',
			params: [
				{
					erc20: erc20.address,
					account: account2,
					amount: '0x1e8480', // 2M
				},
			],
			id: 2,
			jsonrpc: '2.0',
		})

		// Verify account1 balance
		const balance1Result = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'balanceOf',
			args: [account1],
		})
		expect(balance1Result.data).toBe(1000000n)

		// Verify account2 balance
		const balance2Result = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'balanceOf',
			args: [account2],
		})
		expect(balance2Result.data).toBe(2000000n)
	})
})
