import { Config, defaultConfig, loadConfig } from '.'
import * as cp from 'child_process'
import * as fs from 'fs'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockTsConfig = (config: Config = {}) => {
	return JSON.stringify(
		{
			compilerOptions: {
				plugins: [
					{
						name: '@evmts/ts-plugin',
						deployments: [
							{
								name: 'WagmiMintExample',
								addresses: {
									'1': '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
									'5': '0x1df10ec981ac5871240be4a94f250dd238b77901',
									'10': '0x1df10ec981ac5871240be4a94f250dd238b77901',
								},
							},
						],
						...config,
					},
				],
			},
			include: ['./src'],
		},
		null,
		2,
	)
}

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
						solcVersion: '0.9.0',
						deployments: [],
						remappings: {},
						libs: [],
					},
				],
			},
		})
		vi.spyOn(fs, 'readFileSync').mockReturnValue(validConfig)
		const config = loadConfig('nonexistentpath')
		expect(config).toMatchInlineSnapshot(`
      {
        "deployments": [],
        "forge": false,
        "libs": [],
        "remappings": {},
        "solcVersion": "0.9.0",
      }
    `)
	})

	it('should return the correct config when most options are passed in', () => {
		const customConfig: Config = {
			solcVersion: '0.9.0',
			libs: ['lib1', 'lib2'],
			forge: false,
		}
		vi.spyOn(cp, 'execSync').mockReturnValue(
			Buffer.from(
				JSON.stringify({ remappings: { '@foundry': 'node_modules/@foundry' } }),
			),
		)
		vi.spyOn(fs, 'readFileSync').mockReturnValue(mockTsConfig(customConfig))
		vi.spyOn(fs, 'existsSync').mockReturnValue(true)

		const config = loadConfig('path/to/config')
		expect(config).toMatchInlineSnapshot(`
      {
        "deployments": [
          {
            "addresses": {
              "1": "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
              "10": "0x1df10ec981ac5871240be4a94f250dd238b77901",
              "5": "0x1df10ec981ac5871240be4a94f250dd238b77901",
            },
            "name": "WagmiMintExample",
          },
        ],
        "forge": false,
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
        "deployments": [
          {
            "addresses": {
              "1": "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
              "10": "0x1df10ec981ac5871240be4a94f250dd238b77901",
              "5": "0x1df10ec981ac5871240be4a94f250dd238b77901",
            },
            "name": "WagmiMintExample",
          },
        ],
        "forge": false,
        "libs": [],
        "remappings": {},
        "solcVersion": "0.8.20",
      }
    `)
	})

	it('should return correct config when forge is set to path/to/forge', () => {
		vi.spyOn(fs, 'readFileSync').mockReturnValue(mockTsConfig())
		vi.spyOn(fs, 'existsSync').mockReturnValue(true)

		const config = loadConfig('path/to/config')
		expect(config).toMatchInlineSnapshot(`
      {
        "deployments": [
          {
            "addresses": {
              "1": "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
              "10": "0x1df10ec981ac5871240be4a94f250dd238b77901",
              "5": "0x1df10ec981ac5871240be4a94f250dd238b77901",
            },
            "name": "WagmiMintExample",
          },
        ],
        "forge": false,
        "libs": [],
        "remappings": {},
        "solcVersion": "0.8.20",
      }
    `)
	})
})
