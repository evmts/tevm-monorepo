import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { dealErc20Handler } from './anvilDealErc20Handler.js'

describe('dealErc20Handler', () => {
	it('should set ERC20 token balance', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		const handler = dealErc20Handler(client)
		const result = await handler({
			erc20: erc20.address,
			account: account,
			amount: 1000000n, // 1M tokens
		})

		expect(result).toEqual({})

		// Verify the balance was set correctly
		const balanceResult = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'balanceOf',
			args: [account],
		})

		expect(balanceResult.data).toBe(1000000n)
	})

	it('should handle setting balance to zero', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		const handler = dealErc20Handler(client)

		// First set a non-zero balance
		await handler({
			erc20: erc20.address,
			account: account,
			amount: 1000000n,
		})

		// Now set balance to zero
		const result = await handler({
			erc20: erc20.address,
			account: account,
			amount: 0n,
		})

		expect(result).toEqual({})

		// Verify the balance is zero
		const balanceResult = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'balanceOf',
			args: [account],
		})

		expect(balanceResult.data).toBe(0n)
	})

	it('should handle invalid ERC20 address', async () => {
		const client = createTevmNode()
		const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const invalidErc20 = '0x0000000000000000000000000000000000000001'

		const handler = dealErc20Handler(client)
		const result = await handler({
			erc20: invalidErc20,
			account: account,
			amount: 1000000n,
		})

		expect(result).toHaveProperty('errors')
		expect(result.errors).toBeDefined()
		expect(result.errors?.length).toBeGreaterThan(0)
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

		const handler = dealErc20Handler(client)

		// Set balance for account1
		await handler({
			erc20: erc20.address,
			account: account1,
			amount: 1000000n,
		})

		// Set balance for account2
		await handler({
			erc20: erc20.address,
			account: account2,
			amount: 2000000n,
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

	it('should overwrite existing balance', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		const handler = dealErc20Handler(client)

		// Set initial balance
		await handler({
			erc20: erc20.address,
			account: account,
			amount: 1000000n,
		})

		// Overwrite with new balance
		await handler({
			erc20: erc20.address,
			account: account,
			amount: 5000000n,
		})

		// Verify the balance was overwritten (not added)
		const balanceResult = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'balanceOf',
			args: [account],
		})

		expect(balanceResult.data).toBe(5000000n)
	})

	it('should handle very large amounts', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		const handler = dealErc20Handler(client)

		// Set a very large balance
		const largeAmount = 10n ** 30n // 1 trillion tokens with 18 decimals
		await handler({
			erc20: erc20.address,
			account: account,
			amount: largeAmount,
		})

		// Verify the balance
		const balanceResult = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'balanceOf',
			args: [account],
		})

		expect(balanceResult.data).toBe(largeAmount)
	})

	it('should handle multiple ERC20 tokens independently', async () => {
		const client = createTevmNode()
		const erc20_1 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const erc20_2 = TestERC20.withAddress(createAddress('0x77b55').toString())
		const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

		// Deploy both contracts
		await setAccountHandler(client)({
			address: erc20_1.address,
			deployedBytecode: erc20_1.deployedBytecode,
		})
		await setAccountHandler(client)({
			address: erc20_2.address,
			deployedBytecode: erc20_2.deployedBytecode,
		})

		const handler = dealErc20Handler(client)

		// Set different balances for each token
		await handler({
			erc20: erc20_1.address,
			account: account,
			amount: 1000000n,
		})
		await handler({
			erc20: erc20_2.address,
			account: account,
			amount: 2000000n,
		})

		// Verify each token has its own balance
		const balance1Result = await contractHandler(client)({
			to: erc20_1.address,
			abi: TestERC20.abi,
			functionName: 'balanceOf',
			args: [account],
		})
		expect(balance1Result.data).toBe(1000000n)

		const balance2Result = await contractHandler(client)({
			to: erc20_2.address,
			abi: TestERC20.abi,
			functionName: 'balanceOf',
			args: [account],
		})
		expect(balance2Result.data).toBe(2000000n)
	})

	it('should return error when contract does not exist', async () => {
		const client = createTevmNode()
		const nonExistentContract = '0x1234567890123456789012345678901234567890'
		const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

		const handler = dealErc20Handler(client)
		const result = await handler({
			erc20: nonExistentContract,
			account: account,
			amount: 1000000n,
		})

		expect(result).toHaveProperty('errors')
		expect(result.errors).toBeDefined()
	})

	it('should handle setting balance multiple times in sequence', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		const handler = dealErc20Handler(client)

		// Set balance multiple times
		for (let i = 1; i <= 5; i++) {
			await handler({
				erc20: erc20.address,
				account: account,
				amount: BigInt(i * 1000000),
			})

			// Verify the balance after each set
			const balanceResult = await contractHandler(client)({
				to: erc20.address,
				abi: TestERC20.abi,
				functionName: 'balanceOf',
				args: [account],
			})
			expect(balanceResult.data).toBe(BigInt(i * 1000000))
		}
	})

	it('should properly manipulate storage without affecting other storage slots', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const account1 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const account2 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		const handler = dealErc20Handler(client)

		// Set balance for account1
		await handler({
			erc20: erc20.address,
			account: account1,
			amount: 1000000n,
		})

		// Set balance for account2
		await handler({
			erc20: erc20.address,
			account: account2,
			amount: 2000000n,
		})

		// Verify both balances remain intact
		const balance1Result = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'balanceOf',
			args: [account1],
		})
		expect(balance1Result.data).toBe(1000000n)

		const balance2Result = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'balanceOf',
			args: [account2],
		})
		expect(balance2Result.data).toBe(2000000n)
	})
})
