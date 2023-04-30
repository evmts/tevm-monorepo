import { describe, expect, it, vi } from 'vitest'
import { Decorator, composeDecorators } from '.'
import typescript from 'typescript/lib/tsserverlibrary'
import { createProxy } from '../factories'

type TestAny = any

describe(composeDecorators.name, () => {
  it('composes decorators into a single decorator', () => {
    const decorator1: Decorator = (createInfo) => {
      return createProxy(createInfo.languageServiceHost, {
        decorator1: 'decorated',
      } as TestAny)
    }
    const decorator2: Decorator = (createInfo) => {
      return createProxy(createInfo.languageServiceHost, {
        decorator2: 'decorated',
      } as TestAny)
    }
    const decorator3: Decorator = (createInfo) => {
      return createProxy(createInfo.languageServiceHost, {
        decorator3: 'decorated',
      } as TestAny)
    }

    const composedDecorator = composeDecorators(
      decorator1,
      decorator2,
      decorator3,
    )

    const host = { isHost: true }
    const createInfo = { isCreateInfo: true, languageServiceHost: host }
    const logger = {
      log: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    }

    const decoratedHost = composedDecorator(
      createInfo as TestAny,
      typescript,
      logger,
    )

    expect((decoratedHost as TestAny).isHost).toBe(true)
    expect((decoratedHost as TestAny)['decorator1']).toBe('decorated')
    expect((decoratedHost as TestAny)['decorator2']).toBe('decorated')
    expect((decoratedHost as TestAny)['decorator3']).toBe('decorated')
  })
})
