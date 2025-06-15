import { type Contract } from '@tevm/contract'
import { createMemoryClient } from '@tevm/memory-client'
import { SimpleContract } from '@tevm/test-utils'
import type { Address, Hex } from 'viem'
import { toEventSelector } from 'viem'
import { assert, beforeEach, describe, expect, it } from 'vitest'

const client = createMemoryClient()

describe('toEmit', () => {
	let contract: Contract<'SimpleContract', typeof SimpleContract.humanReadableAbi, Address, Hex, Hex>

	beforeEach(async () => {
		const { createdAddress } = await client.tevmDeploy({ ...SimpleContract.deploy(0n), addToBlockchain: true })
		assert(createdAddress, 'createdAddress is undefined')
		contract = SimpleContract.withAddress(createdAddress)
	})

	describe('basic event detection', () => {
		it('should detect event with contract + event name', async () => {
			await expect(client.tevmContract(contract.write.set(100n))).toEmit(contract, 'ValueSet')
			await expect(client.tevmContract(contract.write.set(100n))).toEmit(contract, 'ValueSet')
		})

		it('should detect event with signature string', async () => {
			await expect(client.tevmContract(contract.write.set(100n))).toEmit('ValueSet(uint256)')
			await expect(client.tevmContract(contract.write.set(100n))).toEmit('ValueSet(uint256 newValue)')
		})

		it('should detect event with hex selector', async () => {
			await expect(client.tevmContract(contract.write.set(100n))).toEmit(toEventSelector('ValueSet(uint256)'))
			await expect(client.tevmContract(contract.write.set(100n))).toEmit(toEventSelector('ValueSet(uint256 newValue)'))
		})

		it('should fail when event not emitted', async () => {
			// Call method that doesn't emit ValueSet
			await expect(expect(client.tevmContract(contract.read.get())).toEmit(contract, 'ValueSet')).rejects.toThrow()
		})

		it('should fail when wrong event name', async () => {
			await expect(expect(client.tevmContract(contract.write.set(100n))).toEmit('NonExistentEvent')).rejects.toThrow()
		})
	})

	describe('withEventArgs argument matching', () => {
		it('should pass with correct arguments', async () => {
			await expect(client.tevmContract(contract.write.set(100n)))
				.toEmit(contract, 'ValueSet')
				.withEventArgs(100n)
		})

		it('should fail with wrong arguments', async () => {
			await expect(
				expect(client.tevmContract(contract.write.set(100n)))
					.toEmit(contract, 'ValueSet')
					.withEventArgs(200n),
			).rejects.toThrow()
		})

		it('should fail with wrong number of arguments', async () => {
			await expect(
				expect(client.tevmContract(contract.write.set(100n)))
					.toEmit(contract, 'ValueSet')
					.withEventArgs(100n, 200n),
			).rejects.toThrow()
		})

		it('should fail with both right and wrong arguments', async () => {
			try {
				await expect(client.tevmContract(contract.write.set(100n)))
					.toEmit(contract, 'ValueSet')
					.withEventArgs(100n, 200n)
			} catch (error: any) {
				expect(error.message).toBe(
					"Expected event ValueSet to be emitted with the specified arguments, but it wasn't found in any of the 1 emitted events",
				)
				expect(error.actual).toEqual([100n])
			}
		})

		it('should fail without contract', async () => {
			await expect(
				expect(client.tevmContract(contract.write.set(100n)))
					.toEmit('ValueSet(uint256)')
					// @ts-expect-error - 'withEventArgs' does not exist on type 'ChainableAssertion'.
					.withEventArgs(100n),
			).rejects.toThrow('withEventArgs() requires a contract with abi and event name')
		})
	})

	describe('withEventNamedArgs argument matching', () => {
		it('should pass with correct named arguments', async () => {
			await expect(client.tevmContract(contract.write.set(100n)))
				.toEmit(contract, 'ValueSet')
				.withEventNamedArgs({ newValue: 100n })
		})

		it('should pass with partial named arguments', async () => {
			// Even if event has multiple args, partial matching should work
			await expect(client.tevmContract(contract.write.set(100n)))
				.toEmit(contract, 'ValueSet')
				.withEventNamedArgs({}) // Empty object should pass
		})

		it('should fail with wrong named arguments', async () => {
			try {
				await expect(client.tevmContract(contract.write.set(100n)))
					.toEmit(contract, 'ValueSet')
					.withEventNamedArgs({ newValue: 200n })
			} catch (error: any) {
				expect(error.message).toBe(
					"Expected event ValueSet to be emitted with the specified named arguments, but it wasn't found in any of the 1 emitted events",
				)
				expect(error.actual).toEqual([{ newValue: 100n }])
			}
		})

		it('should fail with invalid argument names', async () => {
			try {
				await expect(client.tevmContract(contract.write.set(100n)))
					.toEmit(contract, 'ValueSet')
					// @ts-expect-error - 'invalidArg' does not exist in the event inputs
					.withEventNamedArgs({ invalidArg: 100n })
			} catch (error: any) {
				expect(error.message).toBe(
					"Expected event ValueSet to be emitted with the specified named arguments, but it wasn't found in any of the 1 emitted events",
				)
				expect(error.actual).toEqual([{ newValue: 100n }])
			}
		})

		it('should fail with both right and wrong arguments', async () => {
			try {
				await expect(client.tevmContract(contract.write.set(100n)))
					.toEmit(contract, 'ValueSet')
					// @ts-expect-error - 'invalidArg' does not exist in the event inputs
					.withEventNamedArgs({ newValue: 100n, invalidArg: 200n })
			} catch (error: any) {
				expect(error.message).toBe(
					"Expected event ValueSet to be emitted with the specified named arguments, but it wasn't found in any of the 1 emitted events",
				)
				expect(error.actual).toEqual([{ newValue: 100n }])
			}
		})

		it('should fail without contract', async () => {
			await expect(
				expect(client.tevmContract(contract.write.set(100n)))
					.toEmit('ValueSet(uint256)')
					// @ts-expect-error - 'withEventNamedArgs' does not exist on type 'ChainableAssertion'.
					.withEventNamedArgs({ newValue: 100n }),
			).rejects.toThrow('withEventNamedArgs() requires a contract with abi and event name')
		})
	})

	describe('negation support', () => {
		it('should support not.toEmit - event should not be emitted at all', async () => {
			// Transaction that doesn't emit ValueSet
			await expect(client.tevmContract(contract.read.get())).not.toEmit(contract, 'ValueSet')
		})

		it('should fail not.toEmit when event is actually emitted', async () => {
			await expect(
				expect(client.tevmContract(contract.write.set(100n))).not.toEmit(contract, 'ValueSet'),
			).rejects.toThrow()
		})

		it('should support not.toEmit with signature string', async () => {
			await expect(client.tevmContract(contract.read.get())).not.toEmit('ValueSet(uint256)')
		})

		it('should support not.toEmit with hex selector', async () => {
			const selector = toEventSelector('ValueSet(uint256)')
			await expect(client.tevmContract(contract.read.get())).not.toEmit(selector)
		})
	})
})
