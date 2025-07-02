import { contractHandler, deployHandler } from '@tevm/actions'
import { SimpleContract } from '@tevm/contract'
import { createMemoryClient } from '@tevm/memory-client'
import { createTevmNode } from '@tevm/node'
import { PREFUNDED_ACCOUNTS } from '@tevm/utils'
import type { Address } from 'viem'
import { toFunctionSelector } from 'viem'
import { assert, beforeEach, describe, expect, it } from 'vitest'

const node = createTevmNode()
const sender = PREFUNDED_ACCOUNTS[0]

describe('toCallContractFunction', () => {
	let simpleContract: ReturnType<typeof SimpleContract.withAddress>

	beforeEach(async () => {
		// Deploy SimpleContract using deployHandler
		const { createdAddress: simpleContractAddress } = await deployHandler(node)({
			...SimpleContract.deploy(42n), // Deploy with initial value of 42
			addToBlockchain: true,
		})
		assert(simpleContractAddress, 'simpleContractAddress is undefined')
		simpleContract = SimpleContract.withAddress(simpleContractAddress)
	})

	describe('basic function call detection', () => {
		it.only('should detect function call with contract + function name', async () => {
			await expect(
				contractHandler(node)({
					...simpleContract.write.set(100n),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toCallContractFunction(node, simpleContract, 'set')
		})

		it('should detect function call with signature string', async () => {
			await expect(
				contractHandler(node)({
					...simpleContract.write.set(100n),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toCallContractFunction(node, simpleContract, 'set(uint256)')
		})

		it('should detect function call with hex selector', async () => {
			const selector = toFunctionSelector('function set(uint256)')
			await expect(
				contractHandler(node)({
					...simpleContract.write.set(100n),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toCallContractFunction(node, simpleContract, selector)
		})

		it('should detect function calls with different values', async () => {
			await expect(
				contractHandler(node)({
					...simpleContract.write.set(42n),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toCallContractFunction(node, simpleContract, 'set')
		})

		it('should fail when wrong function name', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...simpleContract.write.set(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				).toCallContractFunction(node, simpleContract, 'get'), // Wrong function
			).rejects.toThrow('Expected transaction to call function get on contract')
		})

		it('should fail when wrong function signature', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...simpleContract.write.set(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				).toCallContractFunction(node, simpleContract, 'get()'), // Wrong function signature
			).rejects.toThrow('Expected transaction to call function')
		})

		it('should fail when wrong function selector', async () => {
			const wrongSelector = toFunctionSelector('function get()')
			await expect(() =>
				expect(
					contractHandler(node)({
						...simpleContract.write.set(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				).toCallContractFunction(node, simpleContract, wrongSelector),
			).rejects.toThrow('Expected transaction to call function')
		})

		it('should fail when transaction calls different contract', async () => {
			// Deploy a second contract for this test
			const { createdAddress: secondContractAddress } = await deployHandler(node)({
				...SimpleContract.deploy(1n),
				addToBlockchain: true,
			})
			assert(secondContractAddress, 'secondContractAddress is undefined')
			const secondContract = SimpleContract.withAddress(secondContractAddress)

			await expect(() =>
				expect(
					contractHandler(node)({
						...simpleContract.write.set(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				).toCallContractFunction(node, secondContract, 'set'), // Different contract address
			).rejects.toThrow(`Expected transaction to call function set on contract ${secondContract.address}`)
		})
	})

	describe('withFunctionArgs argument matching', () => {
		it('should pass with correct arguments for single parameter', async () => {
			await expect(
				contractHandler(node)({
					...simpleContract.write.set(100n),
					from: sender.address,
					addToBlockchain: true,
				}),
			)
				.toCallContractFunction(node, simpleContract, 'set')
				.withFunctionArgs(100n)
		})

		it('should pass with different argument values', async () => {
			await expect(
				contractHandler(node)({
					...simpleContract.write.set(256n),
					from: sender.address,
					addToBlockchain: true,
				}),
			)
				.toCallContractFunction(node, simpleContract, 'set')
				.withFunctionArgs(256n)
		})

		it('should fail with wrong arguments', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...simpleContract.write.set(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					.toCallContractFunction(node, simpleContract, 'set')
					.withFunctionArgs(200n), // Wrong argument value
			).rejects.toThrow('Expected transaction to call function with the specified arguments')
		})

		it('should fail with too many arguments', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...simpleContract.write.set(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					.toCallContractFunction(node, simpleContract, 'set')
					.withFunctionArgs(100n, 200n), // Too many arguments - set only takes one
			).rejects.toThrow('Expected transaction to call function with the specified arguments')
		})

		it('should fail without contract for signature/selector', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...simpleContract.write.set(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					.toCallContractFunction(node, simpleContract, 'set(uint256)')
					// @ts-expect-error - withFunctionArgs is not a function on ChainableAssertion
					.withFunctionArgs(200n),
			).rejects.toThrow('withFunctionArgs() requires a contract with abi and function name')
		})
	})

	describe('withFunctionNamedArgs argument matching', () => {
		it('should pass with correct named arguments for single parameter', async () => {
			await expect(
				contractHandler(node)({
					...simpleContract.write.set(100n),
					from: sender.address,
					addToBlockchain: true,
				}),
			)
				.toCallContractFunction(node, simpleContract, 'set')
				.withFunctionNamedArgs({ newValue: 100n })
		})

		it('should pass with empty object (no constraints)', async () => {
			await expect(
				contractHandler(node)({
					...simpleContract.write.set(42n),
					from: sender.address,
					addToBlockchain: true,
				}),
			)
				.toCallContractFunction(node, simpleContract, 'set')
				.withFunctionNamedArgs({}) // Empty object should pass
		})

		it('should fail with wrong named arguments', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...simpleContract.write.set(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					.toCallContractFunction(node, simpleContract, 'set')
					.withFunctionNamedArgs({ newValue: 200n }), // Wrong value
			).rejects.toThrow('Expected transaction to call function with the specified arguments')
		})

		it('should fail with invalid argument names', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...simpleContract.write.set(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					.toCallContractFunction(node, simpleContract, 'set')
					// @ts-expect-error - 'invalidArg' does not exist in the function inputs
					.withFunctionNamedArgs({ invalidArg: 100n }),
			).rejects.toThrow('Expected transaction to call function with the specified arguments')
		})

		it('should fail with both right and wrong arguments', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...simpleContract.write.set(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					.toCallContractFunction(node, simpleContract, 'set')
					// @ts-expect-error - 'invalidArg' does not exist in the function inputs
					.withFunctionNamedArgs({ newValue: 100n, invalidArg: 200n }),
			).rejects.toThrow('Expected transaction to call function with the specified arguments')
		})

		it('should fail without contract', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...simpleContract.write.set(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					.toCallContractFunction(node, simpleContract, 'set(uint256)')
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
						...simpleContract.write.set(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					.toCallContractFunction(node, simpleContract, 'NonExistentFunction'),
			).rejects.toThrow('Function NonExistentFunction not found in contract ABI')
		})

		it('should require function name as second argument', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...simpleContract.write.set(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				)
					// @ts-expect-error - Missing function name
					.toCallContractFunction(node, simpleContract),
			).rejects.toThrow('You need to provide a function name as a second argument')
		})
	})

	describe('negation support', () => {
		it('should support not.toCallContractFunction - different function', async () => {
			await expect(
				contractHandler(node)({
					...simpleContract.write.set(100n),
					from: sender.address,
					addToBlockchain: true,
				}),
			).not.toCallContractFunction(node, simpleContract, 'get') // Different function
		})

		it('should support not.toCallContractFunction - different contract', async () => {
			// Deploy a second contract for this test
			const { createdAddress: secondContractAddress } = await deployHandler(node)({
				...SimpleContract.deploy(1n),
				addToBlockchain: true,
			})
			assert(secondContractAddress, 'secondContractAddress is undefined')
			const secondContract = SimpleContract.withAddress(secondContractAddress)

			await expect(
				contractHandler(node)({
					...simpleContract.write.set(100n),
					from: sender.address,
					addToBlockchain: true,
				}),
			).not.toCallContractFunction(node, secondContract, 'set')
		})

		it('should fail not.toCallContractFunction when function matches', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...simpleContract.write.set(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				).not.toCallContractFunction(node, simpleContract, 'set'),
			).rejects.toThrow(`Expected transaction not to call function set on contract ${simpleContract.address}`)
		})

		it('should fail not.toCallContractFunction when signature matches', async () => {
			await expect(() =>
				expect(
					contractHandler(node)({
						...simpleContract.write.set(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				).not.toCallContractFunction(node, simpleContract, 'set(uint256)'),
			).rejects.toThrow('Expected transaction not to call function')
		})

		it('should fail not.toCallContractFunction when selector matches', async () => {
			const selector = toFunctionSelector('function set(uint256)')
			await expect(() =>
				expect(
					contractHandler(node)({
						...simpleContract.write.set(100n),
						from: sender.address,
						addToBlockchain: true,
					}),
				).not.toCallContractFunction(node, simpleContract, selector),
			).rejects.toThrow('Expected transaction not to call function')
		})
	})

	describe('transaction types', () => {
		it('should work with contract call result', async () => {
			const result = await contractHandler(node)({
				...simpleContract.write.set(100n),
				from: sender.address,
				addToBlockchain: true,
			})
			await expect(result).toCallContractFunction(node, simpleContract, 'set')
		})

		it('should work with transaction hash', async () => {
			const { txHash } = await contractHandler(node)({
				...simpleContract.write.set(100n),
				from: sender.address,
				addToBlockchain: true,
			})
			await expect(txHash).toCallContractFunction(node, simpleContract, 'set')
		})

		it('should work with promise that resolves to call result', async () => {
			await expect(
				contractHandler(node)({
					...simpleContract.write.set(100n),
					from: sender.address,
					addToBlockchain: true,
				}),
			).toCallContractFunction(node, simpleContract, 'set')
		})

		it('should work with promise that resolves to transaction hash', async () => {
			await expect(
				contractHandler(node)({
					...simpleContract.write.set(100n),
					from: sender.address,
					addToBlockchain: true,
				}).then((res) => res.txHash),
			).toCallContractFunction(node, simpleContract, 'set')
		})
	})

	describe('with memory client', () => {
		it.skip('should work with an eip1193 client', async () => {
			const client = createMemoryClient()

			// Deploy contract in client
			const { createdAddress: clientContractAddress } = await client.tevmDeploy({
				...SimpleContract.deploy(42n),
				addToBlockchain: true,
			})
			assert(clientContractAddress, 'Client contract address is undefined')
			const clientContract = SimpleContract.withAddress(clientContractAddress)

			// Call contract function
			const res = await client.tevmContract({
				...clientContract.write.set(100n),
				from: sender.address,
				addToBlockchain: true,
			})

			await expect(res).toCallContractFunction(client, clientContract, 'set')
		})
	})

	describe('error handling', () => {
		it('should throw when transaction execution fails in unexpected way', async () => {
			try {
				// This test simulates passing invalid transaction data
				await expect('0xinvalid' as Address).toCallContractFunction(node, simpleContract, 'set')
				assert(false, 'should have thrown')
			} catch (error: any) {
				expect(error.message).toContain(
					'Expected transaction to call a contract function, but a different error was thrown',
				)
			}
		})

		it('should handle invalid object gracefully', async () => {
			await expect(() => expect({}).toCallContractFunction(node, simpleContract, 'set')).rejects.toThrow(
				'Transaction hash is undefined, you need to pass a transaction hash, receipt or call result, or a promise that resolves to one of those',
			)
		})
	})
})