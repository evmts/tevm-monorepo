import { Decorator, PartialDecorator, createDecorator, decorate } from '.'
import { Config } from '@evmts/config'
import typescript from 'typescript/lib/tsserverlibrary'
import { describe, expect, it, vi } from 'vitest'

type TestAny = any

const config: Config = {}

const createProxy = <T extends object>(instance: T, proxy: Partial<T>): T => {
	return new Proxy(instance, {
		get(target, key) {
			// If the key is one of the keys that are to be proxied, return the proxy value.
			if (key in proxy) {
				return proxy[key as keyof T]
			}

			// Otherwise, return the instance value.
			return target[key as keyof T]
		},
	})
}

describe(createDecorator.name, () => {
	it('should define a decorator by passing a functiont hat returns a partial tsserver object', () => {
		const decoratorFn: PartialDecorator = (createInfo, ts, logger) => ({
			getScriptKind: (fileName) => {
				if (fileName.endsWith('.json')) {
					return ts.ScriptKind.JSON
				} else {
					return ts.ScriptKind.TS
				}
			},
		})

		const decorator = createDecorator(decoratorFn)
		const createInfo = { languageServiceHost: {} } as any
		const logger = {
			error: vi.fn(),
			info: vi.fn(),
			log: vi.fn(),
			warn: vi.fn(),
		} as any

		const host = decorator(createInfo, typescript, logger, config)

		expect(host.getScriptKind?.('foo.json')).toBe(typescript.ScriptKind.JSON)
		expect(host.getScriptKind?.('foo.ts')).toBe(typescript.ScriptKind.TS)
	})
})

describe(decorate.name, () => {
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

		const composedDecorator = decorate(decorator1, decorator2, decorator3)

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
			config,
		)

		expect((decoratedHost as TestAny).isHost).toBe(true)
		expect((decoratedHost as TestAny)['decorator1']).toBe('decorated')
		expect((decoratedHost as TestAny)['decorator2']).toBe('decorated')
		expect((decoratedHost as TestAny)['decorator3']).toBe('decorated')
	})
})
