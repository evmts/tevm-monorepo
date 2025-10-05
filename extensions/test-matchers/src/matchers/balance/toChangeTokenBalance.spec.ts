import { contractHandler, dealHandler, deployHandler, ethGetTransactionReceiptHandler } from '@tevm/actions'
import { ERC20, ErrorContract } from '@tevm/contract'
import { createMemoryClient } from '@tevm/memory-client'
import { createTevmNode } from '@tevm/node'
import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import type { Address } from 'viem'
import { parseEther } from 'viem'
import { assert, beforeEach, describe, expect, it } from 'vitest'

const node = createTevmNode()
const sender = PREFUNDED_ACCOUNTS[1]
const recipient = PREFUNDED_ACCOUNTS[2]
const amount = parseEther('100') // 100 tokens

describe('toChangeTokenBalance', () => {
	let tokenAddress: Address
	let tokenContract: ReturnType<typeof ERC20.withAddress>

	beforeEach(async () => {
		// Deploy ERC20 token contract
		const { createdAddress } = await deployHandler(node)({
			...ERC20.deploy('TestToken', 'TST'),
			addToBlockchain: true,
		})
		assert(createdAddress, 'ERC20 contract address is undefined')
		tokenAddress = createdAddress
		tokenContract = ERC20.withAddress(tokenAddress)

		// Use dealHandler to give sender tokens
		await dealHandler(node)({
			erc20: tokenAddress,
			account: sender.address,
			amount: parseEther('1000'),
		})
	})

	describe('with transactions that change token balance', () => {
		// TODO: this will work once we implement eth_getProof
		it.skip('should work with an eip1193 client', async () => {
			const client = createMemoryClient()

			// Deploy token in client
			const { createdAddress: clientTokenAddress } = await client.tevmDeploy({
				...ERC20.deploy('ClientToken', 'CTK'),
				addToBlockchain: true,
			})
			assert(clientTokenAddress, 'Client token address is undefined')
			const clientToken = ERC20.withAddress(clientTokenAddress)

			// Deal tokens to sender in the client
			await client.tevmDeal({
				erc20: clientTokenAddress,
				account: sender.address,
				amount: amount,
			})

			// Transfer tokens
			const res = await client.tevmContract({
				...clientToken.write.transfer(recipient.address, amount),
				from: sender.address,
				addToBlockchain: true,
			})

			await expect(res).toChangeTokenBalance(client, clientTokenAddress, sender, -amount)
			await expect(res).toChangeTokenBalance(client, clientTokenAddress, recipient, amount)
		})

		it('should work with a contract call', async () => {
			await expect(
				contractHandler(node)({
					...tokenContract.write.transfer(recipient.address, amount),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toChangeTokenBalance(node, tokenAddress, recipient, amount)
		})

		it('should work with a promise that resolves to a call result', async () => {
			await expect(
				contractHandler(node)({
					...tokenContract.write.transfer(recipient.address, amount),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toChangeTokenBalance(node, tokenAddress, sender, -amount)
		})

		it('should work with a promise that resolves to a tx hash', async () => {
			await expect(
				contractHandler(node)({
					...tokenContract.write.transfer(recipient.address, amount),
					from: sender.address,
					addToBlockchain: true,
				}).then((res) => res.txHash),
			).toChangeTokenBalance(node, tokenAddress, sender, -amount)
		})

		it('should work with a promise that resolves to a tx receipt', async () => {
			await expect(
				contractHandler(node)({
					...tokenContract.write.transfer(recipient.address, amount),
					from: sender.address,
					addToBlockchain: true,
				}).then((res) => (res.txHash ? ethGetTransactionReceiptHandler(node)({ hash: res.txHash }) : undefined)),
			).toChangeTokenBalance(node, tokenAddress, sender, -amount)
		})

		it('should work with a resolved call result', async () => {
			const res = await contractHandler(node)({
				...tokenContract.write.transfer(recipient.address, amount),
				from: sender.address,
				addToBlockchain: true,
			})

			await expect(res).toChangeTokenBalance(node, tokenAddress, sender, -amount)
			await expect(res).toChangeTokenBalance(node, tokenAddress, recipient, amount)
		})

		it('should work with a resolved tx hash', async () => {
			const { txHash } = await contractHandler(node)({
				...tokenContract.write.transfer(recipient.address, amount),
				from: sender.address,
				addToBlockchain: true,
			})
			await expect(txHash).toChangeTokenBalance(node, tokenAddress, sender, -amount)
			await expect(txHash).toChangeTokenBalance(node, tokenAddress, recipient, amount)
		})

		it('should work with a resolved tx receipt', async () => {
			const { txHash } = await contractHandler(node)({
				...tokenContract.write.transfer(recipient.address, amount),
				from: sender.address,
				addToBlockchain: true,
			})
			if (!txHash) throw new Error('txHash is undefined')
			const txReceipt = await ethGetTransactionReceiptHandler(node)({ hash: txHash })

			await expect(txReceipt).toChangeTokenBalance(node, tokenAddress, sender, -amount)
			await expect(txReceipt).toChangeTokenBalance(node, tokenAddress, recipient, amount)
		})
	})

	describe('with different parameter types', () => {
		it('should work with account address strings', async () => {
			await expect(
				contractHandler(node)({
					...tokenContract.write.transfer(recipient.address, amount),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toChangeTokenBalance(node, tokenAddress, sender.address, -amount)
		})

		it('should work with token contract object', async () => {
			await expect(
				contractHandler(node)({
					...tokenContract.write.transfer(recipient.address, amount),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toChangeTokenBalance(node, tokenContract, sender, -amount)
		})

		it('should work with string expected change', async () => {
			await expect(
				contractHandler(node)({
					...tokenContract.write.transfer(recipient.address, amount),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toChangeTokenBalance(node, tokenAddress, sender.address, (-amount).toString())
		})

		it('should work with number expected change', async () => {
			const smallAmount = 1000

			await expect(
				contractHandler(node)({
					...tokenContract.write.transfer(recipient.address, BigInt(smallAmount)),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toChangeTokenBalance(node, tokenAddress, recipient.address, smallAmount)
		})

		it('should work with zero balance change for unrelated account', async () => {
			const unrelatedAccount = PREFUNDED_ACCOUNTS[3]

			await expect(
				contractHandler(node)({
					...tokenContract.write.transfer(recipient.address, amount),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toChangeTokenBalance(node, tokenAddress, unrelatedAccount.address, 0n)
		})
	})

	describe('with transactions that fail', () => {
		it('should fail when expected token balance change is incorrect', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...tokenContract.write.transfer(recipient.address, amount),
						from: sender.address,
						addToBlockchain: true,
					}),
				).toChangeTokenBalance(node, tokenAddress, recipient.address, amount + 1n),
			).rejects.toThrowError(
				`Expected account ${recipient.address} to change token balance by ${(amount + 1n).toString()}`,
			)
		})

		it('should fail when direction of change is wrong', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...tokenContract.write.transfer(recipient.address, amount),
						from: sender.address,
						addToBlockchain: true,
					}),
				).toChangeTokenBalance(node, tokenAddress, recipient.address, -amount),
			).rejects.toThrowError(`Expected account ${recipient.address} to change token balance by ${(-amount).toString()}`)
		})

		it('should fail with invalid token address', async () => {
			const res = await contractHandler(node)({
				...tokenContract.write.transfer(recipient.address, amount),
				from: sender.address,
				addToBlockchain: true,
			})
			await expect(() =>
				expect(res).toChangeTokenBalance(node, '0xinvalid' as Address, recipient.address, amount),
			).rejects.toThrowError('Invalid token address: 0xinvalid')
		})

		it('should fail with invalid account address', async () => {
			const res = await contractHandler(node)({
				...tokenContract.write.transfer(recipient.address, amount),
				from: sender.address,
				addToBlockchain: true,
			})
			await expect(() =>
				expect(res).toChangeTokenBalance(node, tokenAddress, '0xinvalid' as Address, amount),
			).rejects.toThrowError('Invalid address: 0xinvalid')
		})

		it('should fail if the object does neither resolve to a tx hash nor a tx receipt', async () => {
			await expect(() =>
				expect({}).toChangeTokenBalance(node, tokenAddress, recipient.address, amount),
			).rejects.toThrowError(
				'Transaction hash is undefined, you need to pass a transaction hash, receipt or call result, or a promise that resolves to one of those',
			)
		})
	})

	describe('with a negative assertion .not.toChangeTokenBalance', () => {
		it('should pass when token balance change is different than expected', async () => {
			await expect(
				contractHandler(node)({
					...tokenContract.write.transfer(recipient.address, amount),
					from: sender.address,
					addToBlockchain: true,
				}),
			).not.toChangeTokenBalance(node, tokenAddress, recipient.address, amount + 1n)
		})

		it('should fail when token balance change matches expected (with .not)', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...tokenContract.write.transfer(recipient.address, amount),
						from: sender.address,
						addToBlockchain: true,
					}),
				).not.toChangeTokenBalance(node, tokenAddress, recipient.address, amount),
			).rejects.toThrowError(
				`Expected account ${recipient.address} not to change token balance by ${amount.toString()}`,
			)
		})

		it('should pass for unrelated accounts with .not', async () => {
			const unrelatedAccount = PREFUNDED_ACCOUNTS[3]
			await expect(
				contractHandler(node)({
					...tokenContract.write.transfer(recipient.address, amount),
					from: sender.address,
					addToBlockchain: true,
				}),
			).not.toChangeTokenBalance(node, tokenAddress, unrelatedAccount.address, amount)
		})
	})

	describe('should provide helpful error messages', () => {
		it('with the original error bubbled up from the tx promise', async () => {
			const caller = PREFUNDED_ACCOUNTS[4]
			// Don't give caller any tokens, so transfer will fail

			await expect(() =>
				expect(
					contractHandler(node)({
						...tokenContract.write.transfer(recipient.address, amount),
						from: caller.address,
						addToBlockchain: true,
					}),
				).toChangeTokenBalance(node, tokenAddress, caller, -amount),
			).rejects.toThrowError('ERC20InsufficientBalance')
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
				).toChangeTokenBalance(node, tokenAddress, errorContract.address, 0n),
			).rejects.toThrow('The contract function "revertWithRequireAndMessage" reverted with the following reason:')
		})

		it('with a toChangeTokenBalance assertion that fails', async () => {
			try {
				await expect(
					contractHandler(node)({
						...tokenContract.write.transfer(recipient.address, amount),
						from: sender.address,
						addToBlockchain: true,
					}),
				).toChangeTokenBalance(node, tokenAddress, recipient.address, amount + 1n)
			} catch (error: any) {
				expect(error.message).toBe(
					`Expected account ${recipient.address} to change token balance by ${(amount + 1n).toString()}`,
				)
				expect(error.actual).toBe(amount)
				expect(error.expected).toBe(amount + 1n)
			}
		})
	})
})
