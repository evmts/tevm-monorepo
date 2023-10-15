import { fileExists } from './fileExists.js'
import { loadConfigAsync } from './loadConfigAsync.js'
import { readFile } from 'fs/promises'
import path from 'path'
import {
	type MockedFunction,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const validConfig = JSON.stringify({
	compilerOptions: {
		plugins: [
			{
				name: '@evmts/ts-plugin',
				solcVersion: '0.9.0',
				libs: ['path/to/libs'],
			},
		],
	},
})

vi.mock('fs/promises', () => ({
	...vi.importActual('fs/promises'),
	readFile: vi.fn(),
}))

vi.mock('./fileExists', () => ({
	fileExists: vi.fn(),
}))

describe(loadConfigAsync.name, () => {
	beforeEach(() => {
		vi.resetAllMocks()
	})

	it('should successfully load the configuration from tsconfig.json', async () => {
		const mockFileExists = fileExists as MockedFunction<typeof fileExists>
		const mockReadFile = readFile as MockedFunction<typeof readFile>

		mockReadFile.mockResolvedValue(validConfig)

		const mockConfigFilePath = '/mock/path'
		mockFileExists.mockResolvedValue(true)

		const config = await loadConfigAsync(mockConfigFilePath)

		expect(config).toMatchInlineSnapshot(`
			{
			  "foundryProject": false,
			  "libs": [
			    "path/to/libs",
			  ],
			  "remappings": {},
			  "solcVersion": "0.9.0",
			}
		`)
	})

	it('should throw an error if no config file exists', async () => {
		const mockFileExists = fileExists as MockedFunction<typeof fileExists>
		const mockReadFile = readFile as MockedFunction<typeof readFile>

		mockFileExists.mockResolvedValue(false) // Neither jsconfig.json nor tsconfig.json exist.
		mockReadFile.mockRejectedValue(new Error('File not found'))

		const mockConfigFilePath = '/mock/path'

		// Assert that the function throws an error when the file doesn't exist.
		await expect(loadConfigAsync(mockConfigFilePath)).rejects.toThrow(
			`Failed to read the file at ${path.join(
				mockConfigFilePath,
				'tsconfig.json',
			)}. Make sure the file exists and is accessible.`,
		)
	})

	it('should throw an error if the config file contains invalid JSON', async () => {
		const mockFileExists = fileExists as MockedFunction<typeof fileExists>
		const mockReadFile = readFile as MockedFunction<typeof readFile>

		mockFileExists.mockResolvedValue(true) // Assume a jsconfig.json exists for this test.
		mockReadFile.mockResolvedValue('{ invalid: JSON }') // Invalid JSON.

		const mockConfigFilePath = '/mock/path'

		// Assert that the function throws an error for invalid JSON.
		await expect(loadConfigAsync(mockConfigFilePath)).rejects.toThrow(
			`tsconfig.json at ${path.join(
				mockConfigFilePath,
				'tsconfig.json',
			)} is not valid json`,
		)
	})
	it('should throw an error if compilerOptions is missing from the config file', async () => {
		const mockFileExists = fileExists as MockedFunction<typeof fileExists>
		const mockReadFile = readFile as MockedFunction<typeof readFile>

		// A config without compilerOptions
		const invalidConfig = JSON.stringify({
			notCompilerOptions: {},
		})

		mockFileExists.mockResolvedValue(true) // Assume a jsconfig.json exists for this test.
		mockReadFile.mockResolvedValue(invalidConfig)

		const mockConfigFilePath = '/mock/path'

		// Assert that the function throws an error when compilerOptions is missing.
		await expect(
			loadConfigAsync(mockConfigFilePath),
		).rejects.toThrowErrorMatchingInlineSnapshot(
			'"tsconfig.json at /mock/path/tsconfig.json is not valid json"',
		)
	})

	it('should warn and return default config when @evmts/ts-plugin is not found', async () => {
		const mockFileExists = fileExists as MockedFunction<typeof fileExists>
		const mockReadFile = readFile as MockedFunction<typeof readFile>

		// A config with compilerOptions but without @evmts/ts-plugin in plugins
		const configWithoutPlugin = JSON.stringify({
			compilerOptions: {
				plugins: [{ name: 'some-other-plugin' }],
			},
		})

		mockFileExists.mockResolvedValue(true) // Assume a jsconfig.json exists for this test.
		mockReadFile.mockResolvedValue(configWithoutPlugin)

		const mockConfigFilePath = '/mock/path'
		const mockLogger = {
			warn: vi.fn(),
			error: vi.fn(),
		}

		const config = await loadConfigAsync(mockConfigFilePath, mockLogger)

		expect(mockLogger.warn).toHaveBeenCalledWith(
			'No Evmts plugin found in tsconfig.json. Using the default config',
		)

		expect(config).toMatchInlineSnapshot(`
			{
			  "foundryProject": false,
			  "libs": [],
			  "remappings": {},
			  "solcVersion": [Function],
			}
		`)
	})

	it('should append baseUrl to the libs when compilerOptions.baseUrl is set', async () => {
		const mockFileExists = fileExists as MockedFunction<typeof fileExists>
		const mockReadFile = readFile as MockedFunction<typeof readFile>

		// Config with compilerOptions.baseUrl set
		const configWithBaseUrl = JSON.stringify({
			compilerOptions: {
				plugins: [
					{
						name: '@evmts/ts-plugin',
						solcVersion: '0.9.0',
						libs: ['path/to/libs'],
					},
				],
				baseUrl: 'base/url',
			},
		})

		mockFileExists.mockResolvedValue(true) // Assume a jsconfig.json exists for this test.
		mockReadFile.mockResolvedValue(configWithBaseUrl)

		const mockConfigFilePath = '/mock/path'

		const config = await loadConfigAsync(mockConfigFilePath)

		// Assert that the baseUrl has been appended to the libs
		expect(config.libs).toContain('path/to/libs')
		expect(config.libs).toContain(path.join(mockConfigFilePath, 'base/url'))
	})

	it('should attempt to load from tsconfig.json when jsconfig.json does not exist', async () => {
		const mockFileExists = fileExists as MockedFunction<typeof fileExists>
		const mockReadFile = readFile as MockedFunction<typeof readFile>

		mockFileExists.mockResolvedValue(false) // jsconfig.json does not exist.
		mockReadFile.mockResolvedValue(validConfig) // Provide the earlier defined validConfig for the tsconfig.json.

		const mockConfigFilePath = '/mock/path'

		const config = await loadConfigAsync(mockConfigFilePath)

		// Assert that the readFile was called with tsconfig.json
		expect(mockReadFile).toHaveBeenCalledWith(
			path.join(mockConfigFilePath, 'tsconfig.json'),
			'utf8',
		)

		// Assert that the config matches expected
		expect(config).toMatchInlineSnapshot(`
			{
			  "foundryProject": false,
			  "libs": [
			    "path/to/libs",
			  ],
			  "remappings": {},
			  "solcVersion": "0.9.0",
			}
		`)
	})
})
