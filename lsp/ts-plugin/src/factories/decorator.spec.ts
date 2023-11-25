import {
	HostDecorator,
	PartialHostDecorator,
	createHostDecorator,
	decorateHost,
} from './index.js'
import { FileAccessObject } from '@evmts/base'
import { CompilerConfig, defaultConfig, defineConfig } from '@evmts/config'
import { runSync } from 'effect/Effect'
import typescript from 'typescript/lib/tsserverlibrary.js'
import { describe, expect, it, vi } from 'vitest'

type TestAny = any

const { remappings, ...compilerOptions } = defaultConfig

const mockConfig: CompilerConfig = {
	...defaultConfig,
	...compilerOptions,
}

const config = runSync(defineConfig(() => mockConfig).configFn('.'))

const fao: FileAccessObject = {
	existsSync: vi.fn(),
	readFile: vi.fn(),
	readFileSync: vi.fn(),
}

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

describe(createHostDecorator.name, () => {
	it('should define a decorator by passing a functiont hat returns a partial tsserver object', () => {
		const decoratorFn: PartialHostDecorator = (createInfo, ts, logger) => ({
			getScriptKind: (fileName: string) => {
				if (fileName.endsWith('.json')) {
					return ts.ScriptKind.JSON
				} else {
					return ts.ScriptKind.TS
				}
			},
		})

		const decorator = createHostDecorator(decoratorFn)
		const createInfo = { languageServiceHost: {} } as any
		const logger = {
			error: vi.fn(),
			info: vi.fn(),
			log: vi.fn(),
			warn: vi.fn(),
		} as any

		const host = decorator(createInfo, typescript, logger, config, fao)

		expect(host.getScriptKind?.('foo.json')).toBe(typescript.ScriptKind.JSON)
		expect(host.getScriptKind?.('foo.ts')).toBe(typescript.ScriptKind.TS)
	})
})

describe(decorateHost.name, () => {
	it('composes decorators into a single decorator', () => {
		const decorator1: HostDecorator = (createInfo) => {
			return createProxy(createInfo.languageServiceHost, {
				decorator1: 'decorated',
			} as TestAny)
		}
		const decorator2: HostDecorator = (createInfo) => {
			return createProxy(createInfo.languageServiceHost, {
				decorator2: 'decorated',
			} as TestAny)
		}
		const decorator3: HostDecorator = (createInfo) => {
			return createProxy(createInfo.languageServiceHost, {
				decorator3: 'decorated',
			} as TestAny)
		}

		const composedDecorator = decorateHost(decorator1, decorator2, decorator3)

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
			fao,
		)

		expect((decoratedHost as TestAny).isHost).toBe(true)
		expect((decoratedHost as TestAny)['decorator1']).toBe('decorated')
		expect((decoratedHost as TestAny)['decorator2']).toBe('decorated')
		expect((decoratedHost as TestAny)['decorator3']).toBe('decorated')
	})

	it('should return the original languageServiceHost when no decorators are provided', () => {
		const host = { isHost: true }
		const createInfo = { isCreateInfo: true, languageServiceHost: host }
		const logger = {
			log: vi.fn(),
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
		}
		const decoratedHost = decorateHost()(
			createInfo as TestAny,
			typescript,
			logger,
			config,
			fao,
		)
		expect(decoratedHost).toBe(host)
	})

	it('should preserve the non-languageServiceHost properties of createInfo', () => {
		const decorator: HostDecorator = (createInfo) => {
			expect((createInfo as TestAny).isCreateInfo).toBe(true)
			return { ...createInfo.languageServiceHost, createInfo }
		}

		const host = { isHost: true }
		const createInfo = { isCreateInfo: true, languageServiceHost: host }
		const logger = {
			log: vi.fn(),
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
		}

		const decoratedCreateInfo = decorateHost(decorator, decorator)(
			createInfo as TestAny,
			typescript,
			logger,
			config,
			fao,
		)

		// Check that the non-languageServiceHost property 'isCreateInfo' has been preserved
		expect((decoratedCreateInfo as TestAny).createInfo['isCreateInfo']).toBe(
			true,
		)
	})
})
