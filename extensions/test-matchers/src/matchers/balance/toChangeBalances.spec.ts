import {
	callHandler,
	contractHandler,
	deployHandler,
	ethGetTransactionReceiptHandler,
	setAccountHandler,
} from '@tevm/actions'
import { ErrorContract, SimpleContract } from '@tevm/contract'
import { createMemoryClient } from '@tevm/memory-client'
import { createTevmNode } from '@tevm/node'
import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import type { Address } from 'viem'
import { parseEther } from 'viem'
import { assert, beforeEach, describe, expect, it } from 'vitest'

const node = createTevmNode()
const sender = PREFUNDED_ACCOUNTS[1]
const recipient = PREFUNDED_ACCOUNTS[2]
const thirdParty = PREFUNDED_ACCOUNTS[3]
const amount = parseEther('1')

describe('toChangeBalances', () => {
	let gasCost: bigint

	beforeEach(async () => {
		const res = await callHandler(node)({
			from: sender.address,
			to: recipient.address,
			value: amount,
		})
		if (!res.amountSpent) throw new Error('res.amountSpent is undefined')
		gasCost = res.amountSpent
	})

	describe('with transactions that change balances', () => {
		it('should work with an eip1193 client', async () => {
			const client = createMemoryClient()
			const res = await client.tevmCall({
				from: sender.address,
				to: recipient.address,
				value: amount,
				addToBlockchain: true,
			})

			// handler will create a node in fork mode
			await expect(res).toChangeBalances(client, [
				{ account: sender, amount: -(amount + gasCost) },
				{ account: recipient, amount },
			])
		})

		it('should work with a contract call', async () => {
			const { createdAddress: simpleContractAddress } = await deployHandler(node)({
				...SimpleContract.deploy(1n),
				addToBlockchain: true,
			})
			assert(simpleContractAddress, 'simpleContractAddress is undefined')
			const simpleContract = SimpleContract.withAddress(simpleContractAddress)

			const { amountSpent } = await contractHandler(node)({
				...simpleContract.write.set(42n),
				from: sender.address,
			})

			await expect(
				contractHandler(node)({
					...simpleContract.write.set(42n),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toChangeBalances(node, [{ account: sender, amount: -(amountSpent ?? 0n) }])
		})

		it('should work with a promise that resolves to a call result', async () => {
			await expect(
				callHandler(node)({
					from: sender.address,
					to: recipient.address,
					value: amount,
					addToBlockchain: true,
				}),
			).toChangeBalances(node, [
				{ account: sender, amount: -(amount + gasCost) },
				{ account: recipient, amount },
			])
		})

		it('should work with a promise that resolves to a tx hash', async () => {
			await expect(
				callHandler(node)({
					from: sender.address,
					to: recipient.address,
					value: amount,
					addToBlockchain: true,
				}).then((res) => res.txHash),
			).toChangeBalances(node, [
				{ account: sender, amount: -(amount + gasCost) },
				{ account: recipient, amount },
			])
		})

		it('should work with a promise that resolves to a tx receipt', async () => {
			await expect(
				callHandler(node)({
					from: sender.address,
					to: recipient.address,
					value: amount,
					addToBlockchain: true,
				}).then((res) => (res.txHash ? ethGetTransactionReceiptHandler(node)({ hash: res.txHash }) : undefined)),
			).toChangeBalances(node, [
				{ account: sender, amount: -(amount + gasCost) },
				{ account: recipient, amount },
			])
		})

		it('should work with a resolved call result', async () => {
			const res = await callHandler(node)({
				from: sender.address,
				to: recipient.address,
				value: amount,
				addToBlockchain: true,
			})

			await expect(res).toChangeBalances(node, [
				{ account: sender, amount: -(amount + gasCost) },
				{ account: recipient, amount },
			])
		})

		it('should work with a resolved tx hash', async () => {
			const { txHash } = await callHandler(node)({
				from: sender.address,
				to: recipient.address,
				value: amount,
				addToBlockchain: true,
			})
			await expect(txHash).toChangeBalances(node, [
				{ account: sender, amount: -(amount + gasCost) },
				{ account: recipient, amount },
			])
		})

		it('should work with a resolved tx receipt', async () => {
			const { txHash } = await callHandler(node)({
				from: sender.address,
				to: recipient.address,
				value: amount,
				addToBlockchain: true,
			})
			if (!txHash) throw new Error('txHash is undefined')
			const txReceipt = await ethGetTransactionReceiptHandler(node)({ hash: txHash })

			await expect(txReceipt).toChangeBalances(node, [
				{ account: sender, amount: -(amount + gasCost) },
				{ account: recipient, amount },
			])
		})
	})

	describe('with different parameter types', () => {
		it('should work with account address strings', async () => {
			await expect(
				callHandler(node)({
					from: sender.address,
					to: recipient.address,
					value: amount,
					addToBlockchain: true,
				}),
			).toChangeBalances(node, [
				{ account: sender, amount: -(amount + gasCost) },
				{ account: recipient, amount },
			])
		})

		it('should work with string expected changes', async () => {
			await expect(
				callHandler(node)({
					from: sender.address,
					to: recipient.address,
					value: amount,
					addToBlockchain: true,
				}),
			).toChangeBalances(node, [
				{ account: sender, amount: (-(amount + gasCost)).toString() },
				{ account: recipient, amount: amount.toString() },
			])
		})

		it('should work with number expected changes', async () => {
			const smallAmount = 1000

			await expect(
				callHandler(node)({
					from: sender.address,
					to: recipient.address,
					value: BigInt(smallAmount),
					addToBlockchain: true,
				}),
			).toChangeBalances(node, [{ account: recipient, amount: smallAmount }])
		})

		it('should work with zero balance change for unrelated account', async () => {
			const unrelatedAccount = PREFUNDED_ACCOUNTS[4]

			await expect(
				callHandler(node)({
					from: sender.address,
					to: recipient.address,
					value: amount,
					addToBlockchain: true,
				}),
			).toChangeBalances(node, [{ account: unrelatedAccount, amount: 0n }])
		})

		it('should work with mixed account types', async () => {
			await expect(
				callHandler(node)({
					from: sender.address,
					to: recipient.address,
					value: amount,
					addToBlockchain: true,
				}),
			).toChangeBalances(node, [
				{ account: sender, amount: -(amount + gasCost) }, // ContainsAddress object
				{ account: recipient, amount }, // Address string
				{ account: thirdParty, amount: 0n }, // Another address string
			])
		})

		it('should work with mixed amount types', async () => {
			await expect(
				callHandler(node)({
					from: sender.address,
					to: recipient.address,
					value: amount,
					addToBlockchain: true,
				}),
			).toChangeBalances(node, [
				{ account: sender, amount: -(amount + gasCost) },
				{ account: recipient, amount: amount.toString() },
				{ account: thirdParty, amount: 0 },
			])
		})
	})

	describe('with transactions that fail - balance changes incorrect', () => {
		it('should fail when all expected balance changes are incorrect', async () => {
			await expect(() =>
				expect(
					callHandler(node)({
						from: sender.address,
						to: recipient.address,
						value: amount,
						addToBlockchain: true,
					}),
				).toChangeBalances(node, [
					{ account: sender, amount: -(amount + 1n) }, // Wrong
					{ account: recipient, amount: amount + 1n }, // Wrong
				]),
			).rejects.toThrowError(
				'Expected transaction to change balances by the specified amounts, but none of them passed',
			)
		})

		it('should fail when only some expected balance changes are incorrect', async () => {
			await expect(() =>
				expect(
					callHandler(node)({
						from: sender.address,
						to: recipient.address,
						value: amount,
						addToBlockchain: true,
					}),
				).toChangeBalances(node, [
					{ account: sender, amount: -(amount + gasCost) }, // Correct
					{ account: recipient, amount: amount + 1n }, // Wrong
					{ account: thirdParty, amount: 1n }, // Wrong (should be 0)
				]),
			).rejects.toThrowError(
				"Expected transaction to change balances by the specified amounts, but some of them didn't pass (at indexes [1, 2])",
			)
		})

		it('should fail with invalid address', async () => {
			await expect(() =>
				expect(
					callHandler(node)({
						from: sender.address,
						to: recipient.address,
						value: amount,
						addToBlockchain: true,
					}),
				).toChangeBalances(node, [{ account: '0xinvalid' as Address, amount: amount }]),
			).rejects.toThrowError('Invalid address: 0xinvalid')
		})

		it('should fail if the object does neither resolve to a tx hash nor a tx receipt', async () => {
			await expect(() => expect({}).toChangeBalances(node, [{ account: recipient, amount }])).rejects.toThrowError(
				'Transaction hash is undefined, you need to pass a transaction hash, receipt or call result, or a promise that resolves to one of those',
			)
		})
	})

	describe('with a negative assertion .not.toChangeBalances', () => {
		describe('when balance changes are different than expected', () => {
			it('should pass when all balance changes are different than expected', async () => {
				await expect(
					callHandler(node)({
						from: sender.address,
						to: recipient.address,
						value: amount,
						addToBlockchain: true,
					}),
				).not.toChangeBalances(node, [
					{ account: sender, amount: -(amount + 1n) }, // Different
					{ account: recipient, amount: amount + 1n }, // Different
				])
			})

			it('should pass when only some balance changes are different than expected', async () => {
				await expect(
					callHandler(node)({
						from: sender.address,
						to: recipient.address,
						value: amount,
						addToBlockchain: true,
					}),
				).not.toChangeBalances(node, [
					{ account: sender, amount: -(amount + gasCost) }, // Correct
					{ account: recipient, amount: amount + 1n }, // Different
				])
			})
		})

		describe('when balance changes match expected', () => {
			it('should fail when all balance changes match expected', async () => {
				await expect(() =>
					expect(
						callHandler(node)({
							from: sender.address,
							to: recipient.address,
							value: amount,
							addToBlockchain: true,
						}),
					).not.toChangeBalances(node, [
						{ account: sender, amount: -(amount + gasCost) },
						{ account: recipient, amount },
					]),
				).rejects.toThrowError(
					'Expected transaction not to change balances by the specified amounts, but all of them passed',
				)
			})
		})

		it('should pass for unrelated accounts with .not', async () => {
			const unrelatedAccount = PREFUNDED_ACCOUNTS[4]
			await expect(
				callHandler(node)({
					from: sender.address,
					to: recipient.address,
					value: amount,
					addToBlockchain: true,
				}),
			).not.toChangeBalances(node, [{ account: unrelatedAccount, amount }])
		})
	})

	describe('should provide helpful error messages', () => {
		it('with the original error bubbled up from the tx promise', async () => {
			const caller = PREFUNDED_ACCOUNTS[5]
			await setAccountHandler(node)({
				address: caller.address,
				balance: 0n,
			})

			await expect(() =>
				expect(
					callHandler(node)({
						from: caller.address,
						to: recipient.address,
						value: amount,
						addToBlockchain: true,
					}),
				).toChangeBalances(node, [
					{ account: caller, amount: -(amount + gasCost) },
					{ account: recipient, amount },
				]),
			).rejects.toThrowError('Insufficientbalance')
		})

		it('with a contract call that reverts', async () => {
			const { createdAddress: errorContractAddress } = await deployHandler(node)({
				...ErrorContract.deploy(),
				addToBlockchain: true,
			})
			assert(errorContractAddress, 'errorContractAddress is undefined')
			const errorContract = ErrorContract.withAddress(errorContractAddress)

			await expect(() =>
				expect(
					contractHandler(node)({
						...errorContract.write.revertWithRequireAndMessage(),
						addToBlockchain: true,
					}),
				).toChangeBalances(node, [{ account: errorContract.address, amount: 0n }]),
			).rejects.toThrow('The contract function "revertWithRequireAndMessage" reverted with the following reason:')
		})

		it('with a toChangeBalances assertion that fails - all fail', async () => {
			try {
				await expect(
					callHandler(node)({
						from: sender.address,
						to: recipient.address,
						value: amount,
						addToBlockchain: true,
					}),
				).toChangeBalances(node, [
					{ account: sender, amount: -(amount + 1n) },
					{ account: recipient, amount: amount + 1n },
				])
			} catch (error: any) {
				expect(error.message).toBe(
					'Expected transaction to change balances by the specified amounts, but none of them passed',
				)

				expect(error.actual).toMatchObject([
					{
						account: sender,
						amount: -(amount + gasCost),
					},
					{
						account: recipient,
						amount: amount,
					},
				])
				expect(error.expected).toMatchObject([
					{
						account: sender,
						amount: -(amount + 1n),
					},
					{
						account: recipient,
						amount: amount + 1n,
					},
				])
			}
		})

		it('with a toChangeBalances assertion that fails - some fail', async () => {
			try {
				await expect(
					callHandler(node)({
						from: sender.address,
						to: recipient.address,
						value: amount,
						addToBlockchain: true,
					}),
				).toChangeBalances(node, [
					{ account: sender, amount: -(amount + gasCost) }, // Correct
					{ account: recipient, amount: amount + 1n }, // Wrong
					{ account: thirdParty, amount: 1n }, // Wrong
				])
			} catch (error: any) {
				expect(error.message).toContain("but some of them didn't pass (at indexes [1, 2])")
				expect(error.actual).toMatchObject([
					{
						account: sender,
						amount: -(amount + gasCost),
					},
					{
						account: recipient,
						amount: amount,
					},
					{
						account: thirdParty,
						amount: 0n,
					},
				])
				expect(error.expected).toMatchObject([
					{
						account: sender,
						amount: -(amount + gasCost),
					},
					{
						account: recipient,
						amount: amount + 1n,
					},
					{
						account: thirdParty,
						amount: 1n,
					},
				])
			}
		})
	})
})
