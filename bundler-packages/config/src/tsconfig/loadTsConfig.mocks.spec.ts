import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { runPromise } from 'effect/Effect'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadTsConfig } from './loadTsConfig.js'

// Mock fs functions
vi.mock('node:fs', () => ({
	readFileSync: vi.fn(),
	existsSync: vi.fn(),
	writeFileSync: vi.fn(),
}))

describe('loadTsConfig with mocks', () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('should verify writeFileSync is called for configs without plugins array', async () => {
		vi.mocked(existsSync).mockReturnValue(false)
		vi.mocked(readFileSync).mockReturnValue(
			JSON.stringify({
				compilerOptions: {
					baseUrl: './src',
				},
			}),
		)
		const originalConsoleError = console.error
		console.error = vi.fn()

		try {
			await runPromise(loadTsConfig('/path/to/project'))
		} catch (e) {
			// Ignore any error - we just want to verify writeFileSync was called
		}

		expect(vi.mocked(writeFileSync)).toHaveBeenCalled()
		expect(vi.mocked(writeFileSync).mock.calls[0]?.[0]).toBe('/path/to/project/tsconfig.json')
		expect(vi.mocked(writeFileSync).mock.calls[0]?.[1]).toContain('@tevm/ts-plugin')

		console.error = originalConsoleError
	})

	it('should handle error when writing to file fails', async () => {
		vi.mocked(existsSync).mockReturnValue(true)
		vi.mocked(readFileSync).mockReturnValue(
			JSON.stringify({
				compilerOptions: {
					baseUrl: './src',
				},
			}),
		)
		vi.mocked(writeFileSync).mockImplementation(() => {
			throw new Error('Permission denied')
		})

		const originalConsoleError = console.error
		console.error = vi.fn()

		try {
			await runPromise(loadTsConfig('/path/to/project'))
		} catch (e) {
			// Ignore errors for this test
		}

		expect(console.error).toHaveBeenCalledTimes(2)
		expect((console.error as any).mock.calls[0][0]).toBeInstanceOf(Error)
		expect((console.error as any).mock.calls[1][0]).toBe(
			'Missing @tevm/ts-plugin in tsconfig.json and unable to add it automatically. Please add it manually.',
		)

		console.error = originalConsoleError
	})

	it('should verify writing plugins to config', async () => {
		vi.mocked(existsSync).mockReturnValue(false)
		vi.mocked(readFileSync).mockReturnValue(
			JSON.stringify({
				compilerOptions: {
					plugins: [{ name: 'some-other-plugin' }],
				},
			}),
		)

		try {
			await runPromise(loadTsConfig('/path/to/project'))
		} catch (e) {
			// Ignore any errors - just testing the writeFileSync call
		}

		expect(vi.mocked(writeFileSync)).toHaveBeenCalled()
		// Check that writeFileSync was called with the expected arguments
		const writeArgs = vi.mocked(writeFileSync).mock.calls[0]
		expect(writeArgs?.[0]).toBe('/path/to/project/tsconfig.json')
		expect(writeArgs?.[1]).toContain('@tevm/ts-plugin')
		expect(writeArgs?.[1]).toContain('some-other-plugin')
	})

	it('should throw InvalidTsConfigError for a completely invalid tsconfig', async () => {
		vi.mocked(existsSync).mockReturnValue(false)
		vi.mocked(readFileSync).mockReturnValue('not valid json')

		await expect(runPromise(loadTsConfig('/path/to/project'))).rejects.toThrow()
	})
})
