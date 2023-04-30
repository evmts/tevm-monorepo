import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getScriptKindDecorator } from './getScriptKind'
import typescript from 'typescript/lib/tsserverlibrary'

type TestAny = any

describe(getScriptKindDecorator.name, () => {
  let createInfo: TestAny
  let logger: TestAny

  beforeEach(() => {
    createInfo = {
      languageServiceHost: {
        getScriptKind: vi.fn(),
      },
    }
    logger = {
      log: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    }
  })

  it('should decorate getScriptKind', () => {
    expect(
      getScriptKindDecorator(createInfo, typescript, logger).getScriptKind,
    ).toBeInstanceOf(Function)
  })

  it('Should return unknown if no getScriptKind on language host', () => {
    createInfo.languageServiceHost.getScriptKind = undefined
    const logger = {
      log: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    }
    const decorated = getScriptKindDecorator(createInfo, typescript, logger)
    expect(decorated.getScriptKind?.('foo')).toBe(typescript.ScriptKind.Unknown)
  })

  it('Should return TS if file is solidity', () => {
    const decorated = getScriptKindDecorator(createInfo, typescript, logger)
    expect(decorated.getScriptKind?.('foo.sol')).toBe(typescript.ScriptKind.TS)
    expect(decorated.getScriptKind?.('./foo.sol')).toBe(
      typescript.ScriptKind.TS,
    )
  })

  it('Should proxy to languageServiceHost.getScriptKind if not solidity', () => {
    const decorated = getScriptKindDecorator(createInfo, typescript, logger)
    const expected = typescript.ScriptKind.JS
    createInfo.languageServiceHost.getScriptKind.mockReturnValue(expected)
    const fileNames = [
      'foo.js',
      'foo.sol.js',
      'sol.js',
      '.sol.js',
      'sol.sol.sol.sol.js',
    ]
    fileNames.forEach((fileName) => {
      expect(decorated.getScriptKind?.(fileName)).toBe(expected)
      expect(
        createInfo.languageServiceHost.getScriptKind,
      ).toHaveBeenLastCalledWith(fileName)
    })
  })
})
