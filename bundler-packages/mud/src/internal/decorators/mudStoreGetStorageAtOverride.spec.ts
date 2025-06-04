import { createLogger } from '@tevm/logger'
import { createMemoryClient } from '@tevm/memory-client'
import { MUDTestSystem } from '@tevm/test-utils'
import { type Address, type EIP1193RequestFn, pad } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'
import { state } from '../../../test/state.js'
import { mudStoreGetStorageAtOverride } from './mudStoreGetStorageAtOverride.js'

const testContract = MUDTestSystem.withAddress('0x5FbDB2315678afecb367f032d93F642f64180aa3')
const getState = () => state
const client = createMemoryClient()
const mudStoreRequestOverride = mudStoreGetStorageAtOverride(
	{ request: (async () => {}) as EIP1193RequestFn },
	'internal',
	createLogger({ name: '@tevm/mud', level: 'debug' }),
)({
	getState,
	storeAddress: testContract.address,
})

describe('mudStoreGetStorageAtOverride', () => {
	beforeEach(async () => {
		await client.tevmDeploy({
			abi: testContract.abi,
			bytecode: testContract.bytecode,
			addToBlockchain: true,
		})

		for (const values of Object.values(state.records.app.TestTable)) {
			await client.tevmContract({
				// @ts-expect-error - cannot type args
				...testContract.write.set(...Object.values(values)),
				addToBlockchain: true,
			})
		}
	})

	it('should calculate and return the correct value for any data slot from the client override', async () => {
		for (const { key1, key2 } of Object.values(state.records.app.TestTable)) {
			const { accessList } = await client.tevmContract({
				...testContract.read.get(key1, key2),
				addToBlockchain: true,
				createAccessList: true,
			})

			const slots = [...(accessList?.[testContract.address.toLowerCase() as Address] ?? [])]
			for (const slot of slots) {
				const value = await client.getStorageAt({ address: testContract.address, slot })
				if (!value) return
				// skip the storeAddress slot
				if (value.toLowerCase() === testContract.address.toLowerCase()) continue

				const actualStorage = pad(value, { size: 32 })
				const overrideStorage = await mudStoreRequestOverride({
					method: 'eth_getStorageAt',
					params: [testContract.address, slot],
					id: 1,
					jsonrpc: '2.0',
				})

				expect(actualStorage).toEqual(overrideStorage)
			}
		}
	})
})
