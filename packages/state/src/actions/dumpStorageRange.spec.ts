import { describe, expect, it } from 'vitest'
import { dumpStorageRange } from './dumpStorageRange.js'
import { createBaseState } from '../createBaseState.js'
import { createAddress } from '@tevm/address'
import { putContractCode } from './putContractCode.js'
import { hexToBigInt, hexToBytes, numberToBytes, type Hex } from 'viem'
import { SimpleContract } from '@tevm/test-utils'
import { putContractStorage } from './putContractStorage.js'

describe(dumpStorageRange.name, () => {
	it('should dump storage from a range', async () => {
		const state = createBaseState({})
		const address = createAddress(9876543210)
		await putContractCode(state)(address, hexToBytes(SimpleContract.deployedBytecode))
		await putContractStorage(state)(address, numberToBytes(0, { size: 32 }), numberToBytes(420, { size: 32 }))
		expect(await dumpStorageRange(state)(address, 0n, 20)).toMatchSnapshot()
	})

	it('supports start key and limit', async () => {
		const state = createBaseState({})
		const address = createAddress(9876543210)
		await putContractCode(state)(address, hexToBytes(SimpleContract.deployedBytecode))
		await putContractStorage(state)(address, numberToBytes(0, { size: 32 }), numberToBytes(420, { size: 32 }))
		await putContractStorage(state)(address, numberToBytes(1, { size: 32 }), numberToBytes(420, { size: 32 }))
		await putContractStorage(state)(address, numberToBytes(2, { size: 32 }), numberToBytes(420, { size: 32 }))
		await putContractStorage(state)(address, numberToBytes(3, { size: 32 }), numberToBytes(420, { size: 32 }))
		await putContractStorage(state)(address, numberToBytes(4, { size: 32 }), numberToBytes(420, { size: 32 }))
		await putContractStorage(state)(address, numberToBytes(5, { size: 32 }), numberToBytes(420, { size: 32 }))
		await putContractStorage(state)(address, numberToBytes(6, { size: 32 }), numberToBytes(420, { size: 32 }))

		const getPaginatedStorage = async () => {
			let startKey = 0n
			const limit = 2
			const storage = {}
			while (startKey !== null) {
				const nextStorage = await dumpStorageRange(state)(address, startKey, limit)
				startKey = hexToBigInt(nextStorage.nextKey as Hex)
				Object.assign(storage, nextStorage.storage)
			}
			return storage
		}

		expect(await dumpStorageRange(state)(address, 0n, 20)).toMatchSnapshot(await getPaginatedStorage())
	})
})
