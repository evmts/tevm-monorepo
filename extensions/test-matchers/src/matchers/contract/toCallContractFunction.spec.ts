import { tevmDefault } from '@tevm/common'
import { type Contract } from '@tevm/contract'
import { ErrorContract } from '@tevm/contract'
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

describe('toCallContractFunction', () => {
	let errorContract: Contract<'ErrorContract', typeof ErrorContract.humanReadableAbi, Address, Hex, Hex>

	beforeAll(async () => {
		const { createdAddress: errorContractAddress } = await tevmDeploy(client, {
			...ErrorContract.deploy(),
			addToBlockchain: true,
		})
		assert(errorContractAddress, 'errorContractAddress is undefined')
		errorContract = ErrorContract.withAddress(errorContractAddress)
	})

	describe('basic function call detection', () => {
		it('should detect function call with contract + function name', async () => {
			await expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).toCallContractFunction(
				client,
				errorContract,
				'revertWithSimpleCustomError',
			)
		})

		it('should detect function call with signature string', async () => {
			await expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).toCallContractFunction(
				client,
				errorContract,
				'revertWithSimpleCustomError()',
			)
		})

		it('should detect function call with hex selector', async () => {
			const selector = AbiItem.getSelector('function revertWithSimpleCustomError()')
			await expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).toCallContractFunction(
				client,
				errorContract,
				selector,
			)
		})

		it('should detect function call with parameters', async () => {
			await expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam())).toCallContractFunction(
				client,
				errorContract,
				'revertWithCustomErrorSingleParam',
			)
		})

		it('should detect function call with multiple parameters', async () => {
			await expect(
				writeContract(client, errorContract.write.revertWithCustomErrorMultipleParams()),
			).toCallContractFunction(client, errorContract, 'revertWithCustomErrorMultipleParams')
		})

		it('should fail when wrong function name', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).toCallContractFunction(
					client,
					errorContract,
					'revertWithCustomErrorSingleParam',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to call function revertWithCustomErrorSingleParam on contract ${errorContract.address}]
			`)
		})

		it('should fail when wrong function signature', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).toCallContractFunction(
					client,
					errorContract,
					'revertWithCustomErrorSingleParam(uint256)',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to call function with signature revertWithCustomErrorSingleParam(uint256)]
			`)
		})

		it('should fail when wrong function selector', async () => {
			const wrongSelector = AbiItem.getSelector('function revertWithCustomErrorSingleParam(uint256)')
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).toCallContractFunction(
					client,
					errorContract,
					wrongSelector,
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to call function with selector ${wrongSelector}]
			`)
		})

		it('should fail when transaction calls different contract', async () => {
			// Deploy a second contract for this test
			const { createdAddress: secondContractAddress } = await tevmDeploy(client, {
				...ErrorContract.deploy(),
				addToBlockchain: true,
			})
			assert(secondContractAddress, 'secondContractAddress is undefined')
			const secondContract = ErrorContract.withAddress(secondContractAddress)

			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).toCallContractFunction(
					client,
					secondContract, // Different contract address
					'revertWithSimpleCustomError',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction to call function revertWithSimpleCustomError on contract ${secondContract.address}]
			`)
		})
	})

	describe('withFunctionArgs argument matching', () => {
		it('should pass with correct arguments for single parameter', async () => {
			await expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam()))
				.toCallContractFunction(client, errorContract, 'revertWithCustomErrorSingleParam')
				.withFunctionArgs(100n)
		})

		it('should pass with correct arguments for multiple parameters', async () => {
			await expect(writeContract(client, errorContract.write.revertWithCustomErrorMultipleParams()))
				.toCallContractFunction(client, errorContract, 'revertWithCustomErrorMultipleParams')
				.withFunctionArgs('Something went wrong')
		})

		it('should pass with partial arguments for multiple parameters', async () => {
			await expect(writeContract(client, errorContract.write.revertWithCustomErrorMultipleParams()))
				.toCallContractFunction(client, errorContract, 'revertWithCustomErrorMultipleParams')
				.withFunctionArgs('Something went wrong')
		})

		it('should fail with wrong arguments', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam()))
					.toCallContractFunction(client, errorContract, 'revertWithCustomErrorSingleParam')
					.withFunctionArgs(200n),
			).rejects.toThrow('Expected transaction to call function with the specified arguments')
		})

		it('should fail with too many arguments', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam()))
					.toCallContractFunction(client, errorContract, 'revertWithCustomErrorSingleParam')
					.withFunctionArgs(100n, 200n),
			).rejects.toThrow('Expected transaction to call function with the specified arguments')
		})

		it('should fail without contract for signature/selector', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam()))
					.toCallContractFunction(client, errorContract, 'revertWithCustomErrorSingleParam(uint256)')
					// @ts-expect-error - withFunctionArgs is not a function on ChainableAssertion
					.withFunctionArgs(200n),
			).rejects.toThrow('withFunctionArgs() requires a contract with abi and function name')
		})
	})

	describe('withFunctionNamedArgs argument matching', () => {
		it('should pass with correct named arguments for single parameter', async () => {
			await expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam()))
				.toCallContractFunction(client, errorContract, 'revertWithCustomErrorSingleParam')
				.withFunctionNamedArgs({ amount: 100n })
		})

		it('should pass with correct named arguments for multiple parameters', async () => {
			await expect(writeContract(client, errorContract.write.revertWithCustomErrorMultipleParams()))
				.toCallContractFunction(client, errorContract, 'revertWithCustomErrorMultipleParams')
				.withFunctionNamedArgs({ message: 'Something went wrong' })
		})

		it('should pass with partial named arguments', async () => {
			await expect(writeContract(client, errorContract.write.revertWithCustomErrorMultipleParams()))
				.toCallContractFunction(client, errorContract, 'revertWithCustomErrorMultipleParams')
				.withFunctionNamedArgs({}) // Empty object should pass
		})

		it('should fail with wrong named arguments', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam()))
					.toCallContractFunction(client, errorContract, 'revertWithCustomErrorSingleParam')
					.withFunctionNamedArgs({ amount: 200n }),
			).rejects.toThrow('Expected transaction to call function with the specified arguments')
		})

		it('should fail with invalid argument names', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam()))
					.toCallContractFunction(client, errorContract, 'revertWithCustomErrorSingleParam')
					// @ts-expect-error - 'invalidArg' does not exist in the function inputs
					.withFunctionNamedArgs({ invalidArg: 100n }),
			).rejects.toThrow('Expected transaction to call function with the specified arguments')
		})

		it('should fail with both right and wrong arguments', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam()))
					.toCallContractFunction(client, errorContract, 'revertWithCustomErrorSingleParam')
					// @ts-expect-error - 'invalidArg' does not exist in the function inputs
					.withFunctionNamedArgs({ amount: 100n, invalidArg: 200n }),
			).rejects.toThrow('Expected transaction to call function with the specified arguments')
		})

		it('should fail without contract', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithCustomErrorSingleParam()))
					.toCallContractFunction(client, errorContract, 'revertWithCustomErrorSingleParam(uint256)')
					// @ts-expect-error - 'withFunctionNamedArgs' requires contract context
					.withFunctionNamedArgs({ amount: 100n }),
			).rejects.toThrow('withFunctionNamedArgs() requires a contract with abi and function name')
		})
	})

	describe('function not found in ABI', () => {
		it('should throw when function name not found in contract ABI', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithSimpleCustomError()))
					// @ts-expect-error - NonExistentFunction does not exist in the ABI
					.toCallContractFunction(client, errorContract, 'NonExistentFunction'),
			).rejects.toThrow('Function NonExistentFunction not found in contract ABI')
		})

		it('should require function name as second argument', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithSimpleCustomError()))
					// @ts-expect-error - Missing function name
					.toCallContractFunction(client, errorContract),
			).rejects.toThrow('You need to provide a function name as a second argument')
		})
	})

	describe('negation support', () => {
		it('should support not.toCallContractFunction - different function', async () => {
			await expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).not.toCallContractFunction(
				client,
				errorContract,
				'revertWithCustomErrorSingleParam',
			)
		})

		it('should support not.toCallContractFunction - different contract', async () => {
			// Deploy a second contract for this test
			const { createdAddress: secondContractAddress } = await tevmDeploy(client, {
				...ErrorContract.deploy(),
				addToBlockchain: true,
			})
			assert(secondContractAddress, 'secondContractAddress is undefined')
			const secondContract = ErrorContract.withAddress(secondContractAddress)

			await expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).not.toCallContractFunction(
				client,
				secondContract,
				'revertWithSimpleCustomError',
			)
		})

		it('should fail not.toCallContractFunction when function matches', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).not.toCallContractFunction(
					client,
					errorContract,
					'revertWithSimpleCustomError',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction not to call function revertWithSimpleCustomError on contract ${errorContract.address}]
			`)
		})

		it('should fail not.toCallContractFunction when signature matches', async () => {
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).not.toCallContractFunction(
					client,
					errorContract,
					'revertWithSimpleCustomError()',
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction not to call function with signature revertWithSimpleCustomError()]
			`)
		})

		it('should fail not.toCallContractFunction when selector matches', async () => {
			const selector = AbiItem.getSelector('function revertWithSimpleCustomError()')
			await expect(() =>
				expect(writeContract(client, errorContract.write.revertWithSimpleCustomError())).not.toCallContractFunction(
					client,
					errorContract,
					selector,
				),
			).rejects.toThrowErrorMatchingInlineSnapshot(`
				[Error: Expected transaction not to call function with selector ${selector}]
			`)
		})
	})

	describe('transaction types', () => {
		it('should work with transaction hash', async () => {
			const txHash = await writeContract(client, errorContract.write.revertWithSimpleCustomError())
			await expect(txHash).toCallContractFunction(client, errorContract, 'revertWithSimpleCustomError')
		})

		it('should work with transaction receipt', async () => {
			const txHash = await writeContract(client, errorContract.write.revertWithSimpleCustomError())
			const receipt = await client.waitForTransactionReceipt({ hash: txHash })
			await expect(receipt).toCallContractFunction(client, errorContract, 'revertWithSimpleCustomError')
		})

		it('should work with call result', async () => {
			// Note: This would need to be adapted based on how CallResult is structured
			// For now, testing with a promise that resolves to transaction hash
			const txPromise = writeContract(client, errorContract.write.revertWithSimpleCustomError())
			await expect(txPromise).toCallContractFunction(client, errorContract, 'revertWithSimpleCustomError')
		})
	})

	describe('error handling', () => {
		it('should throw when transaction execution fails in unexpected way', async () => {
			try {
				// This test would need a scenario that causes an unexpected error
				// For now, we'll simulate by passing invalid data
				await expect('0xinvalid' as Hex).toCallContractFunction(
					client,
					errorContract,
					'revertWithSimpleCustomError',
				)
				assert(false, 'should have thrown')
			} catch (error: any) {
				expect(error.message).toContain(
					'Expected transaction to call a contract function, but a different error was thrown',
				)
			}
		})

		it('should handle transaction with no input data', async () => {
			// This would test a transaction that doesn't have function call data
			// Implementation would need to handle empty input gracefully
		})

		it('should handle transaction with invalid function data', async () => {
			// This would test a transaction with malformed function call data
			// Implementation would need to handle decode errors gracefully
		})
	})
})