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

	it('should not write config files when the plugin is missing', () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

		// Mock existsSync to behave correctly
		vi.mocked(existsSync).mockReturnValue(true)

		// Mock readFileSync to return a simple config
		const configStr = JSON.stringify({
			compilerOptions: {
				baseUrl: './src',
			},
		})
		vi.mocked(readFileSync).mockReturnValue(configStr)

		const result = runSync(loadTsConfig('/mock/path'))

		expect(result.compilerOptions.baseUrl).toBe('./src')
		expect(writeFileSync).not.toHaveBeenCalled()
		expect(consoleSpy).not.toHaveBeenCalled()

		// Clean up
		consoleSpy.mockRestore()
	})

	it('should not write config files when another plugin exists without the tevm plugin', () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

		// Mock existsSync to behave correctly
		vi.mocked(existsSync).mockReturnValue(true)

		// Mock readFileSync to return config with other plugins
		const configStr = JSON.stringify({
			compilerOptions: {
				plugins: [{ name: 'some-other-plugin' }],
			},
		})
		vi.mocked(readFileSync).mockReturnValue(configStr)

		const result = runSync(loadTsConfig('/mock/path'))

		expect(result.compilerOptions.plugins?.[0]?.name).toBe('some-other-plugin')
		expect(writeFileSync).not.toHaveBeenCalled()
		expect(consoleSpy).not.toHaveBeenCalled()

		// Clean up
		consoleSpy.mockRestore()
	})

	it('should throw InvalidTsConfigError for invalid tsconfig structure', () => {
		// Mock readFileSync to return invalid config structure
		vi.mocked(readFileSync).mockReturnValue('{"notValidTsConfig": true}')

		// Expect the function to throw with message containing "Invalid tsconfig"
		expect(() => runSync(loadTsConfig('/mock/path'))).toThrowError(/Invalid tsconfig/)
	})

	it('should return configs without plugins without mutating them', () => {
		// Mock a basic tsconfig with no plugins
		const configWithoutPlugins = {
			compilerOptions: {
				baseUrl: './src',
			},
		}

		// Set up mocks to simulate normal behavior
		vi.mocked(existsSync).mockReturnValue(true)
		vi.mocked(readFileSync).mockReturnValue(JSON.stringify(configWithoutPlugins))

		const result = runSync(loadTsConfig('/mock/path'))

		expect(writeFileSync).not.toHaveBeenCalled()
		expect(result.compilerOptions.baseUrl).toBe('./src')
		expect(result.compilerOptions.plugins).toBeUndefined()
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

	it('should return other plugins without mutating them', () => {
		// Mock a config with some other plugins but not the tevm plugin
		const configWithOtherPlugins = {
			compilerOptions: {
				plugins: [{ name: 'some-other-plugin' }],
			},
		}

		// Set up mocks
		vi.mocked(existsSync).mockReturnValue(true)
		vi.mocked(readFileSync).mockReturnValue(JSON.stringify(configWithOtherPlugins))

		// Run the function
		const result = runSync(loadTsConfig('/mock/path'))

		expect(writeFileSync).not.toHaveBeenCalled()
		expect(result.compilerOptions.plugins?.[0]).toEqual({ name: 'some-other-plugin' })
	})
})
