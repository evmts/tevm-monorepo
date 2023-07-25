import type { EvmtsConfig } from './Config'
import { type DeprecatedConfig, handleDeprecations } from './handleDeprecations'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe(handleDeprecations.name, () => {
	let consoleWarnStub = {
		warn: vi.fn(),
	}

	beforeEach(() => {
		consoleWarnStub = {
			warn: vi.fn(),
		}
		vi.stubGlobal('console', consoleWarnStub)
	})

	afterEach(() => {
		vi.resetAllMocks()
	})

	it('should return the same config if no deprecated properties are used', () => {
		const originalConfig: EvmtsConfig = {
			compiler: {
				solcVersion: '0.8.20',
				libs: [],
				foundryProject: false,
			},
			localContracts: {
				contracts: [],
			},
		}
		const newConfig = handleDeprecations(originalConfig)
		expect(newConfig).toStrictEqual(originalConfig)
		expect(consoleWarnStub.warn).toBeCalledTimes(0)
		expect(newConfig).toMatchInlineSnapshot(`
      {
        "compiler": {
          "foundryProject": false,
          "libs": [],
          "solcVersion": "0.8.20",
        },
        "localContracts": {
          "contracts": [],
        },
      }
    `)
	})

	it('should return undefined if no config is passed', () => {
		const newConfig = handleDeprecations(undefined)
		expect(newConfig).toBeUndefined()
		expect(newConfig).toMatchInlineSnapshot('undefined')
	})

	it('should handle deployments deprecation correctly', () => {
		const originalConfig: DeprecatedConfig = {
			deployments: [
				{
					name: 'test',

					addresses: {
						1: '0x123',
					},
				},
			],
		}
		const newConfig = handleDeprecations(originalConfig)
		expect(newConfig?.localContracts?.contracts).toStrictEqual(
			originalConfig?.deployments,
		)
		expect(consoleWarnStub.warn).toBeCalledTimes(1)
		expect(newConfig).toMatchInlineSnapshot(`
      {
        "localContracts": {
          "contracts": [
            {
              "addresses": {
                "1": "0x123",
              },
              "name": "test",
            },
          ],
        },
      }
    `)
	})

	it('should handle forge deprecation correctly', () => {
		const originalConfig = { forge: true }
		const newConfig = handleDeprecations(originalConfig)
		expect(newConfig?.compiler?.foundryProject).toStrictEqual(
			originalConfig.forge,
		)
		expect(consoleWarnStub.warn).toBeCalledTimes(1)
		expect(newConfig).toMatchInlineSnapshot(`
      {
        "compiler": {
          "foundryProject": true,
        },
      }
    `)
	})

	it('should handle libs deprecation correctly', () => {
		const originalConfig = { libs: ['lib1', 'lib2'] }
		const newConfig = handleDeprecations(originalConfig)
		expect(newConfig?.compiler?.libs).toStrictEqual(originalConfig.libs)
		expect(consoleWarnStub.warn).toBeCalledTimes(1)
		expect(newConfig).toMatchInlineSnapshot(`
      {
        "compiler": {
          "libs": [
            "lib1",
            "lib2",
          ],
        },
      }
    `)
	})

	it('should handle solcVersion deprecation correctly', () => {
		const originalConfig = { solcVersion: '0.8.9' }
		const newConfig = handleDeprecations(originalConfig)
		expect(newConfig?.compiler?.solcVersion).toStrictEqual(
			originalConfig.solcVersion,
		)
		expect(consoleWarnStub.warn).toBeCalledTimes(1)
		expect(newConfig).toMatchInlineSnapshot(`
      {
        "compiler": {
          "solcVersion": "0.8.9",
        },
      }
    `)
	})

	it('should handle all deprecated properties together correctly', () => {
		const originalConfig: DeprecatedConfig = {
			deployments: [
				{
					name: 'test',
					addresses: {
						1: '0x123',
					},
				},
			],
			forge: true,
			libs: ['lib1', 'lib2'],
			solcVersion: '0.8.9',
		}
		const newConfig = handleDeprecations(originalConfig)
		expect(newConfig).toMatchInlineSnapshot(`
			{
			  "compiler": {
			    "solcVersion": "0.8.9",
			  },
			  "deployments": [
			    {
			      "addresses": {
			        "1": "0x123",
			      },
			      "name": "test",
			    },
			  ],
			  "forge": true,
			  "libs": [
			    "lib1",
			    "lib2",
			  ],
			}
		`)
		expect(consoleWarnStub.warn).toBeCalledTimes(4)
	})

	it('should handle some deprecated properties together correctly', () => {
		const originalConfig: DeprecatedConfig = {
			deployments: [
				{
					name: 'test',
					addresses: {
						1: '0x123',
					},
				},
			],
			libs: ['lib1', 'lib2'],
		}
		const newConfig = handleDeprecations(originalConfig)
		expect(newConfig).toMatchInlineSnapshot(`
			{
			  "compiler": {
			    "libs": [
			      "lib1",
			      "lib2",
			    ],
			  },
			  "deployments": [
			    {
			      "addresses": {
			        "1": "0x123",
			      },
			      "name": "test",
			    },
			  ],
			}
		`)
		expect(consoleWarnStub.warn).toBeCalledTimes(2)
	})

	it('should handle deployments and localContracts.contracts together correctly', () => {
		const originalConfig: DeprecatedConfig = {
			deployments: [
				{
					name: 'test',
					addresses: {
						1: '0x123',
					},
				},
			],
			localContracts: {
				contracts: [
					{
						name: 'newTest',
						addresses: {
							1: '0x456',
						},
					},
				],
			},
		}
		const newConfig = handleDeprecations(originalConfig)
		expect(newConfig?.localContracts?.contracts).toStrictEqual(
			originalConfig.localContracts?.contracts,
		)
		expect(consoleWarnStub.warn).toBeCalledTimes(1)
	})

	it('should handle forge and compiler.foundryProject together correctly', () => {
		const originalConfig: DeprecatedConfig = {
			forge: true,
			compiler: {
				foundryProject: false,
			},
		}
		const newConfig = handleDeprecations(originalConfig)
		expect(newConfig?.compiler?.foundryProject).toStrictEqual(
			originalConfig.compiler?.foundryProject,
		)
		expect(consoleWarnStub.warn).toBeCalledTimes(1)
	})

	it('should handle libs and compiler.libs together correctly', () => {
		const originalConfig: DeprecatedConfig = {
			libs: ['lib1', 'lib2'],
			compiler: {
				libs: ['lib3', 'lib4'],
			},
		}
		const newConfig = handleDeprecations(originalConfig)
		expect(newConfig?.compiler?.libs).toStrictEqual([
			'lib3',
			'lib4',
			'lib1',
			'lib2',
		])
		expect(consoleWarnStub.warn).toBeCalledTimes(1)
	})

	it('should handle solcVersion and compiler.solcVersion together correctly', () => {
		const originalConfig: DeprecatedConfig = {
			solcVersion: '0.8.9',
			compiler: {
				solcVersion: '0.8.10',
			},
		}
		const newConfig = handleDeprecations(originalConfig)
		expect(newConfig?.compiler?.solcVersion).toStrictEqual(
			originalConfig.compiler?.solcVersion,
		)
		expect(consoleWarnStub.warn).toBeCalledTimes(1)
	})
})
