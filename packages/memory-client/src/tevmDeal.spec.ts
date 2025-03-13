import { createAddress } from '@tevm/address'
import { TestERC20 } from '@tevm/test-utils'
import { encodeFunctionData, parseAbi } from 'viem'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from './createMemoryClient'

describe('tevmDeal', () => {
	it('should deal native ETH to an account', async () => {
		const client = createMemoryClient()
		const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const amount = 1000000000000000000n // 1 ETH

		await client.tevmDeal({
			account,
			amount,
		})

		const balance = await client.getBalance({
			address: account,
		})

		expect(balance).toEqual(amount)
	})

	it('should deal ERC20 tokens to an account', async () => {
		const client = createMemoryClient()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const amount = 1000000n // 1 token with 6 decimals

		// Deploy the token contract
		await client.tevmSetAccount({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		// Deal tokens to the account
		await client.tevmDeal({
			erc20: erc20.address,
			account,
			amount,
		})

		// Verify the balance was updated
		const data = await client.call({
			to: erc20.address,
			data: encodeFunctionData({
				abi: erc20.abi,
				functionName: 'balanceOf',
				args: [account],
			}),
		})

		// Use the ERC20 ABI to decode the result
		const decodedData = client.transport.tevm.decodeCalldata({
			abi: parseAbi(['function balanceOf(address) returns (uint256)']),
			data: data,
		})

		expect(decodedData.data).toEqual(amount)
	})
})
