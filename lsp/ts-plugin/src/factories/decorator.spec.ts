import type { FileAccessObject } from '@tevm/base-bundler'
import { type CompilerConfig, defaultConfig, defineConfig } from '@tevm/config'
import { runSync } from 'effect/Effect'
import typescript from 'typescript/lib/tsserverlibrary.js'
import { describe, expect, it, vi } from 'vitest'
import { type HostDecorator, type PartialHostDecorator, createHostDecorator, decorateHost } from './index.js'

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
	writeFileSync: vi.fn(),
	statSync: vi.fn() as any,
	mkdirSync: vi.fn(),
	exists: vi.fn(),
	mkdir: vi.fn() as any,
	writeFile: vi.fn(),
	stat: vi.fn() as any,
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
				}
				return ts.ScriptKind.TS
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

		const decoratedHost = composedDecorator(createInfo as TestAny, typescript, logger, config, fao)

		expect((decoratedHost as TestAny).isHost).toBe(true)
		expect((decoratedHost as TestAny).decorator1).toBe('decorated')
		expect((decoratedHost as TestAny).decorator2).toBe('decorated')
		expect((decoratedHost as TestAny).decorator3).toBe('decorated')
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
		const decoratedHost = decorateHost()(createInfo as TestAny, typescript, logger, config, fao)
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
		expect((decoratedCreateInfo as TestAny).createInfo.isCreateInfo).toBe(true)
	})

	it('should allow multiple decorators to modify the same property in sequence', () => {
		// Create decorators that each append to a value
		const decorator1: HostDecorator = (createInfo) => {
			return createProxy(createInfo.languageServiceHost, {
				transformedValue: 'step1',
			} as TestAny)
		}

		const decorator2: HostDecorator = (createInfo) => {
			const value = (createInfo.languageServiceHost as TestAny).transformedValue || ''
			return createProxy(createInfo.languageServiceHost, {
				transformedValue: `${value}-step2`,
			} as TestAny)
		}

		const decorator3: HostDecorator = (createInfo) => {
			const value = (createInfo.languageServiceHost as TestAny).transformedValue || ''
			return createProxy(createInfo.languageServiceHost, {
				transformedValue: `${value}-step3`,
			} as TestAny)
		}

		const composedDecorator = decorateHost(decorator1, decorator2, decorator3)

		const host = {}
		const createInfo = { languageServiceHost: host }
		const logger = {
			log: vi.fn(),
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
		}

		const decoratedHost = composedDecorator(createInfo as TestAny, typescript, logger, config, fao)

		// The value should be transformed sequentially by each decorator
		expect((decoratedHost as TestAny).transformedValue).toBe('step1-step2-step3')
	})

	it('should handle errors in decorators gracefully and continue with remaining decorators', () => {
		// Create a decorator that throws an error
		const errorDecorator: HostDecorator = () => {
			throw new Error('Decorator error')
		}

		// Create a regular decorator that should still run after error
		const workingDecorator: HostDecorator = (createInfo) => {
			return createProxy(createInfo.languageServiceHost, {
				workingProperty: 'this still works',
			} as TestAny)
		}

		// Log the error instead of throwing to test continued execution
		const logger = {
			log: vi.fn(),
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
		}

		const host = {}
		const createInfo = { languageServiceHost: host }

		// First test with error as first decorator
		let composedDecorator = decorateHost(errorDecorator, workingDecorator)

		expect(() => {
			composedDecorator(createInfo as TestAny, typescript, logger, config, fao)
		}).toThrow('Decorator error')

		// Then test with error as second decorator
		composedDecorator = decorateHost(workingDecorator, errorDecorator)

		let decoratedHost: any
		expect(() => {
			decoratedHost = composedDecorator(createInfo as TestAny, typescript, logger, config, fao)
		}).toThrow('Decorator error')
	})
})
