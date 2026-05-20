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

	it('should not write configs without plugins array', async () => {
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

		const result = await runPromise(loadTsConfig('/path/to/project'))

		expect(result.compilerOptions.baseUrl).toBe('./src')
		expect(vi.mocked(writeFileSync)).not.toHaveBeenCalled()

		console.error = originalConsoleError
	})

	it('should ignore writeFileSync failures because loading is read-only', async () => {
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

		const result = await runPromise(loadTsConfig('/path/to/project'))

		expect(result.compilerOptions.baseUrl).toBe('./src')
		expect(console.error).not.toHaveBeenCalled()

		console.error = originalConsoleError
	})

	it('should not write plugins to config', async () => {
		vi.mocked(existsSync).mockReturnValue(false)
		vi.mocked(readFileSync).mockReturnValue(
			JSON.stringify({
				compilerOptions: {
					plugins: [{ name: 'some-other-plugin' }],
				},
			}),
		)

		const result = await runPromise(loadTsConfig('/path/to/project'))

		expect(result.compilerOptions.plugins?.[0]?.name).toBe('some-other-plugin')
		expect(vi.mocked(writeFileSync)).not.toHaveBeenCalled()
	})

	it('should throw InvalidTsConfigError for a completely invalid tsconfig', async () => {
		vi.mocked(existsSync).mockReturnValue(false)
		vi.mocked(readFileSync).mockReturnValue('not valid json')

		await expect(runPromise(loadTsConfig('/path/to/project'))).rejects.toThrow()
	})
})
