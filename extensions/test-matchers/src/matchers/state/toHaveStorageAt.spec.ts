import { deployHandler, setAccountHandler } from '@tevm/actions'
import { SimpleContract } from '@tevm/contract'
import { createMemoryClient } from '@tevm/memory-client'
import { createTevmNode } from '@tevm/node'
import { type Address, type Hex, parseEther, toHex } from '@tevm/utils'
import { beforeAll, describe, expect, it } from 'vitest'

describe('toHaveStorageAt', () => {
	const node = createTevmNode()
	const contract = {
		address: '0x' as Address,
		storage: {
			[toHex(0, { size: 32 })]: toHex(1, { size: 1 }),
			[toHex(1, { size: 32 })]: toHex(2, { size: 1 }),
			[toHex(2, { size: 32 })]: toHex(3, { size: 1 }),
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
		if (!createdAddress) throw new Error('Contract deployment failed')
		contract.address = createdAddress

		await setAccountHandler(node)({
			address: contract.address,
			state: contract.storage,
		})
	})

	describe('positive cases', () => {
		it('should pass for a single correct storage slot', async () => {
			const slot = toHex(0, { size: 32 })
			const value = contract.storage[slot]!
			await expect(contract).toHaveStorageAt(node, { slot, value })
		})

		it('should pass for multiple correct storage slots', async () => {
			const storageEntries = Object.entries(contract.storage).map(([slot, value]) => ({
				slot: slot as Hex,
				value,
			}))
			await expect(contract).toHaveStorageAt(node, storageEntries)
		})

		it('should work with address string', async () => {
			const slot = toHex(1, { size: 32 })
			const value = contract.storage[slot]!
			await expect(contract.address).toHaveStorageAt(node, { slot, value })
		})
	})

	describe('negative cases', () => {
		it('should fail for incorrect storage value', async () => {
			const slot = toHex(0, { size: 32 })
			await expect(expect(contract).toHaveStorageAt(node, { slot, value: '0x777' })).rejects.toThrowError(
				`Expected account ${contract.address} to have storage values at slots: ${slot}`,
			)
		})

		it('should fail for non-existent storage slot', async () => {
			const slot = toHex(99, { size: 32 })
			await expect(expect(contract).toHaveStorageAt(node, { slot, value: '0x01' })).rejects.toThrowError(
				`Expected account ${contract.address} to have storage values at slots: ${slot}`,
			)
		})

		it('should fail for multiple incorrect storage slots', async () => {
			const slot1 = toHex(0, { size: 32 })
			const slot2 = toHex(1, { size: 32 })
			await expect(
				expect(contract).toHaveStorageAt(node, [
					{ slot: slot1, value: '0x777' },
					{ slot: slot2, value: '0x888' },
				]),
			).rejects.toThrowError(`Expected account ${contract.address} to have storage values at slots: ${slot1}, ${slot2}`)
		})

		it('should fail for partial incorrect storage in array', async () => {
			const slot1 = toHex(0, { size: 32 })
			const slot2 = toHex(1, { size: 32 })
			await expect(
				expect(contract).toHaveStorageAt(node, [
					{ slot: slot1, value: contract.storage[slot1]! }, // correct
					{ slot: slot2, value: '0x888' }, // incorrect
				]),
			).rejects.toThrowError(`Expected account ${contract.address} to have storage values at slots: ${slot2}`)
		})

		it('should fail for a non-existent account', async () => {
			const nonExistentAddress = `0x${'3'.repeat(40)}` as Address
			const slot = toHex(0, { size: 32 })
			await expect(expect(nonExistentAddress).toHaveStorageAt(node, { slot, value: '0x01' })).rejects.toThrowError(
				`account ${nonExistentAddress} not found`,
			)
		})

		it('should provide the correct diff for single slot', async () => {
			const slot = toHex(0, { size: 32 })
			const expectedValue = '0x777'

			try {
				await expect(contract).toHaveStorageAt(node, { slot, value: expectedValue })
			} catch (error: any) {
				expect(error.message).toBe(`Expected account ${contract.address} to have storage values at slots: ${slot}`)
				expect(error.actual).toEqual([{ slot, value: contract.storage[slot]! }])
				expect(error.expected).toEqual([{ slot, value: expectedValue }])
			}
		})

		it('should provide the correct diff for multiple slots', async () => {
			const slot1 = toHex(0, { size: 32 })
			const slot2 = toHex(99, { size: 32 }) // non-existent
			const expectedValue1 = '0x777'
			const expectedValue2 = '0x888'

			try {
				await expect(contract).toHaveStorageAt(node, [
					{ slot: slot1, value: expectedValue1 },
					{ slot: slot2, value: expectedValue2 },
				])
			} catch (error: any) {
				expect(error.message).toBe(
					`Expected account ${contract.address} to have storage values at slots: ${slot1}, ${slot2}`,
				)
				expect(error.actual).toEqual([
					{ slot: slot1, value: contract.storage[slot1]! },
					{ slot: slot2, value: undefined },
				])
				expect(error.expected).toEqual([
					{ slot: slot1, value: expectedValue1 },
					{ slot: slot2, value: expectedValue2 },
				])
			}
		})
	})

	describe('.not modifier', () => {
		it('should pass with .not for incorrect storage values', async () => {
			const slot = toHex(0, { size: 32 })
			await expect(contract).not.toHaveStorageAt(node, { slot, value: '0x777' })
		})

		it('should pass with .not for non-existent storage slot', async () => {
			const slot = toHex(99, { size: 32 })
			await expect(contract).not.toHaveStorageAt(node, { slot, value: '0x01' })
		})

		it('should fail with .not for correct storage values', async () => {
			const slot = toHex(0, { size: 32 })
			const value = contract.storage[slot]!
			await expect(expect(contract).not.toHaveStorageAt(node, { slot, value })).rejects.toThrowError(
				`Expected account ${contract.address} not to have storage values at the specified slots`,
			)
		})

		it('should pass with .not for partially incorrect storage array', async () => {
			const slot1 = toHex(0, { size: 32 })
			const slot2 = toHex(1, { size: 32 })
			await expect(contract).not.toHaveStorageAt(node, [
				{ slot: slot1, value: contract.storage[slot1]! }, // correct
				{ slot: slot2, value: '0x888' }, // incorrect
			])
		})
	})

	// TODO: unskip once eth_getProof is implemented
	describe.skip('provider', () => {
		it('should work with an EIP1193 client', async () => {
			const client = createMemoryClient()
			await client.tevmSetAccount({
				...contract,
				state: contract.storage,
			})
			const slot = toHex(0, { size: 32 })
			const value = contract.storage[slot]!
			await expect(contract).toHaveStorageAt(client, { slot, value })
		})
	})
})
