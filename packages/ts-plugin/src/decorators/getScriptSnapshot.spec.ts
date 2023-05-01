import { getScriptSnapshotDecorator } from '.'
import { Config } from '../factories'
import typescript from 'typescript/lib/tsserverlibrary'
import { describe, expect, it, vi } from 'vitest'

const config: Config = {
  name: '@evmts/ts-plugin',
  project: '.',
}

describe(getScriptSnapshotDecorator.name, () => {
  it('should proxy to the languageServiceHost for non solidity files', () => {
    const logger = {
      info: vi.fn(),
      error: vi.fn(),
      log: vi.fn(),
      warn: vi.fn(),
    }
    const languageServiceHost = {
      getScriptSnapshot: vi.fn(),
    }
    const expectedReturn = `
    export type Foo = string
    `
    languageServiceHost.getScriptSnapshot.mockReturnValue(expectedReturn)
    const decorator = getScriptSnapshotDecorator(
      { languageServiceHost } as any,
      typescript,
      logger,
      config,
    )
    const fileName = 'foo.ts'
    const result = decorator.getScriptSnapshot(fileName)
    expect(result).toEqual(expectedReturn)
    expect(languageServiceHost.getScriptSnapshot).toHaveBeenCalledWith(fileName)
  })
})
