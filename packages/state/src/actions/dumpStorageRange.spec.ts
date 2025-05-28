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
