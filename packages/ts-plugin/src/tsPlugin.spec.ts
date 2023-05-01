import tsPlugin from '.'
import { Config } from './factories'
import typescript from 'typescript/lib/tsserverlibrary'
import { Mock, describe, expect, it, vi } from 'vitest'

type TestAny = any

const config: Config = {
  name: '@evmts/ts-plugin',
  project: '.',
}

const createInfo: typescript.server.PluginCreateInfo = {
  config,
  languageServiceHost: {
    resolveModuleNameLiterals: vi.fn(),
    getScriptSnapshot: vi.fn(),
    getScriptKind: vi.fn(),
    getResolvedModuleWithFailedLookupLocationsFromCache: vi.fn(),
  },
  project: {
    getCompilerOptions: () => ({ baseUrl: 'foo' }),
    projectService: {
      logger: {
        info: vi.fn(),
      },
    },
  },
} as TestAny
;(createInfo.languageServiceHost.getScriptKind as Mock).mockImplementation(
  (fileName: string) => {
    if (fileName.endsWith('.ts')) {
      return typescript.ScriptKind.TS
    }
    return typescript.ScriptKind.Unknown
  },
)

describe(tsPlugin.name, () => {
  it('should return a create decorator', () => {
    const decorator = tsPlugin({ typescript })
    expect(Object.keys(decorator)).toEqual(['create'])
    const host = decorator.create(createInfo)
    expect(host).toMatchInlineSnapshot(`
			{
			  "getResolvedModuleWithFailedLookupLocationsFromCache": [MockFunction spy],
			  "getScriptKind": [Function],
			  "getScriptSnapshot": [Function],
			  "resolveModuleNameLiterals": [Function],
			}
		`)
  })

  it('should handle a .sol file', () => {
    const decorator = tsPlugin({ typescript })
    decorator.create(createInfo)
    // TODO call resolveModuleNameLiterals
    // TODO call getScriptSnapshot
  })
})
