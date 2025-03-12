import { Effect } from 'effect'
import { flip } from 'effect/Effect'
import { describe, expect, it, vi } from 'vitest'
import type { FileAccessObject } from '../types.js'
import { ResolveError, resolveSafe } from './resolveSafe.js'
import { ExistsError, ReadFileError, safeFao } from './safeFao.js'

// Create custom FileAccessObject implementations for testing
const mockSuccessFao: FileAccessObject = {
	existsSync: () => true,
	readFile: () => Promise.resolve('file content'),
	readFileSync: () => 'file content',
	exists: () => Promise.resolve(true),
}

const mockReadFileErrorFao: FileAccessObject = {
	existsSync: () => true,
	readFile: () => Promise.reject(new Error('Read file error')),
	readFileSync: () => 'file content',
	exists: () => Promise.resolve(true),
}

const mockExistsErrorFao: FileAccessObject = {
	existsSync: () => true,
	readFile: () => Promise.resolve('file content'),
	readFileSync: () => 'file content',
	exists: () => Promise.reject(new Error('Exists error')),
}

// Configure the mocked resolve function for our tests
vi.mock('resolve', () => ({
	default: (id: string, options: any, callback: Function) => {
		// Mock behavior for standard cases
		if (id === 'success-path') {
			callback(null, '/path/to/resolved/file.js')
		} else if (id === 'error-path') {
			callback(new Error('Cannot find module'), null)
		} else if (id === 'readfile-error-path') {
			callback(new ReadFileError(new Error('readfile error')), null)
		} else if (id === 'exists-error-path') {
			callback(new ExistsError(new Error('exists error')), null)
		} else if (id === 'test-readfile-success') {
			// Test the readFile callback success path
			options.readFile('/test/file.js', (_err: Error | null, content: string) => {
				callback(null, content)
			})
		} else if (id === 'test-readfile-error') {
			// Test the readFile callback error path
			options.readFile('/nonexistent/file.js', (err: Error | null, _content: string) => {
				callback(err, null)
			})
		} else if (id === 'test-isfile-success') {
			// Test the isFile callback success path
			options.isFile('/test/file.js', (_err: Error | null, exists: boolean) => {
				callback(null, exists ? 'exists' : 'not exists')
			})
		} else if (id === 'test-isfile-error') {
			// Test the isFile callback error path
			options.isFile('/nonexistent/file.js', (err: Error | null, _exists: boolean) => {
				callback(err, null)
			})
		} else {
			callback(null, '/default/path/file.js')
		}
	},
}))

describe('resolveSafe', () => {
	it('should resolve a file path when successful', async () => {
		const result = await Effect.runPromise(resolveSafe('success-path', '/test', safeFao(mockSuccessFao)))
		expect(result).toBe('/path/to/resolved/file.js')
	})

	it('should fail with ResolveError for general errors', async () => {
		const error = await Effect.runPromise(flip(resolveSafe('error-path', '/test', safeFao(mockSuccessFao))))
		expect(error).toBeInstanceOf(ResolveError)
	})

	it('should fail with ReadFileError when readFile fails', async () => {
		const error = await Effect.runPromise(flip(resolveSafe('readfile-error-path', '/test', safeFao(mockSuccessFao))))
		expect(error).toBeInstanceOf(ReadFileError)
	})

	it('should fail with ExistsError when exists fails', async () => {
		const error = await Effect.runPromise(flip(resolveSafe('exists-error-path', '/test', safeFao(mockSuccessFao))))
		expect(error).toBeInstanceOf(ExistsError)
	})

	it('should handle readFile callback success correctly', async () => {
		const result = await Effect.runPromise(resolveSafe('test-readfile-success', '/test', safeFao(mockSuccessFao)))
		expect(result).toBe('file content')
	})

	it('should handle readFile callback error correctly', async () => {
		const error = await Effect.runPromise(
			flip(resolveSafe('test-readfile-error', '/test', safeFao(mockReadFileErrorFao))),
		)
		expect(error).toBeInstanceOf(Error)
	})

	it('should handle isFile callback success correctly', async () => {
		const result = await Effect.runPromise(resolveSafe('test-isfile-success', '/test', safeFao(mockSuccessFao)))
		expect(result).toBe('exists')
	})

	it('should handle isFile callback error correctly', async () => {
		const error = await Effect.runPromise(flip(resolveSafe('test-isfile-error', '/test', safeFao(mockExistsErrorFao))))
		expect(error).toBeInstanceOf(Error)
	})
})
