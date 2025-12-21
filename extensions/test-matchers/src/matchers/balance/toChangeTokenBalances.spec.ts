import { contractHandler, dealHandler, deployHandler, ethGetTransactionReceiptHandler } from '@tevm/actions'
import { ERC20 } from '@tevm/contract'
import { createTevmNode, type TevmNode } from '@tevm/node'
import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import type { Address } from 'viem'
import { parseEther } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'

const sender = PREFUNDED_ACCOUNTS[1]
const recipient = PREFUNDED_ACCOUNTS[2]
const amount = parseEther('100') // 100 tokens

describe('toChangeTokenBalances', () => {
	let tokenContract: ReturnType<typeof ERC20.withAddress>
	let node: TevmNode

	beforeEach(async () => {
		// Create a fresh node for each test to avoid mining conflicts
		node = createTevmNode()

		// Deploy ERC20 token contract
		const { createdAddress } = await deployHandler(node)({
			...ERC20.deploy('TestToken', 'TST'),
			addToBlockchain: true,
		})
		if (!createdAddress) throw new Error('ERC20 contract address is undefined')
		tokenContract = ERC20.withAddress(createdAddress)

		// Use dealHandler to give sender tokens
		await dealHandler(node)({
			erc20: tokenContract.address,
			account: sender.address,
			amount: parseEther('1000'),
		})
	})

	describe('with transactions that change token balances', () => {
		it('should work with a contract call that affects all addresses', async () => {
			await expect(
				contractHandler(node)({
					...tokenContract.write.transfer(recipient.address, amount),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toChangeTokenBalances(node, tokenContract, [
				{ account: sender, amount: -amount },
				{ account: recipient, amount: amount },
			])
		})

		it('should work with a contract call that affects some addresses', async () => {
			const unrelatedAccount = PREFUNDED_ACCOUNTS[3]

			await expect(
				contractHandler(node)({
					...tokenContract.write.transfer(recipient.address, amount),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toChangeTokenBalances(node, tokenContract, [
				{ account: sender, amount: -amount },
				{ account: recipient, amount: amount },
				{ account: unrelatedAccount, amount: 0n },
			])
		})

		it('should work with promises that resolve to call results', async () => {
			await expect(
				contractHandler(node)({
					...tokenContract.write.transfer(recipient.address, amount),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toChangeTokenBalances(node, tokenContract, [
				{ account: sender, amount: -amount },
				{ account: recipient, amount: amount },
			])
		})

		it('should work with resolved tx hash', async () => {
			const { txHash } = await contractHandler(node)({
				...tokenContract.write.transfer(recipient.address, amount),
				from: sender.address,
				addToBlockchain: true,
			})
			await expect(txHash).toChangeTokenBalances(node, tokenContract, [
				{ account: sender, amount: -amount },
				{ account: recipient, amount: amount },
			])
		})

		it('should work with resolved tx receipt', async () => {
			const { txHash } = await contractHandler(node)({
				...tokenContract.write.transfer(recipient.address, amount),
				from: sender.address,
				addToBlockchain: true,
			})
			if (!txHash) throw new Error('txHash is undefined')
			const txReceipt = await ethGetTransactionReceiptHandler(node)({ hash: txHash })

			await expect(txReceipt).toChangeTokenBalances(node, tokenContract, [
				{ account: sender, amount: -amount },
				{ account: recipient, amount: amount },
			])
		})
	})

	describe('with different parameter types', () => {
		it('should work with token contract and account addresses', async () => {
			await expect(
				contractHandler(node)({
					...tokenContract.write.transfer(recipient.address, amount),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toChangeTokenBalances(node, tokenContract.address, [
				{ account: sender.address, amount: -amount },
				{ account: recipient.address, amount: amount },
			])
		})

		it('should work with string expected changes', async () => {
			await expect(
				contractHandler(node)({
					...tokenContract.write.transfer(recipient.address, amount),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toChangeTokenBalances(node, tokenContract, [
				{ account: sender, amount: (-amount).toString() },
				{ account: recipient, amount: amount.toString() },
			])
		})

		it('should work with number expected changes for small amounts', async () => {
			const smallAmount = 1000

			await expect(
				contractHandler(node)({
					...tokenContract.write.transfer(recipient.address, BigInt(smallAmount)),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toChangeTokenBalances(node, tokenContract, [
				{ account: sender, amount: -smallAmount },
				{ account: recipient, amount: smallAmount },
			])
		})
	})

	describe('with transactions that fail', () => {
		it('should fail when all expected token balance changes are incorrect', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...tokenContract.write.transfer(recipient.address, amount),
						from: sender.address,
						addToBlockchain: true,
					}),
				).toChangeTokenBalances(node, tokenContract, [
					{ account: sender, amount: -amount - 1n },
					{ account: recipient, amount: amount + 1n },
				]),
			).rejects.toThrowError(
				'Expected transaction to change token balances by the specified amounts, but none of them passed',
			)
		})

		it('should fail when some expected token balance changes are incorrect', async () => {
			const txPromise = contractHandler(node)({
				...tokenContract.write.transfer(recipient.address, amount),
				from: sender.address,
				addToBlockchain: true,
			})

			await expect(
				expect(txPromise).toChangeTokenBalances(node, tokenContract, [
					{ account: sender, amount: -amount }, // correct
					{ account: recipient, amount: amount + 1n }, // incorrect
				]),
			).rejects.toThrowError(
				"Expected transaction to change token balances by the specified amounts, but some of them didn't pass (at indexes [1])",
			)
		})

		it('should fail with invalid token address', async () => {
			const res = await contractHandler(node)({
				...tokenContract.write.transfer(recipient.address, amount),
				from: sender.address,
				addToBlockchain: true,
			})
			await expect(() =>
				expect(res).toChangeTokenBalances(node, '0xinvalid' as Address, [{ account: sender, amount: -amount }]),
			).rejects.toThrowError('Invalid token address: 0xinvalid')
		})

		it('should fail with invalid account address', async () => {
			const res = await contractHandler(node)({
				...tokenContract.write.transfer(recipient.address, amount),
				from: sender.address,
				addToBlockchain: true,
			})
			await expect(() =>
				expect(res).toChangeTokenBalances(node, tokenContract, [{ account: '0xinvalid' as Address, amount: -amount }]),
			).rejects.toThrowError('Invalid address: 0xinvalid')
		})

		it('should fail if the object does neither resolve to a tx hash nor a tx receipt', async () => {
			await expect(() =>
				expect({}).toChangeTokenBalances(node, tokenContract, [{ account: recipient, amount: amount }]),
			).rejects.toThrowError(
				'Transaction hash is undefined, you need to pass a transaction hash, receipt or call result, or a promise that resolves to one of those',
			)
		})
	})

	describe('with a negative assertion .not.toChangeTokenBalances', () => {
		it('should pass when token balance changes are different than expected', async () => {
			await expect(
				contractHandler(node)({
					...tokenContract.write.transfer(recipient.address, amount),
					from: sender.address,
					addToBlockchain: true,
				}),
			).not.toChangeTokenBalances(node, tokenContract, [
				{ account: sender, amount: -amount - 1n },
				{ account: recipient, amount: amount + 1n },
			])
		})

		it('should fail when token balance changes match expected (with .not)', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...tokenContract.write.transfer(recipient.address, amount),
						from: sender.address,
						addToBlockchain: true,
					}),
				).not.toChangeTokenBalances(node, tokenContract, [
					{ account: sender.address, amount: -amount },
					{ account: recipient.address, amount: amount },
				]),
			).rejects.toThrowError(
				'Expected transaction not to change token balances by the specified amounts, but all of them passed',
			)
		})

		it('should pass for mixed results with .not', async () => {
			await expect(
				contractHandler(node)({
					...tokenContract.write.transfer(recipient.address, amount),
					from: sender.address,
					addToBlockchain: true,
				}),
			).not.toChangeTokenBalances(node, tokenContract, [
				{ account: sender.address, amount: -amount }, // correct
				{ account: recipient.address, amount: amount + 1n }, // incorrect
			])
		})
	})

	describe('should provide helpful error messages', () => {
		it('with a toChangeTokenBalances assertion that fails', async () => {
			try {
				await expect(
					contractHandler(node)({
						...tokenContract.write.transfer(recipient.address, amount),
						from: sender.address,
						addToBlockchain: true,
					}),
				).toChangeTokenBalances(node, tokenContract, [
					{ account: sender.address, amount: -amount },
					{ account: recipient.address, amount: amount + 1n },
				])
			} catch (error: any) {
				expect(error.message).toContain(
					"Expected transaction to change token balances by the specified amounts, but some of them didn't pass (at indexes [1])",
				)
				expect(error.actual).toEqual([
					{ account: sender.address, amount: -amount },
					{ account: recipient.address, amount: amount },
				])
				expect(error.expected).toEqual([
					{ account: sender.address, amount: -amount },
					{ account: recipient.address, amount: amount + 1n },
				])
			}
		})
	})
})
