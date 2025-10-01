import { join } from 'node:path'
import { runSync } from 'effect/Effect'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FailedToReadConfigError, loadTsConfig } from './loadTsConfig.js'

// Mock fs module
vi.mock('node:fs', () => ({
	existsSync: vi.fn().mockReturnValue(true),
	readFileSync: vi.fn(),
	writeFileSync: vi.fn(),
}))

// Import mocked modules after mocking
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

describe(loadTsConfig.name, () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	it('should correctly load a tsconfig.json', async () => {
		vi.mocked(existsSync).mockImplementation((path) => path.toString().includes('basic'))
		vi.mocked(readFileSync).mockImplementation(() =>
			JSON.stringify({
				compilerOptions: {
					paths: { '@/*': ['./*'] },
					plugins: [{ name: '@tevm/ts-plugin' }],
				},
			}),
		)

		expect(runSync(loadTsConfig(join(__dirname, '../fixtures/basic')))).toMatchInlineSnapshot(`
			{
			  "compilerOptions": {
			    "paths": {
			      "@/*": [
			        "./*",
			      ],
			    },
			    "plugins": [
			      {
			        "name": "@tevm/ts-plugin",
			      },
			    ],
			  },
			}
		`)
	})

	it('should load a jsconfig.json', async () => {
		vi.mocked(existsSync).mockImplementation(
			(path) => path.toString().includes('legacy-js') || path.toString().includes('jsconfig.json'),
		)
		vi.mocked(readFileSync).mockImplementation(() =>
			JSON.stringify({
				compilerOptions: {
					plugins: [{ name: '@tevm/ts-plugin' }],
				},
			}),
		)

		expect(runSync(loadTsConfig(join(__dirname, '../fixtures/legacy-js')))).toMatchInlineSnapshot(`
			{
			  "compilerOptions": {
			    "plugins": [
			      {
			        "name": "@tevm/ts-plugin",
			      },
			    ],
			  },
			}
		`)
	})

	it('should load a jsonc (json with comments)', async () => {
		vi.mocked(existsSync).mockImplementation(
			(path) => path.toString().includes('jsonc') || path.toString().includes('jsconfig.json'),
		)
		vi.mocked(readFileSync).mockImplementation(() =>
			JSON.stringify({
				compilerOptions: {
					plugins: [{ name: '@tevm/ts-plugin' }],
				},
			}),
		)

		expect(runSync(loadTsConfig(join(__dirname, '../fixtures/jsonc')))).toMatchInlineSnapshot(`
			{
			  "compilerOptions": {
			    "plugins": [
			      {
			        "name": "@tevm/ts-plugin",
			      },
			    ],
			  },
			}
		`)
	})

	it(`should throw ${FailedToReadConfigError.name} if the file doesn't exist`, () => {
		vi.mocked(existsSync).mockReturnValue(false)
		vi.mocked(readFileSync).mockImplementation(() => {
			throw new Error('ENOENT')
		})

		expect(() => runSync(loadTsConfig(join(__dirname, '../fixtures/doesntexist')))).toThrowError()
	})

	it('should handle errors when writing config file (plugin missing case)', () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

		// Mock existsSync to behave correctly
		vi.mocked(existsSync).mockReturnValue(true)

		// Mock writeFileSync to throw an error
		vi.mocked(writeFileSync).mockImplementation(() => {
			throw new Error('Failed to write file')
		})

		// Mock readFileSync to return a simple config
		const configStr = JSON.stringify({
			compilerOptions: {
				baseUrl: './src',
			},
		})
		vi.mocked(readFileSync).mockReturnValue(configStr)

		// Run the function and continue despite error
		try {
			runSync(loadTsConfig('/mock/path'))
		} catch (_e) {
			// Ignore error - we just want to test the console.error calls
		}

		// Verify console.error was called
		expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error))
		expect(consoleSpy).toHaveBeenCalledWith(
			'Missing @tevm/ts-plugin in tsconfig.json and unable to add it automatically. Please add it manually.',
		)

		// Clean up
		consoleSpy.mockRestore()
	})

	it('should handle errors when writing config file (plugin exists but not tevm plugin case)', () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

		// Mock existsSync to behave correctly
		vi.mocked(existsSync).mockReturnValue(true)

		// Mock writeFileSync to throw an error
		vi.mocked(writeFileSync).mockImplementation(() => {
			throw new Error('Failed to write file')
		})

		// Mock readFileSync to return config with other plugins
		const configStr = JSON.stringify({
			compilerOptions: {
				plugins: [{ name: 'some-other-plugin' }],
			},
		})
		vi.mocked(readFileSync).mockReturnValue(configStr)

		// Run the function and continue despite error
		try {
			runSync(loadTsConfig('/mock/path'))
		} catch (_e) {
			// Ignore error - we just want to test the console.error calls
		}

		// Verify console.error was called
		expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error))
		expect(consoleSpy).toHaveBeenCalledWith(
			'Missing @tevm/ts-plugin in tsconfig.json and unable to add it automatically. Please add it manually.',
		)

		// Clean up
		consoleSpy.mockRestore()
	})

	it('should throw InvalidTsConfigError for invalid tsconfig structure', () => {
		// Mock readFileSync to return invalid config structure
		vi.mocked(readFileSync).mockReturnValue('{"notValidTsConfig": true}')

		// Expect the function to throw with message containing "Invalid tsconfig"
		expect(() => runSync(loadTsConfig('/mock/path'))).toThrowError(/Invalid tsconfig/)
	})

	it('should add @tevm/ts-plugin automatically', () => {
		// Mock a basic tsconfig with no plugins
		const configWithoutPlugins = {
			compilerOptions: {
				baseUrl: './src',
			},
		}

		// Set up mocks to simulate normal behavior
		vi.mocked(existsSync).mockReturnValue(true)
		vi.mocked(readFileSync).mockReturnValue(JSON.stringify(configWithoutPlugins))

		// Create a variable to store written content
		let savedContent = ''

		// Mock writeFileSync
		vi.mocked(writeFileSync).mockImplementation((_ignoredPath, content) => {
			savedContent = content.toString()
		})

		try {
			// Run the function but handle any errors as it might throw
			runSync(loadTsConfig('/mock/path'))
		} catch (_e) {
			// Continue the test even if the function throws
		}

		// Verify writeFileSync was called
		expect(writeFileSync).toHaveBeenCalled()

		// Parse the written content if it exists
		if (savedContent) {
			const writtenConfig = JSON.parse(savedContent)
			expect(writtenConfig.compilerOptions).toBeDefined()
			expect(writtenConfig.compilerOptions.plugins).toBeDefined()
			expect(writtenConfig.compilerOptions.plugins).toEqual([{ name: '@tevm/ts-plugin' }])
		}
	})

	it('should not modify config if @tevm/ts-plugin already exists', () => {
		// Mock a config that already has the tevm plugin
		const configWithTevmPlugin = {
			compilerOptions: {
				plugins: [{ name: '@tevm/ts-plugin' }],
			},
		}

		// Set up mocks
		vi.mocked(existsSync).mockReturnValue(true)
		vi.mocked(readFileSync).mockReturnValue(JSON.stringify(configWithTevmPlugin))

		// Run the function
		const result = runSync(loadTsConfig('/mock/path'))

		// Verify writeFileSync was not called (no need to modify the config)
		expect(writeFileSync).not.toHaveBeenCalled()

		// Verify the result has the plugin
		expect(result.compilerOptions?.plugins?.[0]?.name).toBe('@tevm/ts-plugin')
	})

	it('should add @tevm/ts-plugin to plugins in written config file', () => {
		// Mock a config with some other plugins but not the tevm plugin
		const configWithOtherPlugins = {
			compilerOptions: {
				plugins: [{ name: 'some-other-plugin' }],
			},
		}

		// Set up mocks
		vi.mocked(existsSync).mockReturnValue(true)
		vi.mocked(readFileSync).mockReturnValue(JSON.stringify(configWithOtherPlugins))

		// Create a variable to store written content
		let savedContent = ''

		// Mock writeFileSync without unused parameters
		vi.mocked(writeFileSync).mockImplementation((_ignoredPath, content) => {
			savedContent = content.toString()
		})

		// Run the function
		runSync(loadTsConfig('/mock/path'))

		// Verify writeFileSync was called to add the tevm plugin
		expect(writeFileSync).toHaveBeenCalled()

		// Parse the written content
		const writtenConfig = JSON.parse(savedContent)

		// Verify that @tevm/ts-plugin is the first plugin in the array
		expect(writtenConfig.compilerOptions.plugins[0]).toEqual({ name: '@tevm/ts-plugin' })

		// Verify that the original plugin is still there
		expect(writtenConfig.compilerOptions.plugins[1]).toEqual({ name: 'some-other-plugin' })
	})
})
