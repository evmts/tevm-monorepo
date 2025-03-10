import { createChain } from '@tevm/blockchain'
import { optimism } from '@tevm/common'
import { hexToBytes, toHex } from '@tevm/utils'
import { describe, expect, it } from 'vitest'
import { ReceiptsManager } from './RecieptManager.js'
import { createMapDb, typeToId } from './createMapDb.js'

const createEmptyChain = () => {
	const common = optimism.copy()
	return createChain({ common })
}

describe(ReceiptsManager.name, () => {
	describe(ReceiptsManager.prototype.deepCopy.name, () => {
		it('should return a deep copy of the object', async () => {
			const chain = await createEmptyChain()
			const cache = new Map()
			const receiptManager = new ReceiptsManager(createMapDb({ cache }), chain)
			const receiptManagerCopy = receiptManager.deepCopy(chain)
			expect((receiptManagerCopy.mapDb as any)._cache).toEqual((receiptManager.mapDb as any)._cache)
			expect(receiptManagerCopy).not.toBe(receiptManager)
			expect(receiptManagerCopy.chain).toBe(chain)
			expect(receiptManagerCopy.mapDb).not.toBe(receiptManager.mapDb)
		})
	})
})

describe('createMapDb', () => {
	it('should create a mapDb with put, get, delete, and deepCopy methods', () => {
		const cache = new Map()
		const mapDb = createMapDb({ cache })

		expect(mapDb).toHaveProperty('put')
		expect(mapDb).toHaveProperty('get')
		expect(mapDb).toHaveProperty('delete')
		expect(mapDb).toHaveProperty('deepCopy')
	})

	it('should put and get values correctly', async () => {
		const cache = new Map()
		const mapDb = createMapDb({ cache })
		const type = 'Receipts'
		const hash = hexToBytes('0x1234')
		const value = hexToBytes('0x5678')

		await mapDb.put(type, hash, value)
		const result = await mapDb.get(type, hash)

		expect(result).toEqual(value)
	})

	it('should return null for non-existent keys', async () => {
		const cache = new Map()
		const mapDb = createMapDb({ cache })
		const type = 'Receipts'
		const hash = hexToBytes('0x1234')

		const result = await mapDb.get(type, hash)

		expect(result).toBeNull()
	})

	it('should delete values correctly', async () => {
		const cache = new Map()
		const mapDb = createMapDb({ cache })
		const type = 'Receipts'
		const hash = hexToBytes('0x1234')
		const value = hexToBytes('0x5678')

		await mapDb.put(type, hash, value)
		let result = await mapDb.get(type, hash)
		expect(result).toEqual(value)

		await mapDb.delete(type, hash)
		result = await mapDb.get(type, hash)
		expect(result).toBeNull()
	})

	it('should create a deep copy with separate cache instance', () => {
		const cache = new Map()
		const mapDb = createMapDb({ cache })

		const mapDbCopy = mapDb.deepCopy()

		expect(mapDbCopy).not.toBe(mapDb)
		expect((mapDbCopy as any)._cache).not.toBe((mapDb as any)._cache)
		expect((mapDbCopy as any)._cache).toEqual((mapDb as any)._cache)
	})

	it('should generate correct dbKey using typeToId', async () => {
		const cache = new Map()
		const mapDb = createMapDb({ cache })
		const type = 'Receipts'
		const hash = hexToBytes('0x1234')
		const value = hexToBytes('0x5678')

		// Put a value
		await mapDb.put(type, hash, value)

		// Check the internal cache has the key with typeToId prefix
		// This indirectly tests the dbKey function
		const typeId = typeToId[type]
		const cacheEntries = Array.from(cache.entries())

		expect(cacheEntries.length).toBe(1)
		const [cacheKey] = cacheEntries[0]

		// The key should start with the type ID in hex
		expect(cacheKey.startsWith(toHex(hexToBytes(`0x0${typeId}`)))).toBeTruthy()
	})
})
