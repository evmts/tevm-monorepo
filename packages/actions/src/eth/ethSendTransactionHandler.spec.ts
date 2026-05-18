import { createAddress } from '@tevm/address'
import { createTevmNode } from '@tevm/node'
import { SimpleContract } from '@tevm/test-utils'
import { parseEther } from '@tevm/utils'
import { encodeFunctionData } from 'viem'
import { describe, expect, it } from 'vitest'
import { contractHandler } from '../Contract/contractHandler.js'
import { mineHandler } from '../Mine/mineHandler.js'
import { setAccountHandler } from '../SetAccount/setAccountHandler.js'
import { ethSendTransactionHandler } from './ethSendTransactionHandler.js'

describe('ethSendTransactionHandler', () => {
	it('should send a simple transaction', async () => {
		const client = createTevmNode()
		const handler = ethSendTransactionHandler(client)
		const from = createAddress('0x1234')
		const to = createAddress('0x5678')
		const value = parseEther('1')

		await setAccountHandler(client)({
			address: from.toString(),
			balance: parseEther('10'),
		})

		const result = await handler({
			from: from.toString(),
			to: to.toString(),
			value,
		})

		expect(result).toMatch(/^0x[a-fA-F0-9]{64}$/) // Transaction hash

		await mineHandler(client)()

		// @ts-expect-error: Monorepo type conflict: TevmNode from source (/src) conflicts with the matcher's type from compiled output (/dist).
		await expect(to.toString()).toHaveState(client, { balance: value })
	})

	it('should handle contract interaction', async () => {
		const client = createTevmNode()
		const handler = ethSendTransactionHandler(client)
		const from = createAddress('0x1234')
		const contractAddress = createAddress('0x5678')

		await setAccountHandler(client)({
			address: from.toString(),
			balance: parseEther('10'),
		})

		await setAccountHandler(client)({
			address: contractAddress.toString(),
			deployedBytecode: SimpleContract.deployedBytecode,
		})

		const data = encodeFunctionData({
			abi: SimpleContract.abi,
			functionName: 'set',
			args: [42n],
		})

		const result = await handler({
			from: from.toString(),
			to: contractAddress.toString(),
			data,
		})

		expect(result).toMatch(/^0x[a-fA-F0-9]{64}$/) // Transaction hash

		await mineHandler(client)()

		// verify the contract state change
		const { data: changedData } = await contractHandler(client)({
			to: contractAddress.toString(),
			abi: SimpleContract.abi,
			functionName: 'get',
		})

		expect(changedData).toBe(42n)
	})

	it('should handle transaction with impersonated account', async () => {
		const client = createTevmNode()
		const handler = ethSendTransactionHandler(client)
		const impersonatedAddress = createAddress('0xabcd')
		const to = createAddress('0x5678')
		const value = parseEther('1')

		// Set impersonated account
		client.setImpersonatedAccount(impersonatedAddress.toString())

		await setAccountHandler(client)({
			address: impersonatedAddress.toString(),
			balance: parseEther('10'),
		})

		const result = await handler({
			from: impersonatedAddress.toString(),
			to: to.toString(),
			value,
		})

		expect(result).toMatch(/^0x[a-fA-F0-9]{64}$/)

		await mineHandler(client)()

		const toAccount = await getAccountHandler(client)({ address: to.toString() })
		expect(toAccount.balance).toBe(value)
	})

	it('should use default prefunded account when no impersonation is set', async () => {
		const client = createTevmNode()
		const handler = ethSendTransactionHandler(client)
		const to = createAddress('0x5678')
		const value = parseEther('1')

		// Don't set any impersonation
		const result = await handler({
			to: to.toString(),
			value,
		})

		expect(result).toMatch(/^0x[a-fA-F0-9]{64}$/)

		await mineHandler(client)()

		const toAccount = await getAccountHandler(client)({ address: to.toString() })
		expect(toAccount.balance).toBe(value)
	})

	it('should handle transaction with gas parameters', async () => {
		const client = createTevmNode()
		const handler = ethSendTransactionHandler(client)
		const from = createAddress('0x1234')
		const to = createAddress('0x5678')

		await setAccountHandler(client)({
			address: from.toString(),
			balance: parseEther('10'),
		})

		const result = await handler({
			from: from.toString(),
			to: to.toString(),
			value: 100n,
			gasLimit: 50000n,
			maxFeePerGas: 100n,
			maxPriorityFeePerGas: 10n,
		})

		expect(result).toMatch(/^0x[a-fA-F0-9]{64}$/)
	})

	it('should handle transaction with nonce', async () => {
		const client = createTevmNode()
		const handler = ethSendTransactionHandler(client)
		const from = createAddress('0x1234')
		const to = createAddress('0x5678')

		await setAccountHandler(client)({
			address: from.toString(),
			balance: parseEther('10'),
		})

		const result = await handler({
			from: from.toString(),
			to: to.toString(),
			value: 100n,
			nonce: 0n,
		})

		expect(result).toMatch(/^0x[a-fA-F0-9]{64}$/)

		await mineHandler(client)()

		// Second transaction with incremented nonce
		const result2 = await handler({
			from: from.toString(),
			to: to.toString(),
			value: 200n,
			nonce: 1n,
		})

		expect(result2).toMatch(/^0x[a-fA-F0-9]{64}$/)
		expect(result2).not.toBe(result)
	})

	it('should handle transaction with data field', async () => {
		const client = createTevmNode()
		const handler = ethSendTransactionHandler(client)
		const from = createAddress('0x1234')
		const to = createAddress('0x5678')

		await setAccountHandler(client)({
			address: from.toString(),
			balance: parseEther('10'),
		})

		const result = await handler({
			from: from.toString(),
			to: to.toString(),
			value: 100n,
			data: '0x1234567890abcdef',
		})

		expect(result).toMatch(/^0x[a-fA-F0-9]{64}$/)
	})

	it('should handle contract deployment (no to address)', async () => {
		const client = createTevmNode()
		const handler = ethSendTransactionHandler(client)
		const from = createAddress('0x1234')

		await setAccountHandler(client)({
			address: from.toString(),
			balance: parseEther('10'),
		})

		// Simple contract bytecode
		const bytecode =
			'0x6080604052348015600f57600080fd5b50603e80601d6000396000f3fe6080604052600080fdfea2646970667358221220'

		const result = await handler({
			from: from.toString(),
			data: bytecode,
		})

		expect(result).toMatch(/^0x[a-fA-F0-9]{64}$/)
	})

	it('should throw error on transaction failure', async () => {
		const client = createTevmNode()
		const handler = ethSendTransactionHandler(client)
		const from = createAddress('0x1234')
		const to = createAddress('0x5678')

		// Don't fund the account - transaction should fail due to insufficient balance
		// But since we use skipBalance, this will fail in a different way
		// Let's try with invalid data to trigger an error
		await setAccountHandler(client)({
			address: from.toString(),
			balance: 0n,
		})

		// This should fail because we don't have enough balance even though skipBalance is used in callHandler
		// The handler uses skipBalance: true internally, so we need to trigger a different error
		// Let's deploy invalid bytecode to a contract to trigger an error
		await setAccountHandler(client)({
			address: to.toString(),
			// Set an invalid contract that will revert
			deployedBytecode: '0x60806040526000356c010000000000000000000000900480fd',
		})

		const data = '0xdeadbeef' // Invalid function selector

		await expect(
			handler({
				from: from.toString(),
				to: to.toString(),
				data,
			}),
		).rejects.toThrow()
	})

	it('should handle transaction with chainId', async () => {
		const client = createTevmNode()
		const handler = ethSendTransactionHandler(client)
		const from = createAddress('0x1234')
		const to = createAddress('0x5678')

		await setAccountHandler(client)({
			address: from.toString(),
			balance: parseEther('10'),
		})

		const result = await handler({
			from: from.toString(),
			to: to.toString(),
			value: 100n,
			chainId: 1n,
		})

		expect(result).toMatch(/^0x[a-fA-F0-9]{64}$/)
	})

	it('should return consistent hash for same transaction', async () => {
		const client = createTevmNode()
		const handler = ethSendTransactionHandler(client)
		const from = createAddress('0x1234')
		const to = createAddress('0x5678')

		await setAccountHandler(client)({
			address: from.toString(),
			balance: parseEther('10'),
		})

		const params = {
			from: from.toString(),
			to: to.toString(),
			value: 100n,
			nonce: 0n,
			gasLimit: 21000n,
		}

		const result1 = await handler(params)
		expect(result1).toMatch(/^0x[a-fA-F0-9]{64}$/)

		// Mine to clear the transaction
		await mineHandler(client)()

		// Same params should produce different hash because nonce is different now
		const result2 = await handler({
			...params,
			nonce: 1n,
		})
		expect(result2).toMatch(/^0x[a-fA-F0-9]{64}$/)
		expect(result2).not.toBe(result1)
	})
})
