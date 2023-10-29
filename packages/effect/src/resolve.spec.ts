import {
	CouldNotResolveImportError,
	resolveAsync,
	resolveSync,
} from './resolve.js'
import { flip, runPromise, runSync } from 'effect/Effect'
import resolve from 'resolve'
import { type Mock, afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('resolve')

describe('resolve', () => {
	afterEach(() => {
		vi.clearAllMocks()
	})

	describe('resolveSync', () => {
		const resolveSyncMock = resolve.sync as Mock

		it('should resolve the import path synchronously', () => {
			const resolvedPath = '/absolute/path/to/module.js'
			resolveSyncMock.mockReturnValueOnce(resolvedPath)
			const result = runSync(resolveSync('some-module', {}))
			expect(result).toBe(resolvedPath)
		})

		it('should throw CouldNotResolveImportError if resolve.sync throws', () => {
			const error = new Error('Cannot find module')
			resolveSyncMock.mockImplementationOnce(() => {
				throw error
			})
			const e = runSync(flip(resolveSync('nonexistent-module', {})))
			expect(e).toBeInstanceOf(CouldNotResolveImportError)
			expect(e.cause).toBe(error)
			expect(e._tag).toBe('CouldNotResolveImportError')
			expect(e.name).toBe('CouldNotResolveImportError')
		})
	})

	describe('resolveAsync', () => {
		const resolveAsyncMock = resolve as unknown as Mock<any>

		it('should resolve the import path asynchronously', async () => {
			const resolvedPath = '/absolute/path/to/module.js'
			resolveAsyncMock.mockImplementationOnce((_, __, callback) =>
				callback(null, resolvedPath),
			)
			const result = await runPromise(resolveAsync('some-module', {}))
			expect(result).toBe(resolvedPath)
		})

		it('should throw CouldNotResolveImportError if resolve async throws', async () => {
			const error = new Error('Cannot find module')
			resolveAsyncMock.mockImplementationOnce((_, __, callback) =>
				callback(error, null),
			)
			const e = await runPromise(flip(resolveAsync('nonexistent-module', {})))
			expect(e).toBeInstanceOf(CouldNotResolveImportError)
			expect(e.cause).toBe(error)
			expect(e._tag).toBe('CouldNotResolveImportError')
			expect(e.name).toBe('CouldNotResolveImportError')
		})
	})
})
