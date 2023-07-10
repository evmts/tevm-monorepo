import { resolveModuleNameLiteralsDecorator } from '.'
import { Config } from '@evmts/config'
import typescript from 'typescript/lib/tsserverlibrary'
import { describe, expect, it, vi } from 'vitest'

const config: Config = {}

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

		expect(res).toEqual([])
	})
})
