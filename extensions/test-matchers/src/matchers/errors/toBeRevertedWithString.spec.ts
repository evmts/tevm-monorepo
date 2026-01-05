import { tevmDefault } from '@tevm/common'
import { type Contract, ErrorContract } from '@tevm/contract'
import { createTevmTransport, tevmDeploy } from '@tevm/memory-client'
import { type Address, type Hex, PREFUNDED_ACCOUNTS } from '@tevm/utils'
import { createClient } from 'viem'
import { writeContract } from 'viem/actions'
import { assert, beforeAll, describe, expect, it } from 'vitest'

const client = createClient({
	transport: createTevmTransport(),
	chain: tevmDefault,
	account: PREFUNDED_ACCOUNTS[0],
}).extend(() => ({ mode: 'anvil' }))

describe('toBeRevertedWithString', () => {
	let errorContract: Contract<'ErrorContract', typeof ErrorContract.humanReadableAbi, Address, Hex, Hex>

	beforeAll(async () => {
		const { createdAddress: errorContractAddress } = await tevmDeploy(client, {
			...ErrorContract.deploy(),
			addToBlockchain: true,
		})
		assert(errorContractAddress, 'errorContractAddress is undefined')
		errorContract = ErrorContract.withAddress(errorContractAddress)
	})

	describe('with a call to a contract that reverts and a matching revert string', () => {
		it('should match revert with string error', async () => {
			await expect(writeContract(client, errorContract.write.revertWithStringError())).toBeRevertedWithString(
				client,
				'This is a string error message',
			)
		})

		it('should match revert with require message', async () => {
			await expect(writeContract(client, errorContract.write.revertWithRequireAndMessage())).toBeRevertedWithString(
				client,
				'Require failed with message',
			)
		})
	})

	describe('with a call to a contract that reverts and a mismatching revert string', () => {
		it('should fail when expecting wrong string', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithStringError())).toBeRevertedWithString(
					client,
					'Wrong error message',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to be reverted with revert string Wrong error message]
			`)
		})

		it('should fail when expecting partial string', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithStringError())).toBeRevertedWithString(
					client,
					'This is a string',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to be reverted with revert string This is a string]
			`)
		})

		it('should fail when expecting longer string', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithStringError())).toBeRevertedWithString(
					client,
					'This is a string error message and more',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to be reverted with revert string This is a string error message and more]
			`)
		})

		it('should fail when expecting non-empty string but getting empty', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithoutMessage())).toBeRevertedWithString(
					client,
					'Some message',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to be reverted with revert string Some message]
			`)
		})

		it('should fail when expecting empty string but getting non-empty', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithStringError())).toBeRevertedWithString(client, ''),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to be reverted with revert string ]
			`)
		})
	})

	describe('with a call to a contract that reverts and a custom error', () => {
		it('should fail with custom error (not string revert)', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).toBeRevertedWithString(
					client,
					'SimpleError',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to be reverted with revert string SimpleError]
			`)
		})

		it('should fail with custom error with parameters', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam())).toBeRevertedWithString(
					client,
					'ErrorWithSingleParam',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to be reverted with revert string ErrorWithSingleParam]
			`)
		})

		it('should fail with custom error with multiple parameters', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithCustomErrorMultipleParams())).toBeRevertedWithString(
					client,
					'ErrorWithMultipleParams',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to be reverted with revert string ErrorWithMultipleParams]
			`)
		})
	})

	describe('with a call to a contract that reverts and a panic error', () => {
		it('should fail with panic error', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.panicWithAssertFailure())).toBeRevertedWithString(
					client,
					'assert failed',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to be reverted with revert string assert failed]
			`)
		})

		it('should fail with arithmetic overflow panic', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.panicWithArithmeticOverflow())).toBeRevertedWithString(
					client,
					'arithmetic overflow',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to be reverted with revert string arithmetic overflow]
			`)
		})
	})

	describe('with a call to a contract that reverts and a special character in the revert string', () => {
		it('should handle special characters in expected string', async () => {
			// This test assumes the error message contains special characters
			// If not available in ErrorContract, this tests the matcher's ability to handle them
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithStringError())).toBeRevertedWithString(
					client,
					'This is a "quoted" error with \n newlines',
				),
			).rejects.toThrow()
		})

		it('should be case sensitive', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithStringError())).toBeRevertedWithString(
					client,
					'this is a string error message',
				),
			).rejects.toThrow()
		})

		it('should handle whitespace exactly', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithStringError())).toBeRevertedWithString(
					client,
					' This is a string error message ',
				),
			).rejects.toThrow()
		})
	})

	describe('with a negative assertion .not.toBeRevertedWithString', () => {
		it('should pass when revert string is different', async () => {
			await expect(writeContract(client, errorContract.write.revertWithStringError())).not.toBeRevertedWithString(
				client,
				'Different error message',
			)
		})

		it('should pass when revert string is empty', async () => {
			await expect(writeContract(client, errorContract.write.panicWithAssertFailure())).not.toBeRevertedWithString(
				client,
				'',
			)
		})

		it('should fail when revert string matches exactly', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithStringError())).not.toBeRevertedWithString(
					client,
					'This is a string error message',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction not to be reverted with revert string, but it reverted with:

				revert: This is a string error message]
			`)
		})
	})
})
