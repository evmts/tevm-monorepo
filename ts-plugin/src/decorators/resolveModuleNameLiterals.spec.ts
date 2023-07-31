import { resolveModuleNameLiteralsDecorator } from '.'
import { solidityModuleResolver } from '../utils'
import { EvmtsConfig, defaultConfig, defineConfig } from '@evmts/config'
import typescript from 'typescript/lib/tsserverlibrary'
import { MockedFunction, describe, expect, it, vi } from 'vitest'

const { remappings, ...compilerOptions } = defaultConfig.compiler
const mockConfig: EvmtsConfig = {
	...defaultConfig,
	compiler: {
		...compilerOptions,
		solcVersion: '0.8.0',
	},
}
const config = defineConfig(() => mockConfig).configFn('.')

const mockSolidityModuleResolver = solidityModuleResolver as MockedFunction<
	typeof solidityModuleResolver
>

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
		const host = resolveModuleNameLiteralsDecorator(
			createInfo,
			typescript,
			logger,
			config,
		)

		expect(host).toMatchInlineSnapshot(`
			{
			  "resolveModuleNameLiterals": [Function],
			}
		`)

		const moduleNames: any[] = []
		const containingFile = 'foo.ts'
		const rest = [{} as any, {} as any, {} as any, {} as any] as const

		const res = host.resolveModuleNameLiterals?.(
			moduleNames,
			containingFile,
			...rest,
		)

		expect(
			createInfo.languageServiceHost.resolveModuleNameLiterals,
		).toHaveBeenCalledWith(moduleNames, containingFile, ...rest)

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
		const host = resolveModuleNameLiteralsDecorator(
			createInfo,
			typescript,
			logger,
			config,
		)

		const moduleNames = [{ text: 'moduleName' }]
		const containingFile = 'foo.ts'
		const rest = [{} as any, {} as any, {} as any, {} as any] as const

		// When solidityModuleResolver returns a resolved module
		mockSolidityModuleResolver.mockReturnValueOnce({
			resolvedModule: {},
		} as any)

		const res = host.resolveModuleNameLiterals?.(
			moduleNames as any,
			containingFile,
			...rest,
		)
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
		const host = resolveModuleNameLiteralsDecorator(
			createInfo,
			typescript,
			logger,
			config,
		)

		const moduleNames = [{ text: 'moduleName' }]
		const containingFile = 'foo.ts'
		const rest = [{} as any, {} as any, {} as any, {} as any] as const

		// When solidityModuleResolver throws an error
		mockSolidityModuleResolver.mockImplementationOnce(() => {
			throw new Error('Error')
		})

		const res = host.resolveModuleNameLiterals?.(
			moduleNames as any,
			containingFile,
			...rest,
		)
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
