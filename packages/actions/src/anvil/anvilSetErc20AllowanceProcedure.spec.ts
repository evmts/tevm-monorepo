import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { anvilSetErc20AllowanceJsonRpcProcedure } from './anvilSetErc20AllowanceProcedure.js'

describe('anvilSetErc20AllowanceJsonRpcProcedure', () => {
	it('should set ERC20 allowance', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const owner = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const spender = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		const result = await anvilSetErc20AllowanceJsonRpcProcedure(client)({
			method: 'anvil_setErc20Allowance',
			params: [
				{
					erc20: erc20.address,
					owner: owner,
					spender: spender,
					amount: '0xf4240', // 1M (6 decimals)
				},
			],
			id: 1,
			jsonrpc: '2.0',
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			id: 1,
			method: 'anvil_setErc20Allowance',
			result: null,
		})

		// Verify the allowance was set correctly
		const allowanceResult = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'allowance',
			args: [owner, spender],
		})

		expect(allowanceResult.data).toBe(1000000n)
	})

	it('should handle invalid ERC20 address', async () => {
		const client = createTevmNode()
		const owner = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const spender = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
		const invalidErc20 = '0x0000000000000000000000000000000000000001'

		const result = await anvilSetErc20AllowanceJsonRpcProcedure(client)({
			method: 'anvil_setErc20Allowance',
			params: [
				{
					erc20: invalidErc20,
					owner: owner,
					spender: spender,
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
		const owner = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const spender = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		const result = await anvilSetErc20AllowanceJsonRpcProcedure(client)({
			method: 'anvil_setErc20Allowance',
			params: [
				{
					erc20: erc20.address,
					owner: owner,
					spender: spender,
					amount: '0xf4240',
				},
			],
			jsonrpc: '2.0',
		})

		expect(result).toEqual({
			jsonrpc: '2.0',
			method: 'anvil_setErc20Allowance',
			result: null,
		})
		expect(result).not.toHaveProperty('id')
	})

	it('should set different allowances for different spenders', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const owner = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const spender1 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
		const spender2 = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		// Set allowance for spender1
		await anvilSetErc20AllowanceJsonRpcProcedure(client)({
			method: 'anvil_setErc20Allowance',
			params: [
				{
					erc20: erc20.address,
					owner: owner,
					spender: spender1,
					amount: '0xf4240', // 1M
				},
			],
			id: 1,
			jsonrpc: '2.0',
		})

		// Set allowance for spender2
		await anvilSetErc20AllowanceJsonRpcProcedure(client)({
			method: 'anvil_setErc20Allowance',
			params: [
				{
					erc20: erc20.address,
					owner: owner,
					spender: spender2,
					amount: '0x1e8480', // 2M
				},
			],
			id: 2,
			jsonrpc: '2.0',
		})

		// Verify spender1 allowance
		const allowance1Result = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'allowance',
			args: [owner, spender1],
		})
		expect(allowance1Result.data).toBe(1000000n)

		// Verify spender2 allowance
		const allowance2Result = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'allowance',
			args: [owner, spender2],
		})
		expect(allowance2Result.data).toBe(2000000n)
	})

	it('should set allowance to zero', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const owner = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const spender = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		// First set a non-zero allowance
		await anvilSetErc20AllowanceJsonRpcProcedure(client)({
			method: 'anvil_setErc20Allowance',
			params: [
				{
					erc20: erc20.address,
					owner: owner,
					spender: spender,
					amount: '0xf4240', // 1M
				},
			],
			id: 1,
			jsonrpc: '2.0',
		})

		// Now set allowance to zero
		await anvilSetErc20AllowanceJsonRpcProcedure(client)({
			method: 'anvil_setErc20Allowance',
			params: [
				{
					erc20: erc20.address,
					owner: owner,
					spender: spender,
					amount: '0x0',
				},
			],
			id: 2,
			jsonrpc: '2.0',
		})

		// Verify the allowance is zero
		const allowanceResult = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'allowance',
			args: [owner, spender],
		})
		expect(allowanceResult.data).toBe(0n)
	})
})
