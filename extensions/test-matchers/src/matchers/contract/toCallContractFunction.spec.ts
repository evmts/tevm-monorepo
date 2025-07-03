import { contractHandler, deployHandler } from '@tevm/actions'
import { AdvancedContract } from '@tevm/contract'
import { createMemoryClient } from '@tevm/memory-client'
import { createTevmNode } from '@tevm/node'
import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import type { Address } from 'viem'
import { toFunctionSelector } from 'viem'
import { assert, beforeEach, describe, expect, it } from 'vitest'

const node = createTevmNode()
const sender = PREFUNDED_ACCOUNTS[0]

describe('toCallContractFunction', () => {
	let contract: ReturnType<typeof AdvancedContract.withAddress>

	beforeEach(async () => {
		// Deploy AdvancedContract using deployHandler
		const { createdAddress: contractAddress } = await deployHandler(node)({
			...AdvancedContract.deploy(42n, true, 'test', sender.address),
			addToBlockchain: true,
		})
		assert(contractAddress, 'contractAddress is undefined')
		contract = AdvancedContract.withAddress(contractAddress)
	})

	describe('basic function call detection', () => {
		it('should detect function call with contract + function name', async () => {
			await expect(
				contractHandler(node)({
					...contract.write.setNumber(100n),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toCallContractFunction(node, contract, 'setNumber')
		})

		it('should detect function call with signature string', async () => {
			await expect(
				contractHandler(node)({
					...contract.write.setNumber(100n),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toCallContractFunction(node, 'setNumber(uint256)')
		})

		it('should detect function call with hex selector', async () => {
			await expect(
				contractHandler(node)({
					...contract.write.setNumber(100n),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toCallContractFunction(node, toFunctionSelector('function setNumber(uint256)'))
		})

		it('should detect an internal function call with this', async () => {
			await expect(
				contractHandler(node)({
					...contract.write.setAllValues(66n, false, 'test', sender.address),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toCallContractFunction(node, contract, 'setAddress')
		})

		it('should fail when wrong function name', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...contract.write.setNumber(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				).toCallContractFunction(node, contract, 'setBool'),
			).rejects.toThrow('Expected transaction to call function setBool')
		})

		it('should fail when wrong function signature', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...contract.write.setNumber(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				).toCallContractFunction(node, 'setNumber(uint128)'), // Wrong function signature
			).rejects.toThrow('Expected transaction to call function')
		})

		it('should fail when wrong function selector', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...contract.write.setNumber(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				).toCallContractFunction(node, toFunctionSelector('function getNumber()')),
			).rejects.toThrow('Expected transaction to call function')
		})

		// TODO: we don't support this (4byte trace doesn't return this information)
		it.todo('should fail when transaction calls the same function signature on a different contract')
	})

	describe('withFunctionArgs argument matching', () => {
		it('should pass with correct arguments for single parameter', async () => {
			await expect(
				contractHandler(node)({
					...contract.write.setNumber(100n),
					from: sender.address,
					addToBlockchain: true,
				}),
			)
				.toCallContractFunction(node, contract, 'setNumber')
				.withFunctionArgs(100n)
		})

		it('should fail with wrong arguments', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...contract.write.setNumber(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					.toCallContractFunction(node, contract, 'setNumber')
					.withFunctionArgs(200n),
			).rejects.toThrow('Expected transaction to call function with the specified arguments')
		})

		it('should fail with too many arguments', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...contract.write.setNumber(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					.toCallContractFunction(node, contract, 'setNumber')
					.withFunctionArgs(100n, 200n), // Too many arguments - setNumber only takes one
			).rejects.toThrow('Expected transaction to call function with the specified arguments')
		})

		it('should fail without contract for signature/selector', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...contract.write.setNumber(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					.toCallContractFunction(node, 'setNumber(uint256)')
					// @ts-expect-error - withFunctionArgs is not a function on ChainableAssertion
					.withFunctionArgs(200n),
			).rejects.toThrow('withFunctionArgs() requires a contract with abi and function name')
		})
	})

	describe('withFunctionNamedArgs argument matching', () => {
		it('should pass with correct named arguments for single parameter', async () => {
			await expect(
				contractHandler(node)({
					...contract.write.setNumber(100n),
					from: sender.address,
					addToBlockchain: true,
				}),
			)
				.toCallContractFunction(node, contract, 'setNumber')
				.withFunctionNamedArgs({ newValue: 100n })
		})

		it('should pass with empty object (no constraints)', async () => {
			await expect(
				contractHandler(node)({
					...contract.write.setNumber(42n),
					from: sender.address,
					addToBlockchain: true,
				}),
			)
				.toCallContractFunction(node, contract, 'setNumber')
				.withFunctionNamedArgs({}) // Empty object should pass
		})

		it('should fail with wrong named arguments', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...contract.write.setNumber(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					.toCallContractFunction(node, contract, 'setNumber')
					.withFunctionNamedArgs({ newValue: 200n }), // Wrong value
			).rejects.toThrow('Expected transaction to call function with the specified arguments')
		})

		it('should fail with invalid argument names', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...contract.write.setNumber(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					.toCallContractFunction(node, contract, 'setNumber')
					// @ts-expect-error - 'invalidArg' does not exist in the function inputs
					.withFunctionNamedArgs({ invalidArg: 100n }),
			).rejects.toThrow('Expected transaction to call function with the specified arguments')
		})

		it('should fail with both right and wrong arguments', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...contract.write.setAllValues(100n, false, 'test', sender.address),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					.toCallContractFunction(node, contract, 'setAllValues')
					.withFunctionNamedArgs({ newNumber: 100n, newAddress: sender.address, newBool: true }),
			).rejects.toThrow('Expected transaction to call function with the specified arguments')
		})

		it('should fail without contract', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...contract.write.setNumber(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					.toCallContractFunction(node, 'setNumber(uint256)')
					// @ts-expect-error - 'withFunctionNamedArgs' requires contract context
					.withFunctionNamedArgs({ newValue: 100n }),
			).rejects.toThrow('withFunctionNamedArgs() requires a contract with abi and function name')
		})
	})

	describe('function not found in ABI', () => {
		it('should throw when function name not found in contract ABI', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...contract.write.setNumber(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					// @ts-expect-error - 'setNonExistentFunction' does not exist in the contract ABI
					.toCallContractFunction(node, contract, 'setNonExistentFunction'),
			// This propagates the error from viem
			).rejects.toThrow('ABI item with name "setNonExistentFunction" not found.')
		})

		it('should require function selector/signature as second argument or contract with a third argument', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...contract.write.setNumber(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					// @ts-expect-error - Missing function name
					.toCallContractFunction(node, contract),
			).rejects.toThrow('You need to provide a function name as a third argument')
		})
	})

	describe('negation support', () => {
		it('should support not.toCallContractFunction - different function', async () => {
			await expect(
				contractHandler(node)({
					...contract.write.setNumber(100n),
					from: sender.address,
					addToBlockchain: true,
				}),
			).not.toCallContractFunction(node, contract, 'getNumber')
		})

		it('should fail not.toCallContractFunction when function matches', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...contract.write.setNumber(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				).not.toCallContractFunction(node, contract, 'setNumber'),
			).rejects.toThrow('Expected transaction not to call function setNumber')
		})

		it('should fail not.toCallContractFunction when signature matches', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...contract.write.setNumber(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				).not.toCallContractFunction(node, 'setNumber(uint256)'),
			).rejects.toThrow('Expected transaction not to call function')
		})

		it('should fail not.toCallContractFunction when selector matches', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...contract.write.setNumber(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				).not.toCallContractFunction(node, toFunctionSelector('function setNumber(uint256)')),
			).rejects.toThrow('Expected transaction not to call function')
		})

		it.todo('should support not.toCallContractFunction - different contract')
	})

	describe('transaction types', () => {
		it('should work with contract call result', async () => {
			const result = await contractHandler(node)({
				...contract.write.setNumber(100n),
				from: sender.address,
				addToBlockchain: true,
			})
			await expect(result).toCallContractFunction(node, contract, 'setNumber')
		})

		it('should work with transaction hash', async () => {
			const { txHash } = await contractHandler(node)({
				...contract.write.setNumber(100n),
				from: sender.address,
				addToBlockchain: true,
			})
			await expect(txHash).toCallContractFunction(node, contract, 'setNumber')
		})

		it('should work with promise that resolves to call result', async () => {
			await expect(
				contractHandler(node)({
					...contract.write.setNumber(100n),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toCallContractFunction(node, contract, 'setNumber')
		})

		it('should work with promise that resolves to transaction hash', async () => {
			await expect(
				contractHandler(node)({
					...contract.write.setNumber(100n),
					from: sender.address,
					addToBlockchain: true,
				}).then((res) => res.txHash),
			).toCallContractFunction(node, contract, 'setNumber')
		})
	})

	describe('with memory client', () => {
		// TODO: unskip when we support eth_getProof
		it.skip('should work with an eip1193 client', async () => {
			const client = createMemoryClient()

			// Deploy contract in client
			const { createdAddress: clientContractAddress } = await client.tevmDeploy({
				...AdvancedContract.deploy(42n, true, 'test', sender.address),
				addToBlockchain: true,
			})
			assert(clientContractAddress, 'Client contract address is undefined')
			const clientContract = AdvancedContract.withAddress(clientContractAddress)

			// Call contract function
			const res = await client.tevmContract({
				...clientContract.write.setNumber(100n),
				from: sender.address,
				addToBlockchain: true,
			})

			await expect(res).toCallContractFunction(client, clientContract, 'setNumber')
		})
	})

	describe('error handling', () => {
		it('should throw when transaction execution fails in unexpected way', async () => {
			try {
				// This test simulates passing invalid transaction data
				await expect('0xinvalid' as Address).toCallContractFunction(node, contract, 'setNumber')
				assert(false, 'should have thrown')
			} catch (error: any) {
				expect(error.message).toBe(
					'Transaction hash is undefined, you need to pass a transaction hash, receipt or call result, or a promise that resolves to one of those',
				)
			}
		})

		it('should provide a helpful error message when the function call does not match', async () => {
			try {
				await expect(
					contractHandler(node)({
						...contract.write.setNumber(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					.toCallContractFunction(node, contract, 'setAddress')
			} catch (error: any) {
				expect(error.message).toBe('Expected transaction to call function setAddress')
				expect(error.expected).toBe(`transaction calling function with selector ${toFunctionSelector('function setAddress(address)')}`);
				expect(error.actual).toStrictEqual([toFunctionSelector('function setNumber(uint256)')])
			}
		})

		it('should provide a helpful error message when the provided arguments do not match', async () => {
			try {
				await expect(
					contractHandler(node)({
						...contract.write.setNumber(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					.toCallContractFunction(node, contract, 'setNumber')
					.withFunctionArgs(200n)
			} catch (error: any) {
				expect(error.message).toBe('Expected transaction to call function with the specified arguments')
				expect(error.expected).toStrictEqual([200n])
				expect(error.actual).toStrictEqual({ 0: [100n] }) // we can have multiple calls with various calldata that will be listed here
			}
		})

		it('should provide a helpful error message when the provided namedarguments do not match', async () => {
			try {
				await expect(
					contractHandler(node)({
						...contract.write.setNumber(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					.toCallContractFunction(node, contract, 'setNumber')
					.withFunctionNamedArgs({ newValue: 200n })
			} catch (error: any) {
				expect(error.message).toBe('Expected transaction to call function with the specified arguments')
				expect(error.expected).toStrictEqual({ newValue: 200n })
				expect(error.actual).toStrictEqual({ 0: { newValue: 100n } }) // we can have multiple calls with various calldata that will be listed here
			}
		})
	})
})