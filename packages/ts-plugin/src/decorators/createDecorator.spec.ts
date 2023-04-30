import { DecoratorFn, createDecorator } from './createDecorator'
import typescript from 'typescript/lib/tsserverlibrary'
import { describe, expect, it, vi } from 'vitest'

describe(createDecorator.name, () => {
  it('should define a decorator by passing a functiont hat returns a partial tsserver object', () => {
    const DecoratorFn: DecoratorFn = (createInfo, ts, logger) => ({
      getScriptKind: (fileName) => {
        if (fileName.endsWith('.json')) {
          return ts.ScriptKind.JSON
        } else {
          return ts.ScriptKind.TS
        }
      },
    })

    const mockDecoratorFn = vi.fn()
    mockDecoratorFn.mockImplementation(DecoratorFn)
    const decorator = createDecorator(mockDecoratorFn)
    const createInfo = { languageServiceHost: {} } as any
    const logger = {
      error: vi.fn(),
      info: vi.fn(),
      log: vi.fn(),
      warn: vi.fn(),
    } as any

    const host = decorator(createInfo, typescript, logger)

    expect(mockDecoratorFn).toHaveBeenCalledWith(createInfo, typescript, logger)

    expect(host.getScriptKind?.('foo.json')).toMatchInlineSnapshot('6')
    expect(host.getScriptKind?.('foo.ts')).toMatchInlineSnapshot('3')
  })
})
