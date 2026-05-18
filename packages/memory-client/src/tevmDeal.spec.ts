import { createAddress } from '@tevm/address'
import { mainnet } from '@tevm/common'
import { TestERC20, transports } from '@tevm/test-utils'
import { erc20Abi } from 'viem'
import { describe, expect, it } from 'vitest'
import { createMemoryClient } from './createMemoryClient.js'

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

		// Verify the balance was updated using tevmContract
		const result = await client.tevmContract({
			to: erc20.address,
			abi: erc20.abi,
			functionName: 'balanceOf',
			args: [account],
		})

		expect(result.data).toEqual(amount)
	})
})

describe('bug repro march 17th', () => {
	const client = createMemoryClient({
		common: mainnet,
		fork: {
			transport: transports.mainnet,
		},
	})
	const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
	const amount = BigInt(1000000)
	describe('tevmDeal', () => {
		it('should deal WETH to an account', async () => {
			const token = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' // WETH

			// Deal tokens to the account
			await client.tevmDeal({
				erc20: token,
				account,
				amount,
			})

			// Verify the balance was updated using tevmContract
			const result = await client.tevmContract({
				to: token,
				abi: erc20Abi,
				functionName: 'balanceOf',
				args: [account],
			})

			expect(result.data).toEqual(amount)
		})

		it('should deal a Proxy token to an account', async () => {
			const token = '0xE95A203B1a91a908F9B9CE46459d101078c2c3cb' // PROXY

			// Deal tokens to the account
			await client.tevmDeal({
				erc20: token,
				account,
				amount,
			})

			// Verify the balance was updated using tevmContract
			const result = await client.tevmContract({
				to: token,
				abi: erc20Abi,
				functionName: 'balanceOf',
				args: [account],
			})

			expect(result.data).toEqual(amount)
		})
	})
})
