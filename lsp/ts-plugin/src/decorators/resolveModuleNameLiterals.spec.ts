import { statSync } from 'node:fs'
import type { FileAccessObject } from '@tevm/base-bundler'
import { type CompilerConfig, defaultConfig, defineConfig } from '@tevm/config'
import { runSync } from 'effect/Effect'
import typescript from 'typescript/lib/tsserverlibrary.js'
import { type MockedFunction, describe, expect, it, vi } from 'vitest'
import { solidityModuleResolver } from '../utils/index.js'
import { resolveModuleNameLiteralsDecorator } from './resolveModuleNameLiterals.js'

const { remappings, ...compilerOptions } = defaultConfig
const mockConfig: CompilerConfig = {
	...defaultConfig,
	...compilerOptions,
}
const config = runSync(defineConfig(() => mockConfig).configFn('.'))

const fao: FileAccessObject = {
	existsSync: vi.fn(),
	readFileSync: vi.fn(),
	readFile: vi.fn(),
	writeFileSync: vi.fn(),
	statSync: vi.fn().mockImplementation(statSync),
	stat: vi.fn() as any,
	mkdirSync: vi.fn(),
	exists: vi.fn(),
	mkdir: vi.fn() as any,
	writeFile: vi.fn(),
}

const mockSolidityModuleResolver = solidityModuleResolver as MockedFunction<typeof solidityModuleResolver>

// mock solidityModuleResolver
vi.mock('../utils', () => {
	return {
		solidityModuleResolver: vi.fn(),
	}
})

describe(resolveModuleNameLiteralsDecorator.name, () => {
	it('should decorate resolveModuleNameLiterals', () => {
		const logger = {
			info: vi.fn(),
			error: vi.fn(),
			log: vi.fn(),
			warn: vi.fn(),
		}
		const createInfo = {
			languageServiceHost: {
				resolveModuleNameLiterals: vi.fn(),
			},
			project: {
				getCompilerOptions: () => ({ baseUrl: 'foo' }),
				projectService: {
					logger: {
						info: vi.fn(),
					},
				},
			},
		} as any
		const host = resolveModuleNameLiteralsDecorator(createInfo, typescript, logger, config, fao)

		expect(host).toMatchInlineSnapshot(`
			{
			  "resolveModuleNameLiterals": [Function],
			}
		`)

		const moduleNames: any[] = []
		const containingFile = 'foo.ts'
		const rest = [{} as any, {} as any, {} as any, {} as any] as const

		const res = host.resolveModuleNameLiterals?.(moduleNames, containingFile, ...rest)

		expect(createInfo.languageServiceHost.resolveModuleNameLiterals).toHaveBeenCalledWith(
			moduleNames,
			containingFile,
			...rest,
		)

		expect(res).toMatchInlineSnapshot('[]')
	})

	it('should return resolved module when solidityModuleResolver returns a resolved module', () => {
		const logger = {
			info: vi.fn(),
			error: vi.fn(),
			log: vi.fn(),
			warn: vi.fn(),
		}
		const createInfo = {
			languageServiceHost: {
				resolveModuleNameLiterals: vi.fn().mockReturnValue([undefined]),
			},
			project: {
				getCompilerOptions: () => ({ baseUrl: 'foo' }),
				projectService: {
					logger: {
						info: vi.fn(),
					},
				},
			},
		} as any
		const host = resolveModuleNameLiteralsDecorator(createInfo, typescript, logger, config, fao)

		const moduleNames = [{ text: 'moduleName' }]
		const containingFile = 'foo.ts'
		const rest = [{} as any, {} as any, {} as any, {} as any] as const

		// When solidityModuleResolver returns a resolved module
		mockSolidityModuleResolver.mockReturnValueOnce({
			resolvedModule: {},
		} as any)

		const res = host.resolveModuleNameLiterals?.(moduleNames as any, containingFile, ...rest)
		expect(res).toMatchInlineSnapshot(`
			[
			  {
			    "resolvedModule": {
			      "resolvedModule": {},
			    },
			  },
			]
		`)
	})

	it('should handle error when solidityModuleResolver throws an error', () => {
		const logger = {
			info: vi.fn(),
			error: vi.fn(),
			log: vi.fn(),
			warn: vi.fn(),
		}
		const createInfo = {
			languageServiceHost: {
				resolveModuleNameLiterals: vi.fn().mockReturnValue([undefined]),
			},
			project: {
				getCompilerOptions: () => ({ baseUrl: 'foo' }),
				projectService: {
					logger: {
						info: vi.fn(),
					},
				},
			},
		} as any
		const host = resolveModuleNameLiteralsDecorator(createInfo, typescript, logger, config, fao)

		const moduleNames = [{ text: 'moduleName' }]
		const containingFile = 'foo.ts'
		const rest = [{} as any, {} as any, {} as any, {} as any] as const

		// When solidityModuleResolver throws an error
		mockSolidityModuleResolver.mockImplementationOnce(() => {
			throw new Error('Error')
		})

		const res = host.resolveModuleNameLiterals?.(moduleNames as any, containingFile, ...rest)
		expect(res).toMatchInlineSnapshot(`
			[
			  undefined,
			]
		`)
		expect(logger.error.mock.lastCall).toMatchInlineSnapshot(`
			[
			  [Error: Error],
			]
		`)
	})
})
