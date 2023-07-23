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
})
