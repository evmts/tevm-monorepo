import { handleDeprecations } from './handleDeprecations'
import { EVMtsConfig } from './EVMtsConfig'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

describe(handleDeprecations.name, () => {
  let consoleWarnStub = {
    warn: vi.fn()
  }

  beforeEach(() => {
    consoleWarnStub = {
      warn: vi.fn()
    }
    vi.stubGlobal('console', consoleWarnStub)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should return the same config if no deprecated properties are used', () => {
    const originalConfig: EVMtsConfig = {
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
  })

  it('should return undefined if no config is passed', () => {
    const newConfig = handleDeprecations(undefined)
    expect(newConfig).toBeUndefined()
  })

  it('should handle deployments deprecation correctly', () => {
    const originalConfig = {
      deployments: { testDeployment: { from: '0x0', gasPrice: 20 } },
    }
    const newConfig = handleDeprecations(originalConfig as any)
    expect(newConfig?.localContracts?.contracts).toStrictEqual(originalConfig?.deployments)
    expect(consoleWarnStub.warn).toBeCalledTimes(1)
  })

  it('should handle forge deprecation correctly', () => {
    const originalConfig = { forge: true }
    const newConfig = handleDeprecations(originalConfig as any)
    expect(newConfig?.compiler?.foundryProject).toStrictEqual(originalConfig.forge)
    expect(consoleWarnStub.warn).toBeCalledTimes(1)
  })

  it('should handle libs deprecation correctly', () => {
    const originalConfig = { libs: ['lib1', 'lib2'] }
    const newConfig = handleDeprecations(originalConfig as any)
    expect(newConfig?.compiler?.libs).toStrictEqual(originalConfig.libs)
    expect(consoleWarnStub.warn).toBeCalledTimes(1)
  })

  it('should handle solcVersion deprecation correctly', () => {
    const originalConfig = { solcVersion: '0.8.9' }
    const newConfig = handleDeprecations(originalConfig as any)
    expect(newConfig?.compiler?.solcVersion).toStrictEqual(originalConfig.solcVersion)
    expect(consoleWarnStub.warn).toBeCalledTimes(1)
  })
})
