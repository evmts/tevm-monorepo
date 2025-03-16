import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { TestERC20 } from '@tevm/test-utils'
import { describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { getAccountHandler } from '../GetAccount/getAccountHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { dealHandler } from './anvilDealHandler.js'

describe('anvilDealHandler', () => {
	it('should deal ETH when no erc20 address is provided', async () => {
		const client = createTevmNode()
		const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const amount = 1000000000000000000n // 1 ETH

		await dealHandler(client)({
			account,
			amount,
		})

		const accountState = await getAccountHandler(client)({
			address: account,
		})

		expect(accountState.balance).toEqual(amount)
	})

	it('should deal ERC20 tokens by finding and updating the correct storage slot', async () => {
		const client = createTevmNode()
		const erc20 = TestERC20.withAddress(createAddress('0x66a44').toString())
		const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const amount = 1000000n // 1 token with 6 decimals

		// Deploy the token contract
		await setAccountHandler(client)({
			address: erc20.address,
			deployedBytecode: erc20.deployedBytecode,
		})

		// Deal tokens to the account
		await dealHandler(client)({
			erc20: erc20.address,
			account,
			amount,
		})

		// Verify the balance was updated
		const balanceResponse = await contractHandler(client)({
			to: erc20.address,
			abi: erc20.abi,
			functionName: 'balanceOf',
			args: [account],
		})

		expect(balanceResponse.data).toEqual(amount)
	})

	it('should return an error if no valid storage slot is found', async () => {
		// For this test, we'll use a contract that doesn't follow the ERC20 standard
		const client = createTevmNode()
		const invalidErc20 = '0x1111111111111111111111111111111111111111'
		const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
		const amount = 1000000n

		// Deploy a non-ERC20 contract at the address
		await setAccountHandler(client)({
			address: invalidErc20,
			deployedBytecode:
				'0x60806040526000600355600060045534801561001a57600080fd5b5060e3806100296000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063f8a8fd6d14602d575b600080fd5b60336035565b005b60006003819055507f41304facd9323d75b11bcdd609cb38effffdb05b7f6142bb8e479b11031fc7566000604051605b91906076565b60405180910390a1565b600060ff82169050919050565b6070816069565b82525050565b6000602082019050608960008301846069565b9291505056fea2646970667358221220b7406af0ea2681488a3183ac9f92ffe2de14da89dc76ddb582e9edd5c261d34664736f6c63430008150033',
		})

		// Try to deal tokens (should fail)
		const result = await dealHandler(client)({
			erc20: invalidErc20,
			account,
			amount,
		})

		expect(result.errors).toBeDefined()
		expect(result.errors?.[0]?.name).toEqual('StorageSlotNotFound')
	})
})
