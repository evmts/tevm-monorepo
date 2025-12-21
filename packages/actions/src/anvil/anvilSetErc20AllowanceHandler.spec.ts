import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { setErc20AllowanceHandler } from './anvilSetErc20AllowanceHandler.js'

describe('setErc20AllowanceHandler', () => {
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

		const handler = setErc20AllowanceHandler(client)
		const result = await handler({
			erc20: erc20.address,
			owner: owner,
			spender: spender,
			amount: 1000000n, // 1M tokens
		})

		expect(result).toEqual({})

		// Verify the allowance was set correctly
		const allowanceResult = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'allowance',
			args: [owner, spender],
		})

		expect(allowanceResult.data).toBe(1000000n)
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

		const handler = setErc20AllowanceHandler(client)

		// First set a non-zero allowance
		await handler({
			erc20: erc20.address,
			owner: owner,
			spender: spender,
			amount: 1000000n,
		})

		// Now set allowance to zero
		const result = await handler({
			erc20: erc20.address,
			owner: owner,
			spender: spender,
			amount: 0n,
		})

		expect(result).toEqual({})

		// Verify the allowance is zero
		const allowanceResult = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'allowance',
			args: [owner, spender],
		})
		expect(allowanceResult.data).toBe(0n)
	})

	it('should handle invalid ERC20 address', async () => {
		const client = createTevmNode()
		const owner = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const spender = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
		const invalidErc20 = '0x0000000000000000000000000000000000000001'

		const handler = setErc20AllowanceHandler(client)
		const result = await handler({
			erc20: invalidErc20,
			owner: owner,
			spender: spender,
			amount: 1000000n,
		})

		expect(result).toHaveProperty('errors')
		expect(result.errors).toBeDefined()
		expect(result.errors?.length).toBeGreaterThan(0)
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

		const handler = setErc20AllowanceHandler(client)

		// Set allowance for spender1
		await handler({
			erc20: erc20.address,
			owner: owner,
			spender: spender1,
			amount: 1000000n,
		})

		// Set allowance for spender2
		await handler({
			erc20: erc20.address,
			owner: owner,
			spender: spender2,
			amount: 2000000n,
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

	it('should overwrite existing allowance', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const owner = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const spender = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		const handler = setErc20AllowanceHandler(client)

		// Set initial allowance
		await handler({
			erc20: erc20.address,
			owner: owner,
			spender: spender,
			amount: 1000000n,
		})

		// Overwrite with new allowance
		await handler({
			erc20: erc20.address,
			owner: owner,
			spender: spender,
			amount: 5000000n,
		})

		// Verify the allowance was overwritten
		const allowanceResult = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'allowance',
			args: [owner, spender],
		})

		expect(allowanceResult.data).toBe(5000000n)
	})

	it('should handle very large allowance amounts', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const owner = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const spender = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		const handler = setErc20AllowanceHandler(client)

		// Set a very large allowance
		const largeAmount = 10n ** 30n // 1 trillion tokens with 18 decimals
		await handler({
			erc20: erc20.address,
			owner: owner,
			spender: spender,
			amount: largeAmount,
		})

		// Verify the allowance
		const allowanceResult = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'allowance',
			args: [owner, spender],
		})

		expect(allowanceResult.data).toBe(largeAmount)
	})

	it('should handle different owners independently', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const owner1 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const owner2 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
		const spender = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		const handler = setErc20AllowanceHandler(client)

		// Set different allowances from different owners
		await handler({
			erc20: erc20.address,
			owner: owner1,
			spender: spender,
			amount: 1000000n,
		})

		await handler({
			erc20: erc20.address,
			owner: owner2,
			spender: spender,
			amount: 2000000n,
		})

		// Verify each owner's allowance is independent
		const allowance1Result = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'allowance',
			args: [owner1, spender],
		})
		expect(allowance1Result.data).toBe(1000000n)

		const allowance2Result = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'allowance',
			args: [owner2, spender],
		})
		expect(allowance2Result.data).toBe(2000000n)
	})

	it('should handle multiple ERC20 tokens independently', async () => {
		const client = createTevmNode()
		const erc20_1 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const erc20_2 = TestERC20.withAddress(createAddress('0x77b55').toString())
		const owner = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const spender = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

		// Deploy both contracts
		await setAccountHandler(client)({
			address: erc20_1.address,
			deployedBytecode: erc20_1.deployedBytecode,
		})
		await setAccountHandler(client)({
			address: erc20_2.address,
			deployedBytecode: erc20_2.deployedBytecode,
		})

		const handler = setErc20AllowanceHandler(client)

		// Set different allowances for each token
		await handler({
			erc20: erc20_1.address,
			owner: owner,
			spender: spender,
			amount: 1000000n,
		})
		await handler({
			erc20: erc20_2.address,
			owner: owner,
			spender: spender,
			amount: 2000000n,
		})

		// Verify each token has its own allowance
		const allowance1Result = await contractHandler(client)({
			to: erc20_1.address,
			abi: TestERC20.abi,
			functionName: 'allowance',
			args: [owner, spender],
		})
		expect(allowance1Result.data).toBe(1000000n)

		const allowance2Result = await contractHandler(client)({
			to: erc20_2.address,
			abi: TestERC20.abi,
			functionName: 'allowance',
			args: [owner, spender],
		})
		expect(allowance2Result.data).toBe(2000000n)
	})

	it('should return error when contract does not exist', async () => {
		const client = createTevmNode()
		const nonExistentContract = '0x1234567890123456789012345678901234567890'
		const owner = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const spender = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

		const handler = setErc20AllowanceHandler(client)
		const result = await handler({
			erc20: nonExistentContract,
			owner: owner,
			spender: spender,
			amount: 1000000n,
		})

		expect(result).toHaveProperty('errors')
		expect(result.errors).toBeDefined()
	})

	it('should handle setting allowance multiple times in sequence', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const owner = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const spender = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		const handler = setErc20AllowanceHandler(client)

		// Set allowance multiple times
		for (let i = 1; i <= 5; i++) {
			await handler({
				erc20: erc20.address,
				owner: owner,
				spender: spender,
				amount: BigInt(i * 1000000),
			})

			// Verify the allowance after each set
			const allowanceResult = await contractHandler(client)({
				to: erc20.address,
				abi: TestERC20.abi,
				functionName: 'allowance',
				args: [owner, spender],
			})
			expect(allowanceResult.data).toBe(BigInt(i * 1000000))
		}
	})

	it('should properly manipulate storage without affecting balances', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const owner = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const spender = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		const handler = setErc20AllowanceHandler(client)

		// Get initial balance (should be 0)
		const initialBalanceResult = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'balanceOf',
			args: [owner],
		})
		const initialBalance = initialBalanceResult.data

		// Set allowance
		await handler({
			erc20: erc20.address,
			owner: owner,
			spender: spender,
			amount: 1000000n,
		})

		// Verify balance unchanged
		const finalBalanceResult = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'balanceOf',
			args: [owner],
		})
		expect(finalBalanceResult.data).toBe(initialBalance)

		// Verify allowance was set
		const allowanceResult = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'allowance',
			args: [owner, spender],
		})
		expect(allowanceResult.data).toBe(1000000n)
	})

	it('should handle setting max uint256 allowance (infinite approval)', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const owner = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const spender = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

		// Deploy contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		const handler = setErc20AllowanceHandler(client)

		// Set max allowance (common pattern for infinite approval)
		const maxUint256 = 2n ** 256n - 1n
		await handler({
			erc20: erc20.address,
			owner: owner,
			spender: spender,
			amount: maxUint256,
		})

		// Verify the allowance
		const allowanceResult = await contractHandler(client)({
			to: erc20.address,
			abi: TestERC20.abi,
			functionName: 'allowance',
			args: [owner, spender],
		})

		expect(allowanceResult.data).toBe(maxUint256)
	})
})
