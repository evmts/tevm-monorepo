import { deployHandler, setAccountHandler } from '@tevm/actions'
import { SimpleContract } from '@tevm/contract'
import { createMemoryClient } from '@tevm/memory-client'
import { createTevmNode } from '@tevm/node'
import { type Address, type Hex, parseEther, toHex } from 'viem'
import { assert, beforeAll, describe, expect, it } from 'vitest'

describe('toHaveState', () => {
	const node = createTevmNode()
	const contract = {
		address: '0x' as Address,
		storage: {
			[toHex(0, { size: 32 })]: toHex(1, { size: 1 }),
			[toHex(1, { size: 32 })]: toHex(2, { size: 1 }),
		},
	}
	const account = {
		address: `0x${'1'.repeat(40)}` as Address,
		balance: parseEther('1'),
		nonce: 10n,
	}

	beforeAll(async () => {
		// Setup EOA
		await setAccountHandler(node)(account)

		// Setup contract
		const { createdAddress } = await deployHandler(node)({
			...SimpleContract.deploy(69n),
			addToBlockchain: true,
		})
		assert(createdAddress)
		contract.address = createdAddress

		await setAccountHandler(node)({
			address: contract.address,
			state: contract.storage,
		})
	})

	describe('positive cases', () => {
		it('should pass for correct balance', async () => {
			await expect(account).toHaveState(node, { balance: account.balance })
		})

		it('should pass for correct nonce', async () => {
			await expect(account).toHaveState(node, { nonce: account.nonce })
		})

		it('should pass for correct bytecode', async () => {
			await expect(contract).toHaveState(node, { deployedBytecode: SimpleContract.deployedBytecode })
		})

		it('should pass for a single correct storage slot', async () => {
			for (const [slot, value] of Object.entries(contract.storage)) {
				await expect(contract).toHaveState(node, {
					storage: { [slot]: value },
				})
			}
		})

		it('should pass for multiple correct storage slots', async () => {
			await expect(contract).toHaveState(node, {
				storage: contract.storage,
			})
		})

		it('should pass for multiple correct properties including storage', async () => {
			await expect(contract).toHaveState(node, {
				deployedBytecode: SimpleContract.deployedBytecode,
				storage: contract.storage,
			})
		})
	})

	describe('negative cases', () => {
		it('should fail for incorrect balance', async () => {
			await expect(expect(account).toHaveState(node, { balance: account.balance + 1n })).rejects.toThrowError(
				`Expected account ${account.address} to have state but received mismatched state at keys: balance`,
			)
		})

		it('should fail for incorrect nonce', async () => {
			await expect(expect(account).toHaveState(node, { nonce: account.nonce + 1n })).rejects.toThrowError(
				`Expected account ${account.address} to have state but received mismatched state at keys: nonce`,
			)
		})

		it('should fail for incorrect bytecode', async () => {
			await expect(expect(contract).toHaveState(node, { deployedBytecode: '0x1234' as Hex })).rejects.toThrowError(
				`Expected account ${contract.address} to have state but received mismatched state at keys: deployedBytecode`,
			)
		})

		it('should fail for incorrect storage value', async () => {
			await expect(expect(contract).toHaveState(node, { storage: { [toHex(0)]: '0x777' } })).rejects.toThrowError(
				`Expected account ${contract.address} to have state but received mismatched state at keys: storage`,
			)
		})

		it('should fail if a key is correct but storage is not', async () => {
			await expect(
				expect(contract).toHaveState(node, {
					deployedBytecode: SimpleContract.deployedBytecode,
					storage: { [Object.keys(contract.storage)[0] as Hex]: '0x00' },
				}),
			).rejects.toThrowError(
				`Expected account ${contract.address} to have state but received mismatched state at keys: storage`,
			)
		})

		it('should fail if storage is correct but another key is not', async () => {
			await expect(
				expect(contract).toHaveState(node, {
					nonce: 99n,
					storage: contract.storage,
				}),
			).rejects.toThrowError(
				`Expected account ${contract.address} to have state but received mismatched state at keys: nonce`,
			)
		})

		it('should fail if multiple keys are incorrect', async () => {
			await expect(
				expect(account).toHaveState(node, { balance: account.balance + 1n, nonce: account.nonce + 1n }),
			).rejects.toThrowError(
				`Expected account ${account.address} to have state but received mismatched state at keys: balance, nonce`,
			)
		})

		it('should fail for a non-existent account', async () => {
			const nonExistentAddress = `0x${'3'.repeat(40)}` as Address
			await expect(expect(nonExistentAddress).toHaveState(node, { balance: 1n })).rejects.toThrowError(
				`account ${nonExistentAddress} not found`,
			)
		})

		it('should provide the correct diff', async () => {
			const expected = {
				balance: 0n,
				nonce: 999n,
				storage: {
					[toHex(0, { size: 32 })]: '0x777',
					[toHex(100, { size: 32 })]: '0x888',
				},
			} as const

			try {
				await expect(contract).toHaveState(node, expected)
			} catch (error: any) {
				expect(error.message).toBe(
					`Expected account ${contract.address} to have state but received mismatched state at keys: nonce, storage`,
				)
				expect(error.actual).toMatchObject({
					storage: {
						[toHex(0, { size: 32 })]: contract.storage[toHex(0, { size: 32 })],
						[toHex(100, { size: 32 })]: undefined,
					},
				})
				expect(error.expected).toMatchObject(expected)
			}
		})
	})

	describe('.not modifier', () => {
		it('should pass with .not for incorrect properties', async () => {
			await expect(account).not.toHaveState(node, { balance: account.balance + 1n })
			await expect(account).not.toHaveState(node, { nonce: account.nonce + 1n })
		})

		it('should fail with .not for correct properties', async () => {
			await expect(expect(account).not.toHaveState(node, { balance: account.balance })).rejects.toThrowError(
				`Expected account ${account.address} not to have state`,
			)
		})
	})

	// TODO: unskip once eth_getProof is implemented
	describe.skip('provider', () => {
		it('should work with an EIP1193 client', async () => {
			const client = createMemoryClient()
			await client.tevmSetAccount(account)
			await expect(account).toHaveState(client, { nonce: account.nonce })
		})
	})
})
