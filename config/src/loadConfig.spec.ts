import { type EvmtsConfig, defaultConfig, loadConfig } from '.'
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
						localContracts: {
							contracts: [
								{
									name: 'WagmiMintExample',
									addresses: {
										'1': '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
										'5': '0x1df10ec981ac5871240be4a94f250dd238b77901',
										'10': '0x1df10ec981ac5871240be4a94f250dd238b77901',
									},
								},
							],
						},
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
		vi.spyOn(fs, 'readFileSync').mockReturnValue('invalid json')

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
						compiler: {
							solcVersion: '0.9.0',
							libs: ['path/to/libs'],
						},
						localContracts: {
							contracts: [
								{
									name: 'WagmiMintExample',
									addresses: {
										'1': '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
										'5': '0x1df10ec981ac5871240be4a94f250dd238b77901',
										'10': '0x1df10ec981ac5871240be4a94f250dd238b77901',
									},
								},
							],
						},
					},
				],
			},
		})
		vi.spyOn(fs, 'readFileSync').mockReturnValue(validConfig)
		const config = loadConfig('nonexistentpath')
		expect(config).toMatchInlineSnapshot(`
			{
			  "compiler": {
			    "foundryProject": false,
			    "libs": [
			      "path/to/libs",
			    ],
			    "remappings": {},
			    "solcVersion": "0.9.0",
			  },
			  "externalContracts": {
			    "apiKeys": {
			      "etherscan": {},
			    },
			    "contracts": [],
			    "out": "externalContracts",
			  },
			  "localContracts": {
			    "contracts": [
			      {
			        "addresses": {
			          "1": "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
			          "10": "0x1df10ec981ac5871240be4a94f250dd238b77901",
			          "5": "0x1df10ec981ac5871240be4a94f250dd238b77901",
			        },
			        "name": "WagmiMintExample",
			      },
			    ],
			  },
			}
		`)
	})

	it('should return the correct config when most options are passed in', () => {
		const customConfig: EvmtsConfig = {
			name: '@evmts/ts-plugin',
			compiler: {
				solcVersion: '0.9.0',
				libs: ['lib1', 'lib2'],
				foundryProject: false,
			},
			localContracts: {
				contracts: [
					{
						name: 'WagmiMintExample',
						addresses: {
							'1': '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
							'5': '0x1df10ec981ac5871240be4a94f250dd238b77901',
							'10': '0x1df10ec981ac5871240be4a94f250dd238b77901',
						},
					},
				],
			},
			externalContracts: {
				out: 'path/to/out',
				apiKeys: {
					etherscan: {
						1: '$ETHERSCAN_KEY',
					},
				},
				contracts: [
					{
						type: 'etherscan',
						addresses: {
							1: '0x4df10ec981ac5871240be4a94f250dd238b77904',
						},
						name: 'MyExternalContract',
					},
				],
			},
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
			  "compiler": {
			    "foundryProject": false,
			    "libs": [
			      "lib1",
			      "lib2",
			    ],
			    "remappings": {},
			    "solcVersion": "0.9.0",
			  },
			  "externalContracts": {
			    "apiKeys": {
			      "etherscan": {
			        "1": "MY_ETHERSCAN_KEY",
			        "10": undefined,
			        "137": undefined,
			        "42161": undefined,
			        "56": undefined,
			      },
			    },
			    "contracts": [
			      {
			        "addresses": {
			          "1": "0x4df10ec981ac5871240be4a94f250dd238b77904",
			        },
			        "name": "MyExternalContract",
			        "type": "etherscan",
			      },
			    ],
			    "out": "path/to/out",
			  },
			  "localContracts": {
			    "contracts": [
			      {
			        "addresses": {
			          "1": "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
			          "10": "0x1df10ec981ac5871240be4a94f250dd238b77901",
			          "5": "0x1df10ec981ac5871240be4a94f250dd238b77901",
			        },
			        "name": "WagmiMintExample",
			      },
			    ],
			  },
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
			  "compiler": {
			    "foundryProject": false,
			    "libs": [],
			    "remappings": {},
			    "solcVersion": "0.8.42",
			  },
			  "externalContracts": {
			    "apiKeys": {
			      "etherscan": {},
			    },
			    "contracts": [],
			    "out": "externalContracts",
			  },
			  "localContracts": {
			    "contracts": [
			      {
			        "addresses": {
			          "1": "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
			          "10": "0x1df10ec981ac5871240be4a94f250dd238b77901",
			          "5": "0x1df10ec981ac5871240be4a94f250dd238b77901",
			        },
			        "name": "WagmiMintExample",
			      },
			    ],
			  },
			}
		`)
	})

	it('should return correct config when forge is set to path/to/forge', () => {
		vi.spyOn(fs, 'readFileSync').mockReturnValue(mockTsConfig())
		vi.spyOn(fs, 'existsSync').mockReturnValue(true)

		const config = loadConfig('path/to/config')
		expect(config).toMatchInlineSnapshot(`
			{
			  "compiler": {
			    "foundryProject": false,
			    "libs": [],
			    "remappings": {},
			    "solcVersion": "0.8.42",
			  },
			  "externalContracts": {
			    "apiKeys": {
			      "etherscan": {},
			    },
			    "contracts": [],
			    "out": "externalContracts",
			  },
			  "localContracts": {
			    "contracts": [
			      {
			        "addresses": {
			          "1": "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
			          "10": "0x1df10ec981ac5871240be4a94f250dd238b77901",
			          "5": "0x1df10ec981ac5871240be4a94f250dd238b77901",
			        },
			        "name": "WagmiMintExample",
			      },
			    ],
			  },
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
							compiler: {
								libs: ['lib1'],
							},
						},
					],
					baseUrl: 'basepath',
				},
			}),
		)

		const config = loadConfig('path/to/config')

		expect(config.compiler.libs).toEqual(['lib1', 'path/to/config/basepath'])
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

		expect(config.compiler.libs).toEqual([
			...(defaultConfig.compiler.libs ?? []),
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

	it('shoudl expand env', () => {
		const customConfig: EvmtsConfig = {
			name: '@evmts/ts-plugin',
			externalContracts: {
				out: 'path/to/out',
				apiKeys: {
					etherscan: {
						1: '$ETHERSCAN_KEY',
					},
				},
				contracts: [
					{
						type: 'etherscan',
						name: 'MyContract',
						addresses: {
							1: '0x8F0EBDaA1cF7106bE861753B0f9F5c0250fE0819',
						},
					},
				],
			},
		}
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
			  "compiler": {
			    "foundryProject": false,
			    "libs": [],
			    "remappings": {},
			    "solcVersion": "0.8.42",
			  },
			  "externalContracts": {
			    "apiKeys": {
			      "etherscan": {
			        "1": "MY_ETHERSCAN_KEY",
			        "10": undefined,
			        "137": undefined,
			        "42161": undefined,
			        "56": undefined,
			      },
			    },
			    "contracts": [
			      {
			        "addresses": {
			          "1": "0x8F0EBDaA1cF7106bE861753B0f9F5c0250fE0819",
			        },
			        "name": "MyContract",
			        "type": "etherscan",
			      },
			    ],
			    "out": "path/to/out",
			  },
			  "localContracts": {
			    "contracts": [],
			  },
			}
		`)
	})
})
