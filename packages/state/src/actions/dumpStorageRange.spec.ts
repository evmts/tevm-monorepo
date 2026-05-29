import { createAddress } from '@tevm/address'
import { InvalidParamsError } from '@tevm/errors'
import { SimpleContract } from '@tevm/test-utils'
import { createAccount } from '@tevm/utils'
import { type Hex, hexToBigInt, hexToBytes, numberToBytes } from 'viem'
import { describe, expect, it } from 'vitest'
import { createBaseState } from '../createBaseState.js'
import { dumpStorageRange } from './dumpStorageRange.js'
import { putAccount } from './putAccount.js'
import { putContractCode } from './putContractCode.js'
import { putContractStorage } from './putContractStorage.js'

describe(dumpStorageRange.name, () => {
	it('should dump storage from a range', async () => {
		const state = createBaseState({})
		const address = createAddress(9876543210)
		await putAccount(state)(
			address,
			createAccount({
				nonce: 2n,
				balance: 420n,
			}),
		)
		await putContractCode(state)(address, hexToBytes(SimpleContract.deployedBytecode))
		await putContractStorage(state)(address, numberToBytes(0, { size: 32 }), numberToBytes(420, { size: 32 }))
		expect(await dumpStorageRange(state)(address, 0n, 20)).toMatchSnapshot()
	})

	it('supports start key and limit', async () => {
		const state = createBaseState({})
		const address = createAddress(9876543210)
		await putAccount(state)(
			address,
			createAccount({
				nonce: 2n,
				balance: 420n,
			}),
		)
		await putContractCode(state)(address, hexToBytes(SimpleContract.deployedBytecode))
		await putContractStorage(state)(address, numberToBytes(0, { size: 32 }), numberToBytes(420, { size: 32 }))
		await putContractStorage(state)(address, numberToBytes(1, { size: 32 }), numberToBytes(420, { size: 32 }))
		await putContractStorage(state)(address, numberToBytes(2, { size: 32 }), numberToBytes(420, { size: 32 }))
		await putContractStorage(state)(address, numberToBytes(3, { size: 32 }), numberToBytes(420, { size: 32 }))
		await putContractStorage(state)(address, numberToBytes(4, { size: 32 }), numberToBytes(420, { size: 32 }))
		await putContractStorage(state)(address, numberToBytes(5, { size: 32 }), numberToBytes(420, { size: 32 }))
		await putContractStorage(state)(address, numberToBytes(6, { size: 32 }), numberToBytes(420, { size: 32 }))

		const getPaginatedStorage = async () => {
			let startKey: bigint | null = 0n
			const limit = 2
			const storage = {}
			while (startKey !== null) {
				const nextStorage = await dumpStorageRange(state)(address, startKey, limit)
				startKey = nextStorage.nextKey === null ? null : hexToBigInt(nextStorage.nextKey as Hex)
				Object.assign(storage, nextStorage.storage)
			}
			return storage
		}

		expect(await dumpStorageRange(state)(address, 0n, 20)).toMatchInlineSnapshot(`
			{
			  "nextKey": null,
			  "storage": {
			    "0000000000000000000000000000000000000000000000000000000000000000": {
			      "key": "0000000000000000000000000000000000000000000000000000000000000000",
			      "value": "0x01a4",
			    },
			    "0000000000000000000000000000000000000000000000000000000000000001": {
			      "key": "0000000000000000000000000000000000000000000000000000000000000001",
			      "value": "0x01a4",
			    },
			    "0000000000000000000000000000000000000000000000000000000000000002": {
			      "key": "0000000000000000000000000000000000000000000000000000000000000002",
			      "value": "0x01a4",
			    },
			    "0000000000000000000000000000000000000000000000000000000000000003": {
			      "key": "0000000000000000000000000000000000000000000000000000000000000003",
			      "value": "0x01a4",
			    },
			    "0000000000000000000000000000000000000000000000000000000000000004": {
			      "key": "0000000000000000000000000000000000000000000000000000000000000004",
			      "value": "0x01a4",
			    },
			    "0000000000000000000000000000000000000000000000000000000000000005": {
			      "key": "0000000000000000000000000000000000000000000000000000000000000005",
			      "value": "0x01a4",
			    },
			    "0000000000000000000000000000000000000000000000000000000000000006": {
			      "key": "0000000000000000000000000000000000000000000000000000000000000006",
			      "value": "0x01a4",
			    },
			  },
			}
		`)
		expect(await getPaginatedStorage()).toMatchInlineSnapshot(`
			{
			  "0000000000000000000000000000000000000000000000000000000000000000": {
			    "key": "0000000000000000000000000000000000000000000000000000000000000000",
			    "value": "0x01a4",
			  },
			  "0000000000000000000000000000000000000000000000000000000000000001": {
			    "key": "0000000000000000000000000000000000000000000000000000000000000001",
			    "value": "0x01a4",
			  },
			  "0000000000000000000000000000000000000000000000000000000000000002": {
			    "key": "0000000000000000000000000000000000000000000000000000000000000002",
			    "value": "0x01a4",
			  },
			  "0000000000000000000000000000000000000000000000000000000000000003": {
			    "key": "0000000000000000000000000000000000000000000000000000000000000003",
			    "value": "0x01a4",
			  },
			  "0000000000000000000000000000000000000000000000000000000000000004": {
			    "key": "0000000000000000000000000000000000000000000000000000000000000004",
			    "value": "0x01a4",
			  },
			  "0000000000000000000000000000000000000000000000000000000000000005": {
			    "key": "0000000000000000000000000000000000000000000000000000000000000005",
			    "value": "0x01a4",
			  },
			  "0000000000000000000000000000000000000000000000000000000000000006": {
			    "key": "0000000000000000000000000000000000000000000000000000000000000006",
			    "value": "0x01a4",
			  },
			}
		`)
	})

	it('handles storage slots containing hex letters (>= 0x0a) and orders them correctly', async () => {
		const state = createBaseState({})
		const address = createAddress(9876543210)
		await putAccount(state)(
			address,
			createAccount({
				nonce: 2n,
				balance: 420n,
			}),
		)
		await putContractCode(state)(address, hexToBytes(SimpleContract.deployedBytecode))
		// Slots that contain hex letters / span the decimal-vs-hex boundary.
		// 0x0a (10) contains a letter and crashes hexToBigInt without a 0x prefix.
		// 0x10 (16) is all-digit and is mis-parsed as decimal 10 without the prefix,
		// which would order it before 0x0a and break pagination.
		await putContractStorage(state)(address, numberToBytes(0x10, { size: 32 }), numberToBytes(0x10, { size: 32 }))
		await putContractStorage(state)(address, numberToBytes(0x0a, { size: 32 }), numberToBytes(0x0a, { size: 32 }))
		await putContractStorage(state)(address, numberToBytes(0x1f, { size: 32 }), numberToBytes(0x1f, { size: 32 }))
		await putContractStorage(state)(address, numberToBytes(0x02, { size: 32 }), numberToBytes(0x02, { size: 32 }))

		// Must not throw (it does without the 0x-prefix fix) and keys must be sorted numerically.
		const result = await dumpStorageRange(state)(address, 0n, 20)
		const keys = Object.keys(result.storage).map((k) => hexToBigInt(`0x${k}` as Hex))
		expect(keys).toEqual([0x02n, 0x0an, 0x10n, 0x1fn])

		// startKey filtering must use hex semantics: starting at 0x0a should include 0x0a, 0x10, 0x1f
		// but exclude 0x02. Without the fix, 0x10 (parsed as decimal 10) would be wrongly excluded.
		const fromA = await dumpStorageRange(state)(address, 0x0an, 20)
		const fromAKeys = Object.keys(fromA.storage).map((k) => hexToBigInt(`0x${k}` as Hex))
		expect(fromAKeys).toEqual([0x0an, 0x10n, 0x1fn])
	})

	it('paginates correctly across slots with hex letters', async () => {
		const state = createBaseState({})
		const address = createAddress(9876543210)
		await putAccount(state)(
			address,
			createAccount({
				nonce: 2n,
				balance: 420n,
			}),
		)
		await putContractCode(state)(address, hexToBytes(SimpleContract.deployedBytecode))
		const slots = [0x01, 0x0a, 0x0f, 0x10, 0x2c]
		for (const slot of slots) {
			await putContractStorage(state)(address, numberToBytes(slot, { size: 32 }), numberToBytes(slot, { size: 32 }))
		}

		const collected: bigint[] = []
		let startKey: bigint | null = 0n
		const limit = 2
		while (startKey !== null) {
			const next = await dumpStorageRange(state)(address, startKey, limit)
			for (const k of Object.keys(next.storage)) {
				collected.push(hexToBigInt(`0x${k}` as Hex))
			}
			// nextKey is returned as an unprefixed hex key, so prefix it before parsing.
			startKey = next.nextKey === null ? null : hexToBigInt(`0x${next.nextKey}` as Hex)
		}
		expect(collected).toEqual([0x01n, 0x0an, 0x0fn, 0x10n, 0x2cn])
	})

	it('should throw error when no storage exists for address', () => {
		const state = createBaseState({})
		const nonExistentAddress = createAddress('0x1234567890123456789012345678901234567890')

		// Address doesn't have any storage entries, should throw
		expect(() => {
			dumpStorageRange(state)(nonExistentAddress, 0n, 10)
		}).toThrow(InvalidParamsError)

		// Verify error message contains the address
		try {
			dumpStorageRange(state)(nonExistentAddress, 0n, 10)
		} catch (e: any) {
			expect(e.message).toContain('No storage found at address 0x1234567890123456789012345678901234567890')
		}
	})
})
