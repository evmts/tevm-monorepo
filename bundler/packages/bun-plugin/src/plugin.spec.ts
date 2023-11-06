import { file } from './bunFile.js'
import { evmtsBunPlugin } from './index.js'
import { bundler } from '@evmts/base'
import { loadConfig } from '@evmts/config'
import { succeed } from 'effect/Effect'
import { exists, readFile } from 'fs/promises'
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@evmts/config', async () => ({
	...((await vi.importActual('@evmts/config')) as {}),
	loadConfig: vi.fn(),
}))

vi.mock('@evmts/base', async () => ({
	...((await vi.importActual('@evmts/base')) as {}),
	bundler: vi.fn(),
}))

vi.mock('fs/promises', async () => ({
	...((await vi.importActual('fs/promises')) as {}),
	exists: vi.fn(),
	readFile: vi.fn().mockReturnValue('export const ExampleContract = {abi: {}}'),
}))

vi.mock('./bunFile', () => ({
	file: vi.fn(),
}))

const mockFile = file as Mock

const mockExists = exists as Mock

const mockBundler = bundler as Mock
const mockLoadConfig = loadConfig as Mock
mockBundler.mockReturnValue({
	resolveEsmModule: vi.fn(),
})

const mockCwd = 'mock/process/dot/cwd'
vi.stubGlobal('process', {
	...process,
	cwd: () => mockCwd,
})

const contractPath = '../../../examples/bun/ExampleContract.sol'

