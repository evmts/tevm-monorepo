import { getScriptSnapshotDecorator } from './getScriptSnapshot'
import typescript from 'typescript/lib/tsserverlibrary'
import { describe, expect, it, vi } from 'vitest'

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
    )
    const fileName = 'foo.ts'
    const result = decorator.getScriptSnapshot(fileName)
    expect(result).toEqual(expectedReturn)
    expect(languageServiceHost.getScriptSnapshot).toHaveBeenCalledWith(fileName)
  })
})
