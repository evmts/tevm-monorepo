import {
	callHandler,
	contractHandler,
	deployHandler,
	ethGetTransactionReceiptHandler,
	setAccountHandler,
} from '@tevm/actions'
import { createMemoryClient } from '@tevm/memory-client'
import { createTevmNode } from '@tevm/node'
import { ErrorContract, SimpleContract } from '@tevm/test-utils'
import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import type { Address } from 'viem'
import { parseEther } from 'viem'
import { assert, beforeEach, describe, expect, it } from 'vitest'

const node = createTevmNode()
const sender = PREFUNDED_ACCOUNTS[1]
const recipient = PREFUNDED_ACCOUNTS[2]
const amount = parseEther('1')

describe('toChangeBalance', () => {
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

	describe('with a transaction that changes balance', () => {
		it('should work with an eip1193 client', async () => {
			const client = createMemoryClient()
			const res = await client.tevmCall({
				from: sender.address,
				to: recipient.address,
				value: amount,
				addToBlockchain: true,
			})

			// handler will create a node in fork mode
			await expect(res).toChangeBalance(client, sender, amount + gasCost)
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
			).toChangeBalance(node, sender, -(amountSpent ?? 0n))
		})

		it('should work with a promise that resolves to a call result', async () => {
			await expect(
				callHandler(node)({
					from: sender.address,
					to: recipient.address,
					value: amount,
					addToBlockchain: true,
				}),
			).toChangeBalance(node, sender, -(amount + gasCost))
		})

		it('should work with a promise that resolves to a tx hash', async () => {
			await expect(
				callHandler(node)({
					from: sender.address,
					to: recipient.address,
					value: amount,
					addToBlockchain: true,
				}).then((res) => res.txHash),
			).toChangeBalance(node, sender, -(amount + gasCost))
		})

		it('should work with a promise that resolves to a tx receipt', async () => {
			await expect(
				callHandler(node)({
					from: sender.address,
					to: recipient.address,
					value: amount,
					addToBlockchain: true,
				}).then((res) => (res.txHash ? ethGetTransactionReceiptHandler(node)({ hash: res.txHash }) : undefined)),
			).toChangeBalance(node, sender, -(amount + gasCost))
		})

		it('should work with a resolved call result', async () => {
			const res = await callHandler(node)({
				from: sender.address,
				to: recipient.address,
				value: amount,
				addToBlockchain: true,
			})

			await expect(res).toChangeBalance(node, sender, -(amount + gasCost))
			await expect(res).toChangeBalance(node, recipient, amount)
		})

		it('should work with a resolved tx hash', async () => {
			const { txHash } = await callHandler(node)({
				from: sender.address,
				to: recipient.address,
				value: amount,
				addToBlockchain: true,
			})
			await expect(txHash).toChangeBalance(node, sender, -(amount + gasCost))
			await expect(txHash).toChangeBalance(node, recipient, amount)
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

			await expect(txReceipt).toChangeBalance(node, sender, -(amount + gasCost))
			await expect(txReceipt).toChangeBalance(node, recipient, amount)
		})
	})

	describe('with different parameter types', () => {
		it('should work with account address', async () => {
			await expect(
				callHandler(node)({
					from: sender.address,
					to: recipient.address,
					value: amount,
					addToBlockchain: true,
				}),
			).toChangeBalance(node, recipient.address, amount)
		})

		it('should work with string expected change', async () => {
			await expect(
				callHandler(node)({
					from: sender.address,
					to: recipient.address,
					value: amount,
					addToBlockchain: true,
				}),
			).toChangeBalance(node, sender.address, (-(amount + gasCost)).toString())
		})

		it('should work with number expected change', async () => {
			const smallAmount = 1000

			await expect(
				callHandler(node)({
					from: sender.address,
					to: recipient.address,
					value: BigInt(smallAmount),
					addToBlockchain: true,
				}),
			).toChangeBalance(node, recipient.address, smallAmount)
		})

		it('should work with zero balance change for unrelated account', async () => {
			const unrelatedAccount = PREFUNDED_ACCOUNTS[3]

			await expect(
				callHandler(node)({
					from: sender.address,
					to: recipient.address,
					value: amount,
					addToBlockchain: true,
				}),
			).toChangeBalance(node, unrelatedAccount.address, 0n)
		})
	})

	describe('with a transaction that fails', () => {
		it('should fail when expected balance change is incorrect', async () => {
			await expect(() =>
				expect(
					callHandler(node)({
						from: sender.address,
						to: recipient.address,
						value: amount,
						addToBlockchain: true,
					}),
				).toChangeBalance(node, recipient.address, amount + 1n),
			).rejects.toThrowError(`Expected account ${recipient.address} to change balance by ${(amount + 1n).toString()}`)
		})

		it('should fail when direction of change is wrong', async () => {
			await expect(() =>
				expect(
					callHandler(node)({
						from: sender.address,
						to: recipient.address,
						value: amount,
						addToBlockchain: true,
					}),
				).toChangeBalance(node, recipient.address, -amount),
			).rejects.toThrowError(`Expected account ${recipient.address} to change balance by ${(-amount).toString()}`)
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
				).toChangeBalance(node, '0xinvalid' as Address, amount),
			).rejects.toThrowError('Invalid address: 0xinvalid')
		})

		it('should fail if the object does neither resolve to a tx hash nor a tx receipt', async () => {
			await expect(() => expect({}).toChangeBalance(node, recipient.address, amount)).rejects.toThrowError(
				'Transaction hash is undefined, you need to pass a transaction hash, receipt or call result, or a promise that resolves to one of those',
			)
		})
	})

	describe('with a negative assertion .not.toChangeBalance', () => {
		it('should pass when balance change is different than expected', async () => {
			await expect(
				callHandler(node)({
					from: sender.address,
					to: recipient.address,
					value: amount,
					addToBlockchain: true,
				}),
			).not.toChangeBalance(node, recipient.address, amount + 1n)
		})

		it('should fail when balance change matches expected (with .not)', async () => {
			await expect(() =>
				expect(
					callHandler(node)({
						from: sender.address,
						to: recipient.address,
						value: amount,
						addToBlockchain: true,
					}),
				).not.toChangeBalance(node, recipient.address, amount),
			).rejects.toThrowError(`Expected account ${recipient.address} not to change balance by ${amount.toString()}`)
		})

		it('should pass for unrelated accounts with .not', async () => {
			const unrelatedAccount = PREFUNDED_ACCOUNTS[3]
			await expect(
				callHandler(node)({
					from: sender.address,
					to: recipient.address,
					value: amount,
					addToBlockchain: true,
				}),
			).not.toChangeBalance(node, unrelatedAccount.address, amount)
		})
	})

	describe('should provide helpful error messages', () => {
		it('with the original error bubbled up from the tx promise', async () => {
			const caller = PREFUNDED_ACCOUNTS[4]
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
				).toChangeBalance(node, recipient.address, amount),
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
				).toChangeBalance(node, errorContract.address, 0n),
			).rejects.toThrow(
				'The contract function "revertWithRequireAndMessage" reverted with the following reason:\nRequire failed with message',
			)
		})

		it('with a toChangeBalance assertion that fails', async () => {
			try {
				await expect(
					callHandler(node)({
						from: sender.address,
						to: recipient.address,
						value: amount,
						addToBlockchain: true,
					}),
				).toChangeBalance(node, recipient.address, amount + 1n)
			} catch (error: any) {
				expect(error.message).toBe(
					`Expected account ${recipient.address} to change balance by ${(amount + 1n).toString()}`,
				)
				expect(error.actual).toBe(amount)
				expect(error.expected).toBe(amount + 1n)
			}
		})
	})
})
