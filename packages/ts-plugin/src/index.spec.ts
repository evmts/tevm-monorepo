import init from '.'
import typescript from 'typescript/lib/tsserverlibrary'
import { describe, expect, it, vi } from 'vitest'

type TestAny = any

const createInfo: typescript.server.PluginCreateInfo = {
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

describe(init.name, () => {
  it('should return a create decorator', () => {
    const languageServer = init({ typescript })
    expect(Object.keys(languageServer)).toEqual(['create'])
    const host = languageServer.create(createInfo)
    expect(host).toMatchInlineSnapshot(`
			{
			  "getResolvedModuleWithFailedLookupLocationsFromCache": [MockFunction spy],
			  "getScriptKind": [Function],
			  "getScriptSnapshot": [Function],
			  "resolveModuleNameLiterals": [Function],
			}
		`)
  })
})
