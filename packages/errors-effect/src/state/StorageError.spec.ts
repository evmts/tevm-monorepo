import { describe, expect, it } from 'vitest'
import { Effect, Equal, Hash, HashSet } from 'effect'
import { StorageError } from './StorageError.js'

describe('StorageError', () => {
	it('should create a StorageError with all properties', () => {
		const error = new StorageError({
			address: '0x1234567890123456789012345678901234567890',
			key: '0x0000000000000000000000000000000000000000000000000000000000000001',
		})

		expect(error.address).toBe('0x1234567890123456789012345678901234567890')
		expect(error.key).toBe('0x0000000000000000000000000000000000000000000000000000000000000001')
		expect(error._tag).toBe('StorageError')
		expect(error.code).toBe(-32603)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/storageerror/')
	})

	it('should generate a default message with address and key', () => {
		const error = new StorageError({
			address: '0x1234567890123456789012345678901234567890',
			key: '0x0000000000000000000000000000000000000000000000000000000000000001',
		})

		expect(error.message).toBe('Storage error for account 0x1234567890123456789012345678901234567890 at key 0x0000000000000000000000000000000000000000000000000000000000000001')
	})

	it('should generate a default message with address only', () => {
		const error = new StorageError({
			address: '0x1234567890123456789012345678901234567890',
		})

		expect(error.message).toBe('Storage error for account 0x1234567890123456789012345678901234567890')
	})

	it('should generate a default message without properties', () => {
		const error = new StorageError({})

		expect(error.message).toBe('Storage access error')
	})

	it('should allow custom message', () => {
		const error = new StorageError({
			address: '0x1234',
			key: '0x01',
			message: 'Custom storage error message',
		})

		expect(error.message).toBe('Custom storage error message')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new StorageError({
			address: '0x1234',
			key: '0x01',
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('StorageError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new StorageError({
			address: '0x1234',
			key: '0x01',
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('StorageError', (e) =>
				Effect.succeed(`Failed to access storage at ${e.address} key ${e.key}`)
			)
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Failed to access storage at 0x1234 key 0x01')
	})

	it('should have correct static properties', () => {
		expect(StorageError.code).toBe(-32603)
		expect(StorageError.docsPath).toBe('/reference/tevm/errors/classes/storageerror/')
	})

	it('should create with empty props', () => {
		const error = new StorageError()

		expect(error.address).toBeUndefined()
		expect(error.key).toBeUndefined()
		expect(error._tag).toBe('StorageError')
		expect(error.message).toBe('Storage access error')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new StorageError({
			address: '0x1234567890123456789012345678901234567890',
			key: '0x01',
		})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Database error')
		const error = new StorageError({
			address: '0x1234567890123456789012345678901234567890',
			key: '0x01',
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Database error')
	})

	it('should have undefined cause when not provided', () => {
		const error = new StorageError({
			address: '0x1234',
			key: '0x01',
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new StorageError({
				address: '0x1234567890123456789012345678901234567890',
				key: '0x01',
			})
			const error2 = new StorageError({
				address: '0x1234567890123456789012345678901234567890',
				key: '0x01',
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new StorageError({
				address: '0x1234',
				key: '0x01',
			})
			const error2 = new StorageError({
				address: '0x1234',
				key: '0x02',
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new StorageError({
				address: '0xABCD',
				key: '0x05',
			})
			const error2 = new StorageError({
				address: '0xABCD',
				key: '0x05',
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new StorageError({
				address: '0x1111',
				key: '0x01',
			})
			const error2 = new StorageError({
				address: '0x2222',
				key: '0x01',
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new StorageError({
				address: '0xDEADBEEF',
				key: '0xCAFE',
			})
			const error2 = new StorageError({
				address: '0xDEADBEEF',
				key: '0xCAFE',
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
