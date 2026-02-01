import { describe, expect, it } from 'vitest'
import { Effect, Equal, Hash, HashSet } from 'effect'
import { SnapshotNotFoundError } from './SnapshotNotFoundError.js'

describe('SnapshotNotFoundError', () => {
	it('should create a SnapshotNotFoundError with all properties', () => {
		const error = new SnapshotNotFoundError({
			snapshotId: '0x1234567890abcdef',
		})

		expect(error.snapshotId).toBe('0x1234567890abcdef')
		expect(error._tag).toBe('SnapshotNotFoundError')
		expect(error.code).toBe(-32001)
		expect(error.docsPath).toBe('/reference/tevm/errors/classes/snapshotnotfounderror/')
	})

	it('should generate a default message with snapshotId', () => {
		const error = new SnapshotNotFoundError({
			snapshotId: '0x1234567890abcdef',
		})

		expect(error.message).toBe("Snapshot '0x1234567890abcdef' not found")
	})

	it('should generate a default message without snapshotId', () => {
		const error = new SnapshotNotFoundError({})

		expect(error.message).toBe('Snapshot not found')
	})

	it('should allow custom message', () => {
		const error = new SnapshotNotFoundError({
			snapshotId: '0xabc',
			message: 'Custom snapshot not found message',
		})

		expect(error.message).toBe('Custom snapshot not found message')
	})

	it('should be usable in Effect.fail', async () => {
		const error = new SnapshotNotFoundError({
			snapshotId: '0x123',
		})

		const program = Effect.fail(error)

		const result = await Effect.runPromise(Effect.either(program))

		expect(result._tag).toBe('Left')
		if (result._tag === 'Left') {
			expect(result.left._tag).toBe('SnapshotNotFoundError')
		}
	})

	it('should be catchable by tag', async () => {
		const error = new SnapshotNotFoundError({
			snapshotId: '0xdeadbeef',
		})

		const program = Effect.fail(error).pipe(
			Effect.catchTag('SnapshotNotFoundError', (e) =>
				Effect.succeed(`Cannot revert to snapshot ${e.snapshotId}`)
			)
		)

		const result = await Effect.runPromise(program)
		expect(result).toBe('Cannot revert to snapshot 0xdeadbeef')
	})

	it('should have correct static properties', () => {
		expect(SnapshotNotFoundError.code).toBe(-32001)
		expect(SnapshotNotFoundError.docsPath).toBe('/reference/tevm/errors/classes/snapshotnotfounderror/')
	})

	it('should create with empty props', () => {
		const error = new SnapshotNotFoundError()

		expect(error.snapshotId).toBeUndefined()
		expect(error._tag).toBe('SnapshotNotFoundError')
		expect(error.message).toBe('Snapshot not found')
	})

	it('should NOT be frozen (for Effect trait compatibility)', () => {
		const error = new SnapshotNotFoundError({
			snapshotId: '0x123',
		})

		expect(Object.isFrozen(error)).toBe(false)
		expect(Object.isExtensible(error)).toBe(true)
	})

	it('should accept and store cause property for error chaining', () => {
		const originalError = new Error('Snapshot expired')
		const error = new SnapshotNotFoundError({
			snapshotId: '0x123',
			cause: originalError,
		})

		expect(error.cause).toBe(originalError)
		expect(error.cause).toBeInstanceOf(Error)
		expect((error.cause as Error).message).toBe('Snapshot expired')
	})

	it('should have undefined cause when not provided', () => {
		const error = new SnapshotNotFoundError({
			snapshotId: '0x123',
		})

		expect(error.cause).toBeUndefined()
	})

	describe('Effect traits', () => {
		it('should support Equal.equals for structural equality', () => {
			const error1 = new SnapshotNotFoundError({
				snapshotId: '0xabc123',
			})
			const error2 = new SnapshotNotFoundError({
				snapshotId: '0xabc123',
			})

			expect(Equal.equals(error1, error2)).toBe(true)
		})

		it('should return false for Equal.equals with different properties', () => {
			const error1 = new SnapshotNotFoundError({
				snapshotId: '0x111',
			})
			const error2 = new SnapshotNotFoundError({
				snapshotId: '0x222',
			})

			expect(Equal.equals(error1, error2)).toBe(false)
		})

		it('should have consistent Hash values for equal errors', () => {
			const error1 = new SnapshotNotFoundError({
				snapshotId: '0xtest',
			})
			const error2 = new SnapshotNotFoundError({
				snapshotId: '0xtest',
			})

			expect(Hash.hash(error1)).toBe(Hash.hash(error2))
		})

		it('should have different Hash values for different errors', () => {
			const error1 = new SnapshotNotFoundError({
				snapshotId: '0xfoo',
			})
			const error2 = new SnapshotNotFoundError({
				snapshotId: '0xbar',
			})

			expect(Hash.hash(error1)).not.toBe(Hash.hash(error2))
		})

		it('should work correctly in Effect HashSet', () => {
			const error1 = new SnapshotNotFoundError({
				snapshotId: '0xunique',
			})
			const error2 = new SnapshotNotFoundError({
				snapshotId: '0xunique',
			})

			const set = HashSet.make(error1)
			expect(HashSet.has(set, error2)).toBe(true)
		})
	})
})