describe('evmtsBunPlugin', () => {
	beforeEach(() => {
		mockFile.mockImplementation((filePath: string) => ({
			exists: () => exists(filePath),
			text: () => readFile(filePath, 'utf8'),
		}))
		mockLoadConfig.mockReturnValue(succeed({}))
		mockBundler.mockReturnValue({
			resolveEsmModule: vi.fn().mockReturnValue({
				code: 'mockedModule',
				modules: {
					[contractPath]: {
						id: require.resolve(contractPath),
						code: 'export const ExampleContract = {abi: {}}',
					},
				},
			}),
		})
	})

	it('should create the plugin correctly', async () => {
		const plugin = evmtsBunPlugin()
		expect(plugin.name).toEqual('@evmts/esbuild-plugin')
	})

	it('Should not specify a target', async () => {
		const plugin = evmtsBunPlugin()
		expect(plugin.target).toBeUndefined()
	})

	it('should load .d.ts and ts files correctly', async () => {
		const plugin = evmtsBunPlugin()

		const mockBuild = {
			onLoad: vi.fn(),
			onResolve: vi.fn(),
			config: {} as any,
		} as any
		await plugin.setup(mockBuild)

		const [onLoadFilter, onLoadFn] = mockBuild.onLoad.mock.lastCall ?? []

		expect(onLoadFilter.filter).toMatchInlineSnapshot('/\\\\\\.sol\\$/')

		mockExists.mockImplementation(async (path) => {
			if (path.endsWith('.d.ts')) return true
			return false
		})
		expect(await onLoadFn({ path: contractPath })).toMatchInlineSnapshot(`
      {
        "contents": "export const ExampleContract = {abi: {}}",
        "watchFiles": [
          "../../../examples/bun/ExampleContract.sol.d.ts",
        ],
      }
    `)

		mockExists.mockImplementation(async (path) => {
			if (path.endsWith('.ts')) return true
			return false
		})
		expect(await onLoadFn({ path: contractPath })).toMatchInlineSnapshot(`
      {
        "contents": "export const ExampleContract = {abi: {}}",
        "watchFiles": [
          "../../../examples/bun/ExampleContract.sol.d.ts",
        ],
      }
    `)
	})

	it('should load sol files correctly', async () => {
		const plugin = evmtsBunPlugin()

		const mockBuild = {
			onLoad: vi.fn(),
			onResolve: vi.fn(),
			config: {} as any,
		} as any
		await plugin.setup(mockBuild)

		const [onLoadFilter, onLoadFn] = mockBuild.onLoad.mock.lastCall ?? []

		expect(onLoadFilter.filter).toMatchInlineSnapshot('/\\\\\\.sol\\$/')

		mockExists.mockImplementation(async (path) => {
			if (path.endsWith('.d.ts')) return true
			if (path.endsWith('.ts')) return true
			return false
		})

		expect(await onLoadFn({ path: contractPath })).toMatchInlineSnapshot(`
      {
        "contents": "export const ExampleContract = {abi: {}}",
        "watchFiles": [
          "../../../examples/bun/ExampleContract.sol.d.ts",
        ],
      }
    `)
	})

	it('should resolve @evmts/core correctly when criteria are met', async () => {
		const plugin = evmtsBunPlugin()
		const mockBuild = {
			onResolve: vi.fn(),
			onLoad: vi.fn(),
			config: {} as any,
		} as any
		await plugin.setup(mockBuild)

		const [_, onResolveFn] = mockBuild.onResolve.mock.calls[0]
		const resolved = onResolveFn({
			path: '@evmts/core',
			importer: 'some-random-importer',
		})

		expect(resolved.path).toEqual(require.resolve('@evmts/core'))
	})

	it('should resolve @evmts/core when imported from within the project or from node_modules', async () => {
		const plugin = evmtsBunPlugin()
		const mockBuild = {
			onResolve: vi.fn(),
			onLoad: vi.fn(),
			config: {} as any,
		} as any
		await plugin.setup(mockBuild)

		const [_, onResolveFn] = mockBuild.onResolve.mock.calls[0]

		let resolved = onResolveFn({
			path: '@evmts/core',
			importer: `${mockCwd}/some-relative-path`,
		})
		expect(resolved.path).toEqual(require.resolve('@evmts/core'))

		resolved = onResolveFn({
			path: '@evmts/core',
			importer: 'node_modules/some-package/index.js',
		})
		expect(resolved.path).toEqual(require.resolve('@evmts/core'))
	})

	it('should resolve solidity file using @evmts/base when neither .d.ts nor .ts files exist', async () => {
		const plugin = evmtsBunPlugin()
		const mockBuild = {
			onLoad: vi.fn(),
			onResolve: vi.fn(),
			config: {} as any,
		} as any
		await plugin.setup(mockBuild)

		const [_, onLoadFn] = mockBuild.onLoad.mock.lastCall ?? []

		mockExists.mockImplementation(async () => {
			return false
		})

		const result = await onLoadFn({ path: contractPath })

		expect(result.contents).toBe('mockedModule')
		expect(result.watchFiles).toEqual([require.resolve(contractPath)])
	})

	it('should load .ts file when it exists', async () => {
		const plugin = evmtsBunPlugin()

		const mockBuild = {
			onLoad: vi.fn(),
			onResolve: vi.fn(),
			config: {} as any,
		} as any
		await plugin.setup(mockBuild)

		const [_, onLoadFn] = mockBuild.onLoad.mock.lastCall ?? []

		mockExists.mockImplementation(async (path) => {
			if (path.endsWith('.d.ts')) return false
			if (path.endsWith('.ts')) return true
			return false
		})

		const result = await onLoadFn({ path: contractPath })

		expect(result.contents).toBe('export const ExampleContract = {abi: {}}')
		expect(result.watchFiles).toEqual([`${contractPath}.ts`])
	})
	it('should load .d.ts file over .ts file when both exist', async () => {
		const plugin = evmtsBunPlugin()

		const mockBuild = {
			onLoad: vi.fn(),
			onResolve: vi.fn(),
			config: {} as any,
		} as any
		await plugin.setup(mockBuild)

		const [_, onLoadFn] = mockBuild.onLoad.mock.lastCall ?? []

		mockExists.mockImplementation(async (path) => {
			if (path.endsWith('.d.ts') || path.endsWith('.ts')) return true
			return false
		})

		const result = await onLoadFn({ path: contractPath })

		expect(result.contents).toBe('export const ExampleContract = {abi: {}}')
		expect(result.watchFiles).toEqual([`${contractPath}.d.ts`])
	})
})
