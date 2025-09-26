import { tevmDefault } from '@tevm/common'
import { type Contract, ErrorContract } from '@tevm/contract'
import { createTevmTransport, tevmDeploy } from '@tevm/memory-client'
import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { AbiItem } from 'ox'
import type { Address, Hex } from 'viem'
import { createClient, keccak256, toHex } from 'viem'
import { writeContract } from 'viem/actions'
import { assert, beforeAll, describe, expect, it } from 'vitest'

const client = createClient({
	transport: createTevmTransport(),
	chain: tevmDefault,
	account: PREFUNDED_ACCOUNTS[0],
}).extend(() => ({ mode: 'anvil' }))

describe('toBeRevertedWithError', () => {
	let errorContract: Contract<'ErrorContract', typeof ErrorContract.humanReadableAbi, Address, Hex, Hex>

	beforeAll(async () => {
		const { createdAddress: errorContractAddress } = await tevmDeploy(client, {
			...ErrorContract.deploy(),
			addToBlockchain: true,
		})
		assert(errorContractAddress, 'errorContractAddress is undefined')
		errorContract = ErrorContract.withAddress(errorContractAddress)
	})

	describe('basic error detection', () => {
		it('should detect error with contract + error name', async () => {
			await expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).toBeRevertedWithError(
				client,
				errorContract,
				'SimpleError',
			)
		})

		it('should detect error with signature string', async () => {
			await expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).toBeRevertedWithError(
				client,
				'SimpleError()',
			)
		})

		it('should detect error with hex selector', async () => {
			const selector = AbiItem.getSelector('error SimpleError()')
			await expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).toBeRevertedWithError(
				client,
				selector,
			)
		})

		it('should detect error with parameters', async () => {
			await expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam())).toBeRevertedWithError(
				client,
				errorContract,
				'ErrorWithSingleParam',
			)
		})

		it('should detect error with multiple parameters', async () => {
			await expect(
				writeContract(client, errorContract.write.revertWithCustomErrorMultipleParams()),
			).toBeRevertedWithError(client, errorContract, 'ErrorWithMultipleParams')
		})

		it('should fail when wrong error name', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).toBeRevertedWithError(
					client,
					errorContract,
					'ErrorWithSingleParam',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to be reverted with error ErrorWithSingleParam]
			`)
		})

		it('should fail when wrong error signature', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).toBeRevertedWithError(
					client,
					'ErrorWithSingleParam(uint256)',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to be reverted with signature ErrorWithSingleParam(uint256)]
			`)
		})

		it('should fail when wrong error selector', async () => {
			const wrongSelector = AbiItem.getSelector('error ErrorWithSingleParam(uint256)')
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).toBeRevertedWithError(
					client,
					wrongSelector,
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to be reverted with selector ${wrongSelector}]
			`)
		})
	})

	describe('withErrorArgs argument matching', () => {
		it('should pass with correct arguments for single parameter', async () => {
			await expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam()))
				.toBeRevertedWithError(client, errorContract, 'ErrorWithSingleParam')
				.withErrorArgs(100n)
		})

		it('should pass with correct arguments for multiple parameters', async () => {
			await expect(writeContract(client, errorContract.write.revertWithCustomErrorMultipleParams()))
				.toBeRevertedWithError(client, errorContract, 'ErrorWithMultipleParams')
				.withErrorArgs('Something went wrong')
		})

		it('should pass with partial arguments for multiple parameters', async () => {
			await expect(writeContract(client, errorContract.write.revertWithCustomErrorMultipleParams()))
				.toBeRevertedWithError(client, errorContract, 'ErrorWithMultipleParams')
				.withErrorArgs('Something went wrong')
		})

		it('should fail with wrong arguments', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam()))
					.toBeRevertedWithError(client, errorContract, 'ErrorWithSingleParam')
					.withErrorArgs(200n),
			).rejects.toThrow('Expected transaction to revert with the specified arguments')
		})

		it('should fail with too many arguments', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam()))
					.toBeRevertedWithError(client, errorContract, 'ErrorWithSingleParam')
					.withErrorArgs(100n, 200n),
			).rejects.toThrow('Expected transaction to revert with the specified arguments')
		})

		it('should fail without contract for signature/selector', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam()))
					.toBeRevertedWithError(client, 'ErrorWithSingleParam(uint256)')
					// @ts-expect-error - withErrorArgs is not a function on ChainableAssertion
					.withErrorArgs(200n),
			).rejects.toThrow('withErrorArgs() requires a contract with abi and error name')
		})
	})

	describe('withErrorNamedArgs argument matching', () => {
		it('should pass with correct named arguments for single parameter', async () => {
			await expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam()))
				.toBeRevertedWithError(client, errorContract, 'ErrorWithSingleParam')
				.withErrorNamedArgs({ amount: 100n })
		})

		it('should pass with correct named arguments for multiple parameters', async () => {
			await expect(writeContract(client, errorContract.write.revertWithCustomErrorMultipleParams()))
				.toBeRevertedWithError(client, errorContract, 'ErrorWithMultipleParams')
				.withErrorNamedArgs({ message: 'Something went wrong' })
		})

		it('should pass with partial named arguments', async () => {
			await expect(writeContract(client, errorContract.write.revertWithCustomErrorMultipleParams()))
				.toBeRevertedWithError(client, errorContract, 'ErrorWithMultipleParams')
				.withErrorNamedArgs({}) // Empty object should pass
		})

		it('should fail with wrong named arguments', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam()))
					.toBeRevertedWithError(client, errorContract, 'ErrorWithSingleParam')
					.withErrorNamedArgs({ amount: 200n }),
			).rejects.toThrow('Expected transaction to revert with the specified arguments')
		})

		it('should fail with invalid argument names', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam()))
					.toBeRevertedWithError(client, errorContract, 'ErrorWithSingleParam')
					// @ts-expect-error - 'invalidArg' does not exist in the error inputs
					.withErrorNamedArgs({ invalidArg: 100n }),
			).rejects.toThrow('Expected transaction to revert with the specified arguments')
		})

		it('should fail with both right and wrong arguments', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam()))
					.toBeRevertedWithError(client, errorContract, 'ErrorWithSingleParam')
					// @ts-expect-error - 'invalidArg' does not exist in the error inputs
					.withErrorNamedArgs({ amount: 100n, invalidArg: 200n }),
			).rejects.toThrow('Expected transaction to revert with the specified arguments')
		})

		it('should fail without contract', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam()))
					.toBeRevertedWithError(client, 'ErrorWithSingleParam(uint256)')
					// @ts-expect-error - 'withErrorNamedArgs' requires contract context
					.withErrorNamedArgs({ amount: 100n }),
			).rejects.toThrow('withErrorNamedArgs() requires a contract with abi and error name')
		})
	})

	describe('with string revert instead of custom error', () => {
		it('should fail when expecting custom error but getting string revert', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithStringError())).toBeRevertedWithError(
					client,
					errorContract,
					'SimpleError',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to be reverted with error SimpleError]
			`)
		})

		it('should fail when expecting custom error selector but getting string revert', async () => {
			const selector = keccak256(toHex('SimpleError()')).slice(0, 10) as Hex
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithStringError())).toBeRevertedWithError(
					client,
					selector,
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to be reverted with selector ${selector}]
			`)
		})
	})

	describe('with panic error instead of custom error', () => {
		it('should fail when expecting custom error but getting panic', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.panicWithAssertFailure())).toBeRevertedWithError(
					client,
					errorContract,
					'SimpleError',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to be reverted with error SimpleError]
			`)
		})

		it('should fail when expecting custom error selector but getting panic', async () => {
			const selector = keccak256(toHex('SimpleError()')).slice(0, 10) as Hex
			await expect(() =>
				expect(writeContract(client, errorContract.write.panicWithAssertFailure())).toBeRevertedWithError(
					client,
					selector,
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to be reverted with selector ${selector}]
			`)
		})
	})

	describe('error not found in ABI', () => {
		it('should throw when error name not found in contract ABI', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithSimpleCustomError()))
					// @ts-expect-error - NonExistentError does not exist in the ABI
					.toBeRevertedWithError(client, errorContract, 'NonExistentError'),
			).rejects.toThrow('Error NonExistentError not found in contract ABI')
		})

		it('should require error name as second argument', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithSimpleCustomError()))
					// @ts-expect-error - Missing error name
					.toBeRevertedWithError(client, errorContract),
			).rejects.toThrow('You need to provide an error name as a second argument')
		})
	})

	describe('negation support', () => {
		it('should support not.toBeRevertedWithError - different error', async () => {
			await expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).not.toBeRevertedWithError(
				client,
				errorContract,
				'ErrorWithSingleParam',
			)
		})

		it('should support not.toBeRevertedWithError - string revert instead', async () => {
			await expect(writeContract(client, errorContract.write.revertWithStringError())).not.toBeRevertedWithError(
				client,
				errorContract,
				'SimpleError',
			)
		})

		it('should support not.toBeRevertedWithError - panic instead', async () => {
			await expect(writeContract(client, errorContract.write.panicWithAssertFailure())).not.toBeRevertedWithError(
				client,
				errorContract,
				'SimpleError',
			)
		})

		it('should fail not.toBeRevertedWithError when error matches', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).not.toBeRevertedWithError(
					client,
					errorContract,
					'SimpleError',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction not to be reverted with error SimpleError, but it reverted with:

				custom error: SimpleError()]
			`)
		})

		it('should fail not.toBeRevertedWithError when signature matches', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).not.toBeRevertedWithError(
					client,
					'SimpleError()',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction not to be reverted with signature SimpleError(), but it reverted with:

				custom error: SimpleError()]
			`)
		})

		it('should fail not.toBeRevertedWithError when selector matches', async () => {
			const selector = keccak256(toHex('SimpleError()')).slice(0, 10) as Hex
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).not.toBeRevertedWithError(
					client,
					selector,
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction not to be reverted with selector ${selector}, but it reverted with:

				custom error: SimpleError()]
			`)
		})
	})

	describe('error handling', () => {
		it('should throw when transaction throws non-revert error', async () => {
			try {
				await expect(writeContract(client, errorContract.write.errorOutOfGas())).toBeRevertedWithError(
					client,
					errorContract,
					'SimpleError',
				)
				assert(false, 'should have thrown')
			} catch (error: any) {
				expect(error.message).toContain(
					'Expected transaction to be or not be reverted, but a different error was thrown',
				)
				expect(error.cause.message).toContain('Details: out of gas')
			}
		})

		it('should throw when transaction throws invalid opcode error', async () => {
			try {
				await expect(writeContract(client, errorContract.write.errorWithInvalidOpcode())).toBeRevertedWithError(
					client,
					errorContract,
					'SimpleError',
				)
				assert(false, 'should have thrown')
			} catch (error: any) {
				expect(error.message).toContain(
					'Expected transaction to be or not be reverted, but a different error was thrown',
				)
				expect(error.cause.message).toContain('Details: invalid opcode')
			}
		})
	})
})
