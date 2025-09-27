import { UnreachableCodeError } from '@tevm/errors'
import { beforeEach, describe, expect, it } from 'vitest'
import { createMemoryDb } from './createMemoryDb.js'
import type { MemoryDb } from './MemoryDb.js'
import { bytesToHex } from './viem.js'

describe('createMemoryDb', () => {
	let db: MemoryDb<any, any>

	beforeEach(() => {
		db = createMemoryDb()
	})

	it('should get, put, and delete values', async () => {
		const key = 'testKey'
		const value = 'testValue'

		await db.put(key, value)
		expect(await db.get(key)).toBe(value)

		await db.del(key)
		expect(await db.get(key)).toBeUndefined()
	})

	it('should encode Uint8Array keys correctly', async () => {
		const key = new Uint8Array([1, 2, 3])
		const value = 'testValue'
		const encodedKey = bytesToHex(key)

		await db.put(key, value)
		expect(await db.get(encodedKey)).toBe(value)

		await db.del(key)
		expect(await db.get(encodedKey)).toBeUndefined()
	})

	it('should create a shallow copy of the database', async () => {
		const key = 'testKey'
		const value = 'testValue'

		await db.put(key, value)
		const copiedDb = db.shallowCopy()

		expect(await copiedDb.get(key)).toBe(value)

		await db.del(key)
		expect(await db.get(key)).toBeUndefined()
		expect(await copiedDb.get(key)).toBe(value)
	})

	it('should handle batch operations', async () => {
		await db.batch([
			{ type: 'put', key: 'key1', value: 'value1' },
			{ type: 'put', key: new Uint8Array([2, 3, 4]), value: 'value2' },
			{ type: 'del', key: 'key1' },
		])
		expect(await db.get('key1')).toBeUndefined()
		expect(await db.get(bytesToHex(new Uint8Array([2, 3, 4])))).toBe('value2')
	})

	it('should throw an UnreachableCodeError for unknown batch operation types', async () => {
		const operations = [{ type: 'unknown', key: 'key1', value: 'value1' }] as const
		const err = await db.batch(operations as any).catch((e) => e)
		expect(err).toBeInstanceOf(UnreachableCodeError)
		expect(err).toMatchSnapshot()
	})

	it('should resolve the open method', async () => {
		await expect(db.open()).resolves.toBeUndefined()
	})
})
