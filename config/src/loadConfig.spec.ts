import { type CompilerConfig, defaultConfig, loadConfig } from './index.js'
import * as cp from 'child_process'
import * as fs from 'fs'
import { createRequire } from 'module'
import {
	type MockedFunction,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const mockTsConfig = () => {
	return JSON.stringify(
		{
			compilerOptions: {
				plugins: [
					{
						name: '@evmts/ts-plugin',
					},
				],
			},
			include: ['./src'],
		},
		null,
		2,
	)
}

vi.mock('module', () => ({
	createRequire: vi.fn(),
}))
vi.mock('fs', () => ({
	readFileSync: vi.fn(),
	existsSync: vi.fn(),
}))

vi.mock('child_process', () => ({
	execSync: vi.fn(),
}))

describe(loadConfig.name, () => {
	beforeEach(() => {
		vi.resetAllMocks()
		const mockCreateRequire = createRequire as MockedFunction<
			typeof createRequire
		>
		const mockRequire = vi.fn()
		mockCreateRequire.mockReturnValue(mockRequire as any)
		mockRequire.mockReturnValue({ version: '0.8.42' })
		vi.stubGlobal('process', {
			...process,
			env: { ...process.env, ETHERSCAN_KEY: 'MY_ETHERSCAN_KEY' },
		})
	})

	it('should throw an error if tsconfig.json does not exist', () => {
		vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
			throw new Error('File not found')
		})
		expect(() =>
			loadConfig('nonexistentpath'),
		).toThrowErrorMatchingInlineSnapshot(
			'"Failed to read the file at nonexistentpath/tsconfig.json. Make sure the file exists and is accessible."',
		)
	})

	it('should throw an error when the tsconfig.json is not valid json', () => {
		vi.spyOn(fs, 'readFileSync').mockReturnValue('{{}')

		expect(() =>
			loadConfig('nonexistentpath'),
		).toThrowErrorMatchingInlineSnapshot(
			'"tsconfig.json at nonexistentpath/tsconfig.json is not valid json"',
		)
	})

	it('should return the correct config when the tsconfig.json is valid', () => {
		vi.spyOn(fs, 'readFileSync').mockReturnValue(mockTsConfig())
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
		vi.spyOn(fs, 'readFileSync').mockReturnValue(validConfig)
		const config = loadConfig('nonexistentpath')
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

	it('should return the correct config when most options are passed in', () => {
		const customConfig: CompilerConfig = {
			...{ name: '@evmts/ts-plugin' },
			solcVersion: '0.9.0',
			libs: ['lib1', 'lib2'],
			foundryProject: false,
		}
		vi.spyOn(cp, 'execSync').mockReturnValue(
			Buffer.from(
				JSON.stringify({ remappings: { '@foundry': 'node_modules/@foundry' } }),
			),
		)
		const tsConfig = {
			compilerOptions: {
				plugins: [customConfig],
			},
		}

		vi.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(tsConfig))
		vi.spyOn(fs, 'existsSync').mockReturnValue(true)

		const config = loadConfig('path/to/config')
		expect(config).toMatchInlineSnapshot(`
			{
			  "foundryProject": false,
			  "libs": [
			    "lib1",
			    "lib2",
			  ],
			  "remappings": {},
			  "solcVersion": "0.9.0",
			}
		`)
	})

	it('should return the default config when no options are passed in', () => {
		vi.spyOn(fs, 'readFileSync').mockReturnValue(
			JSON.stringify({
				compilerOptions: {
					plugins: [
						{
							name: '@evmts/ts-plugin',
						},
					],
				},
			}),
		)
		vi.spyOn(fs, 'existsSync').mockReturnValue(true)
		const config = loadConfig('path/to/config')
		expect(config).toStrictEqual(defaultConfig)
	})

	it('should work for a jsconfig.json', () => {
		vi.spyOn(fs, 'existsSync').mockImplementation((path) => {
			if (typeof path !== 'string') {
				throw new Error('expected string!')
			}
			if (path.endsWith('tsconfig.json')) {
				return false
			}
			if (path.endsWith('jsconfig.json')) {
				return true
			}
			throw new Error(`unexpected path ${path}`)
		})
		vi.spyOn(fs, 'readFileSync').mockReturnValue(
			JSON.stringify({
				compilerOptions: {
					plugins: [
						{
							name: '@evmts/ts-plugin',
						},
					],
				},
			}),
		)
		const mockFsReadFileSync = fs.readFileSync as MockedFunction<
			typeof fs.readFileSync
		>
		expect(mockFsReadFileSync.mock.lastCall).toMatchInlineSnapshot('undefined')
		const config = loadConfig('path/to/config')
		expect(config).toStrictEqual(defaultConfig)
	})

	it('should work for a tsconfig.json', () => {
		vi.spyOn(fs, 'existsSync').mockImplementation((path) => {
			if (typeof path !== 'string') {
				throw new Error('expected string!')
			}
			if (path.endsWith('tsconfig.json')) {
				return true
			}
			if (path.endsWith('jsconfig.json')) {
				return false
			}
			throw new Error(`unexpected path ${path}`)
		})
		vi.spyOn(fs, 'readFileSync').mockReturnValue(
			JSON.stringify({
				compilerOptions: {
					plugins: [
						{
							name: '@evmts/ts-plugin',
						},
					],
				},
			}),
		)
		const mockFsReadFileSync = fs.readFileSync as MockedFunction<
			typeof fs.readFileSync
		>
		expect(mockFsReadFileSync.mock.lastCall).toMatchInlineSnapshot('undefined')
		const config = loadConfig('path/to/config')
		expect(config).toStrictEqual(defaultConfig)
	})

	it('should return correct config and load foundry remappings when forge is set to true', () => {
		vi.spyOn(fs, 'readFileSync').mockReturnValue(mockTsConfig())
		vi.spyOn(fs, 'existsSync').mockReturnValue(true)
		vi.spyOn(cp, 'execSync').mockReturnValue(
			Buffer.from(
				JSON.stringify({ remappings: { '@foundry': 'node_modules/@foundry' } }),
			),
		)

		const config = loadConfig('path/to/config')
		expect(config).toMatchInlineSnapshot(`
			{
			  "foundryProject": false,
			  "libs": [],
			  "remappings": {},
			  "solcVersion": "0.8.42",
			}
		`)
	})

	it('should return correct config when forge is set to path/to/forge', () => {
		vi.spyOn(fs, 'readFileSync').mockReturnValue(mockTsConfig())
		vi.spyOn(fs, 'existsSync').mockReturnValue(true)

		const config = loadConfig('path/to/config')
		expect(config).toMatchInlineSnapshot(`
			{
			  "foundryProject": false,
			  "libs": [],
			  "remappings": {},
			  "solcVersion": "0.8.42",
			}
		`)
	})

	it('should add the baseUrl to the libs if config and baseUrl are defined', () => {
		vi.spyOn(fs, 'readFileSync').mockReturnValue(
			JSON.stringify({
				compilerOptions: {
					plugins: [
						{
							name: '@evmts/ts-plugin',
							libs: ['lib1'],
						},
					],
					baseUrl: 'basepath',
				},
			}),
		)

		const config = loadConfig('path/to/config')

		expect(config.libs).toEqual(['lib1', 'path/to/config/basepath'])
	})

	it('should use default config when Evmts plugin is not found', () => {
		vi.spyOn(fs, 'readFileSync').mockReturnValue(
			JSON.stringify({
				compilerOptions: {},
			}),
		)

		const config = loadConfig('path/to/config')

		expect(config).toEqual(defaultConfig)
	})

	it('should add baseUrl to the libs in default config when Evmts plugin is not found and baseUrl is defined', () => {
		vi.spyOn(fs, 'readFileSync').mockReturnValue(
			JSON.stringify({
				compilerOptions: {
					baseUrl: 'basepath',
				},
			}),
		)

		const config = loadConfig('path/to/config')

		expect(config.libs).toEqual([
			...(defaultConfig.libs ?? []),
			'path/to/config/basepath',
		])
	})

	it('should log a warning when Evmts plugin is not found', () => {
		const mockLogger = {
			error: vi.fn(),
			warn: vi.fn(),
		}

		vi.spyOn(fs, 'readFileSync').mockReturnValue(
			JSON.stringify({
				compilerOptions: {},
			}),
		)

		loadConfig('path/to/config', mockLogger)

		expect(mockLogger.warn).toHaveBeenCalledWith(
			'No Evmts plugin found in tsconfig.json. Using the default config',
		)
	})

	it('should work when jsonc (json with comments) is passed in', () => {
		const tsConfig = `{
			"compilerOptions": {
				// evmts config is the best tool
				"plugins": [{name: "@evmts/ts-plugin"}],
			},
		}`
		vi.spyOn(fs, 'readFileSync').mockReturnValue(tsConfig)
		vi.spyOn(fs, 'existsSync').mockReturnValue(true)
		const config = loadConfig('path/to/config')
		expect(config).toMatchInlineSnapshot(`
			{
			  "foundryProject": false,
			  "libs": [],
			  "remappings": {},
			  "solcVersion": "0.8.42",
			}
		`)
	})
})
