import { evmtsUnplugin } from './evmtsUnplugin.js'
import { bundler } from '@evmts/base'
import { loadConfig } from '@evmts/config'
import { succeed } from 'effect/Effect'
import { existsSync } from 'fs'
import { createRequire } from 'module'
import type { UnpluginBuildContext, UnpluginContext } from 'unplugin'
import {
	type Mock,
	type MockedFunction,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

vi.mock('module', async () => ({
	...((await vi.importActual('module')) as {}),
	createRequire: vi.fn(),
}))

vi.mock('@evmts/config', async () => ({
	...((await vi.importActual('@evmts/config')) as {}),
	loadConfig: vi.fn(),
}))
vi.mock('@evmts/base', async () => ({
	...((await vi.importActual('@evmts/base')) as {}),
	bundler: vi.fn(),
}))

vi.mock('fs', async () => ({
	...((await vi.importActual('fs')) as {}),
	existsSync: vi.fn(),
}))

const mockExistsSync = existsSync as Mock

const mockBundler = bundler as Mock
const mockLoadConfig = loadConfig as Mock
mockBundler.mockReturnValue({
	resolveEsmModule: vi.fn(),
})

class MockUnpluginContext implements UnpluginContext, UnpluginBuildContext {
	warn = vi.fn()
	error = vi.fn()
	emitFile = vi.fn()
	addWatchFile = vi.fn()
	parse = vi.fn()
	getWatchFiles = vi.fn()
}

let mockPlugin: MockUnpluginContext

const mockCwd = 'mock/process/dot/cwd'
vi.stubGlobal('process', {
	...process,
	cwd: () => mockCwd,
})

describe('unpluginFn', () => {
	const mockConfig = succeed({ config: 'mockedConfig' })

	beforeEach(() => {
		mockPlugin = new MockUnpluginContext()
		mockLoadConfig.mockReturnValue(mockConfig)
		mockBundler.mockReturnValue({
			resolveEsmModule: vi
				.fn()
				.mockReturnValue({ code: 'mockedModule', modules: {} }),
		})
	})

	it('should create the plugin correctly', async () => {
		const plugin = evmtsUnplugin({}, {} as any)
		expect(plugin.name).toEqual('@evmts/rollup-plugin')
		expect((plugin as any).version).toBeTruthy()

		// call buildstart with mockPlugin as this
		await plugin.buildStart?.call(mockPlugin)

		expect(loadConfig).toHaveBeenCalledWith(mockCwd)
		expect((bundler as Mock).mock.lastCall).toMatchInlineSnapshot(`
			[
			  {
			    "config": "mockedConfig",
			  },
			  Console {
			    "Console": [Function],
			    "assert": [Function],
			    "clear": [Function],
			    "count": [Function],
			    "countReset": [Function],
			    "debug": [Function],
			    "dir": [Function],
			    "dirxml": [Function],
			    "error": [Function],
			    "group": [Function],
			    "groupCollapsed": [Function],
			    "groupEnd": [Function],
			    "info": [Function],
			    "log": [Function],
			    "table": [Function],
			    "time": [Function],
			    "timeEnd": [Function],
			    "timeLog": [Function],
			    "trace": [Function],
			    "warn": [Function],
			  },
			  {
			    "existsSync": [MockFunction spy],
			    "readFile": [Function],
			    "readFileSync": [Function],
			  },
			  {
			    "isCached": [Function],
			    "read": [Function],
			    "write": [Function],
			  },
			]
		`)

		const result = plugin.load?.call(mockPlugin, 'test.sol')
		expect(await result).toMatchInlineSnapshot('"mockedModule"')
	})

	it('should throw an error for invalid compiler option', () => {
		const errorFn = () =>
			evmtsUnplugin({ compiler: 'invalid' as any }, {} as any)
		expect(errorFn).toThrowErrorMatchingInlineSnapshot(
			"\"Invalid compiler option: invalid.  Valid options are 'solc' and 'foundry'\"",
		)
	})

	it('should throw an error if foundry compiler is set', () => {
		const errorFn = () => evmtsUnplugin({ compiler: 'foundry' }, {} as any)
		expect(errorFn).toThrowErrorMatchingInlineSnapshot(
			'"We have abandoned the foundry option despite supporting it in the past. Please use solc instead. Foundry will be added back as a compiler at a later time."',
		)
	})

	it('should watch the tsconfig.json file', async () => {
		const plugin = evmtsUnplugin({}, {} as any)

		// call buildstart with mockPlugin as this
		await plugin.buildStart?.call(mockPlugin)

		// check if the addWatchFile function has been called with './tsconfig.json'
		expect(mockPlugin.addWatchFile).toHaveBeenCalledWith('./tsconfig.json')
	})

	it('should add module id to watch files if it is a .sol file', async () => {
		const plugin = evmtsUnplugin({}, {} as any)
		const mockedModuleId = 'mockedModuleId'
		const mockedModule = {
			code: 'mockedCode',
			modules: { [mockedModuleId]: { id: '/path/to/mock/module' } },
		} as const

		mockBundler.mockReturnValue({
			resolveEsmModule: () => mockedModule,
		})

		await plugin?.buildStart?.call(mockPlugin)
		expect(mockPlugin.addWatchFile).toHaveBeenCalledWith('./tsconfig.json')
		await plugin.load?.call(mockPlugin, 'test.sol')
		expect(mockPlugin.addWatchFile).toHaveBeenCalledWith(
			mockedModule.modules[mockedModuleId].id,
		)
	})

	it('should not add module id to watch files if it is a .sol file in node modules', async () => {
		const plugin = evmtsUnplugin({}, {} as any)
		const mockedModuleId = 'mockedModuleId'
		const mockedModule = {
			code: 'mockedCode',
			modules: { [mockedModuleId]: { id: '/node_modules/to/mock/module' } },
		} as const

		mockBundler.mockReturnValue({
			resolveEsmModule: () => mockedModule,
		})

		await plugin?.buildStart?.call(mockPlugin)
		expect(mockPlugin.addWatchFile).toHaveBeenCalledWith('./tsconfig.json')
		await plugin.load?.call(mockPlugin, 'test.sol')
		expect(mockPlugin.addWatchFile).not.toHaveBeenCalledWith(
			mockedModule.modules[mockedModuleId].id,
		)
	})

	it('should not load non .sol files', async () => {
		const plugin = evmtsUnplugin({}, {} as any)
		mockExistsSync.mockReturnValueOnce(true)
		const result = plugin.loadInclude?.call(mockPlugin, 'test.js')
		expect(result).toBe(false)
		expect(mockExistsSync).not.toHaveBeenCalled()
	})

	it('should not load if .sol file has corresponding .ts file', async () => {
		const plugin = evmtsUnplugin({}, {} as any)
		mockExistsSync.mockImplementation((path) => path.endsWith('.ts'))
		const result = plugin.loadInclude?.call(mockPlugin, 'test.sol')
		expect(result).toBe(false)
		expect(mockExistsSync).toHaveBeenCalledWith('test.sol.ts')
	})

	it('should not load if .sol file has corresponding .d.ts file', async () => {
		const plugin = evmtsUnplugin({}, {} as any)
		mockExistsSync.mockImplementation((path) => path.endsWith('.d.ts'))
		const result = plugin.loadInclude?.call(mockPlugin, 'test.sol')
		expect(result).toBe(false)
		expect(mockExistsSync).toHaveBeenCalledWith('test.sol.d.ts')
	})

	describe('unpluginFn.resolveId', () => {
		it('should resolve to local @evmts/core when id starts with @evmts/core', async () => {
			const plugin = evmtsUnplugin({}, {} as any)
			const mockCreateRequre = createRequire as MockedFunction<
				typeof createRequire
			>
			const mockRequireResolve = vi.fn()
			mockRequireResolve.mockReturnValue('/path/to/node_modules/@evmts/core')
			mockCreateRequre.mockReturnValue({ resolve: mockRequireResolve } as any)
			const result = await plugin.resolveId?.call(
				mockPlugin,
				'@evmts/core',
				'/different/workspace',
				{} as any,
			)

			expect(result).toMatchInlineSnapshot(
				'"/path/to/node_modules/@evmts/core"',
			)
			expect(mockCreateRequre.mock.lastCall).toMatchInlineSnapshot(`
				[
				  "mock/process/dot/cwd/",
				]
			`)
			expect(mockRequireResolve.mock.lastCall).toMatchInlineSnapshot(`
				[
				  "@evmts/core",
				]
			`)
		})

		it('should return null when id does not start with @evmts/core', async () => {
			const plugin = evmtsUnplugin({}, {} as any)

			const result = await plugin.resolveId?.call(
				mockPlugin,
				'some/other/id',
				'/some/workspace',
				{} as any,
			)

			expect(result).toBeNull()
		})

		it('should return null when id starts with @evmts/core but importer is in node_modules or the same workspace', async () => {
			const plugin = evmtsUnplugin({}, {} as any)

			const resultInNodeModules = await plugin.resolveId?.call(
				mockPlugin,
				'@evmts/core',
				'/some/workspace/node_modules',
				{} as any,
			)
			expect(resultInNodeModules).toBeNull()

			const resultInSameWorkspace = await plugin.resolveId?.call(
				mockPlugin,
				'@evmts/core',
				mockCwd,
				{} as any,
			)
			expect(resultInSameWorkspace).toBeNull()
		})
	})
})
