import { tevmDefault } from '@tevm/common'
import { type Contract, ErrorContract, SimpleContract } from '@tevm/contract'
import { createClient, createTevmTransport, tevmContract, tevmDeploy, tevmGetAccount, tevmSetAccount } from '@tevm/memory-client'
import { type Address, encodeFunctionData, type Hex, parseEther, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { assert, beforeAll, describe, expect, it } from 'vitest'

const client = createClient({
	transport: createTevmTransport(),
	chain: tevmDefault,
	account: PREFUNDED_ACCOUNTS[0],
}).extend(() => ({ mode: 'anvil' }))

describe('toBeReverted', () => {
	let simpleContract: Contract<'SimpleContract', typeof SimpleContract.humanReadableAbi, Address, Hex, Hex>
	let errorContract: Contract<'ErrorContract', typeof ErrorContract.humanReadableAbi, Address, Hex, Hex>

	beforeAll(async () => {
		const { createdAddress: errorContractAddress } = await tevmDeploy(client, {
			...ErrorContract.deploy(),
			addToBlockchain: true,
		})
		assert(errorContractAddress, 'errorContractAddress is undefined')
		errorContract = ErrorContract.withAddress(errorContractAddress)

		const { createdAddress: simpleContractAddress } = await tevmDeploy(client, {
			...SimpleContract.deploy(1n),
			addToBlockchain: true,
		})
		assert(simpleContractAddress, 'simpleContractAddress is undefined')
		simpleContract = SimpleContract.withAddress(simpleContractAddress)
	})

	describe('with a call to a contract that reverts', () => {
		it('should work with writeContract', async () => {
			await expect(client.writeContract(errorContract.write.revertWithCustomErrorMultipleParams())).toBeReverted()
		})

		it('should work with tevmContract and throwOnFail: true', async () => {
			await expect(
				tevmContract(client, { ...errorContract.write.revertWithCustomErrorSingleParam(), throwOnFail: true }),
			).toBeReverted()
		})

		it('should work with tevmContract and throwOnFail: false', async () => {
			await expect(
				tevmContract(client, { ...errorContract.write.revertWithRequireAndMessage(), throwOnFail: false }),
			).toBeReverted(client)
		})

		it('should work with a tevm CallResult', async () => {
			await expect(
				await tevmContract(client, { ...errorContract.write.revertWithRequireAndMessage(), throwOnFail: false }),
			).toBeReverted(client)
		})

		it('should work with sendTransaction with encoded data', async () => {
			await expect(
				client.sendTransaction({
					to: errorContract.address,
					data: encodeFunctionData(errorContract.write.revertWithRequireNoMessage()),
				}),
			).toBeReverted()
		})

		it('should work with a tx hash', async () => {
			const txHash = await client.writeContract({
				...errorContract.write.revertWithRequireNoMessage(),
				gas: BigInt(1e6),
			})
			await client.mine({ blocks: 1 })
			await expect(txHash).toBeReverted(client)
		})

		it('should work with a tx receipt', async () => {
			const txHash = await client.writeContract({ ...errorContract.write.revertWithStringError(), gas: BigInt(1e6) })
			await client.mine({ blocks: 1 })
			const txReceipt = await client.getTransactionReceipt({ hash: txHash })
			await expect(txReceipt).toBeReverted(client)
		})

		it('should work with a non-function call that reverts', async () => {
			await expect(client.sendTransaction({ value: parseEther('1'), to: errorContract.address })).toBeReverted()
		})

		it('should work with panic errors', async () => {
			await expect(client.writeContract(errorContract.write.panicWithArithmeticOverflow())).toBeReverted()
		})
	})

	describe('with a call to a contract that succeeds', () => {
		it('should fail if the contract succeeds', async () => {
			await expect(() =>
				expect(
					tevmContract(client, { ...simpleContract.write.set(1n), throwOnFail: true, addToBlockchain: true }),
				).toBeReverted(client),
			).rejects.toThrowError("Expected transaction to be reverted, but it didn't")
		})
	})

	describe('with a call to a contract that throws a different error', () => {
		it('should fail if the contract throws an out of gas error', async () => {
			try {
				await expect(client.writeContract(errorContract.write.errorOutOfGas())).toBeReverted()
				assert(false, 'should have thrown')
			} catch (error: any) {
				expect(error.message).toContain(
					'Expected transaction to be or not be reverted, but a different error was thrown',
				)
				expect(error.cause.message).toContain('Details: out of gas')
			}
		})

		it('should fail if the contract throws an invalid opcode error', async () => {
			try {
				await expect(client.writeContract(errorContract.write.errorWithInvalidOpcode())).toBeReverted()
				assert(false, 'should have thrown')
			} catch (error: any) {
				expect(error.message).toContain(
					'Expected transaction to be or not be reverted, but a different error was thrown',
				)
				expect(error.cause.message).toContain('Details: invalid opcode')
			}
		})

		it('should fail if the transaction throws an insufficient caller balance error', async () => {
			// drain the caller balance first
			await tevmSetAccount(client, { address: PREFUNDED_ACCOUNTS[1].address, balance: 0n })
			try {
				await expect(
					tevmContract(client, {
						...simpleContract.write.set(1n),
						throwOnFail: true,
						addToBlockchain: true,
						from: PREFUNDED_ACCOUNTS[1].address,
					}),
				).toBeReverted(client)
				assert(false, 'should have thrown')
			} catch (error: any) {
				expect(error.message).toBe('Expected transaction to be or not be reverted, but a different error was thrown')
				expect(error.cause.message).toContain(
					`Insufficientbalance: Account ${PREFUNDED_ACCOUNTS[1].address} attempted to create a transaction with zero eth. Consider adding eth to account or using a different from or origin address`,
				)
			}
		})

		it('should fail if the transaction throws an invalid nonce error', async () => {
			const { nonce } = await tevmGetAccount(client, { address: PREFUNDED_ACCOUNTS[0].address })
			try {
				await expect(client.writeContract({ ...simpleContract.write.set(1n), nonce: Number(nonce) + 1 })).toBeReverted(
					client,
				)
				assert(false, 'should have thrown')
			} catch (error: any) {
				expect(error.message).toContain(
					'Expected transaction to be or not be reverted, but a different error was thrown',
				)
				// The error type can be either TransactionReceiptNotFoundError or TransactionRejectedRpcError
				// depending on how the nonce validation happens
				expect(['TransactionReceiptNotFoundError', 'TransactionRejectedRpcError']).toContain(error.cause.name)
			}
		})

		it('should fail if the transaction throws an insufficient gas error', async () => {
			try {
				await expect(
					client.writeContract({ ...errorContract.write.revertWithCustomErrorSingleParam(), gas: 0n }),
				).toBeReverted(client)
				assert(false, 'should have thrown')
			} catch (error: any) {
				expect(error.message).toBe('Expected transaction to be or not be reverted, but a different error was thrown')
				expect(error.cause.name).toContain('TransactionReceiptNotFoundError')
			}
		})
	})

	describe('with a negative assertion .not.toBeReverted', () => {
		it('should work if the transaction succeeds', async () => {
			await expect(
				tevmContract(client, { ...simpleContract.write.set(1n), throwOnFail: true, addToBlockchain: true }),
			).not.toBeReverted(client)
		})

		it('should fail if the transaction reverts', async () => {
			await expect(() =>
				expect(client.writeContract(errorContract.write.revertWithCustomErrorSingleParam())).not.toBeReverted(client),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction not to be reverted, but it reverted with:

				custom error: ErrorWithSingleParam(uint256)
				                                  (100)]
			`)
		})

		it('should fail if the transaction throws a different error', async () => {
			await tevmSetAccount(client, { address: PREFUNDED_ACCOUNTS[1].address, balance: 0n })
			try {
				await expect(
					tevmContract(client, {
						...simpleContract.write.set(1n),
						throwOnFail: true,
						addToBlockchain: true,
						from: PREFUNDED_ACCOUNTS[1].address,
					}),
				).not.toBeReverted(client)
			} catch (error: any) {
				expect(error.message).toBe('Expected transaction to be or not be reverted, but a different error was thrown')
				expect(error.cause._tag).toBe('InsufficientBalance')
			}
		})
	})
})
