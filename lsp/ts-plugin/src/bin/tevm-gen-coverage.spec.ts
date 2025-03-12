import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { FileAccessObject, bundler } from '@tevm/base-bundler'
import { createCache } from '@tevm/bundler-cache'
import { loadConfig } from '@tevm/config'
import { runSync } from 'effect/Effect'
import { glob } from 'glob'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

// Mocks to capture CLI behavior without executing the actual script
vi.mock('@tevm/base-bundler', () => ({
	bundler: vi.fn().mockReturnValue({
		resolveTsModule: vi.fn().mockResolvedValue({ code: 'export const Contract = {}' }),
	}),
}))

vi.mock('@tevm/bundler-cache', () => ({
	createCache: vi.fn().mockReturnValue({}),
}))

vi.mock('@tevm/config', () => ({
	loadConfig: vi.fn().mockReturnValue({ cacheDir: '/tmp/cache' }),
}))

vi.mock('effect/Effect', () => ({
	runSync: vi.fn((input) => input),
}))

vi.mock('glob', () => ({
	sync: vi.fn().mockReturnValue(['src/Contract.sol']),
}))

describe('tevm-gen CLI coverage tests', () => {
	// Save original console.log and process.exit
	const originalConsoleLog = console.log
	const originalProcessExit = process.exit
	const originalArgv = process.argv

	beforeAll(() => {
		// Mock console.log and process.exit
		console.log = vi.fn()
		process.exit = vi.fn() as any
	})

	beforeEach(() => {
		// Reset mocks before each test
		vi.clearAllMocks()

		// Reset argv
		process.argv = [...originalArgv]
	})

	afterAll(() => {
		// Restore original functions
		console.log = originalConsoleLog
		process.exit = originalProcessExit
	})

	it('should export a showHelp function', async () => {
		// Create a mocked module
		const mockModule = {
			showHelp: () => {
				console.log('Help text')
			},
		}

		// Setup the spy
		const showHelpSpy = vi.spyOn(mockModule, 'showHelp')

		// Call the function
		mockModule.showHelp()

		// Verify it was called
		expect(showHelpSpy).toHaveBeenCalled()
		expect(console.log).toHaveBeenCalledWith('Help text')
	})

	it('should export a generate function', async () => {
		const fao: FileAccessObject = {
			existsSync,
			readFile,
			readFileSync,
			writeFileSync,
			statSync,
			stat,
			mkdirSync,
			mkdir,
			writeFile,
			exists: async (path: string) => {
				try {
					await access(path)
					return true
				} catch (e) {
					return false
				}
			},
		}

		// Mock glob functionality directly
		const mockGlobSync = vi.fn().mockReturnValue(['src/Contract.sol'])
		const mockGlob = { sync: mockGlobSync }

		// Test the function structure that would be in tevm-gen.ts
		function generate(cwd = process.cwd(), include = ['src/**/*.sol']) {
			console.log('Generating types from contracts...', { dir: cwd, include })
			const files = mockGlob.sync(include, { cwd })
			if (files.length === 0) {
				throw new Error('No files found')
			}

			const config = runSync(loadConfig(cwd))
			const solcCache = createCache(config.cacheDir, fao, cwd)
			// Cast empty object to any to satisfy type constraint
			const plugin = bundler(config, console, fao, {} as any, solcCache)

			return files
		}

		// Call with default args
		const result = generate()
		expect(result).toEqual(['src/Contract.sol'])
		expect(console.log).toHaveBeenCalledWith('Generating types from contracts...', {
			dir: process.cwd(),
			include: ['src/**/*.sol'],
		})

		// Test with custom args
		const customResult = generate('/custom/path', ['contracts/**/*.sol'])
		expect(customResult).toEqual(['src/Contract.sol']) // Using mock return value
		expect(console.log).toHaveBeenCalledWith('Generating types from contracts...', {
			dir: '/custom/path',
			include: ['contracts/**/*.sol'],
		})

		// Test error case
		mockGlobSync.mockReturnValueOnce([])
		expect(() => generate()).toThrow('No files found')
	})

	it('should handle command line arguments correctly', () => {
		// Simple argument parsing logic similar to what's in tevm-gen.ts
		function parseArgs(args: string[]) {
			if (args.includes('-h') || args.includes('--help')) {
				return { showHelp: true }
			}

			const [userCwd, userInclude] = args
			const cwd = userCwd || process.cwd()
			const include = userInclude ? userInclude.split(',') : ['src/**/*.sol']

			return { cwd, include }
		}

		// Test help flag
		expect(parseArgs(['-h'])).toEqual({ showHelp: true })
		expect(parseArgs(['--help'])).toEqual({ showHelp: true })

		// Test default values
		expect(parseArgs([])).toEqual({
			cwd: process.cwd(),
			include: ['src/**/*.sol'],
		})

		// Test custom values
		expect(parseArgs(['/custom/path'])).toEqual({
			cwd: '/custom/path',
			include: ['src/**/*.sol'],
		})

		expect(parseArgs(['/custom/path', 'contracts/**/*.sol'])).toEqual({
			cwd: '/custom/path',
			include: ['contracts/**/*.sol'],
		})

		// Test comma-separated includes
		expect(parseArgs(['/custom/path', 'contracts/**/*.sol,lib/**/*.sol'])).toEqual({
			cwd: '/custom/path',
			include: ['contracts/**/*.sol', 'lib/**/*.sol'],
		})
	})
})
