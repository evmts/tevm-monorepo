import { tevmUnplugin } from './tevmUnplugin.js'
import { bundler } from '@tevm/base-bundler'
import { loadConfig } from '@tevm/config'
import { succeed } from 'effect/Effect'
import { existsSync } from 'fs'
import { createRequire } from 'module'
// @ts-expect-error
import * as solc from 'solc'
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
	createRequire: vi.fn(() => ({
		resolve: () => ({}) as any,
	})),
}))
vi.mock('@tevm/config', async () => ({
	...((await vi.importActual('@tevm/config')) as {}),
	loadConfig: vi.fn(),
}))
vi.mock('@tevm/base-bundler', async () => ({
	...((await vi.importActual('@tevm/base-bundler')) as {}),
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
		const plugin = tevmUnplugin({}, {} as any)
		expect(plugin.name).toEqual('@tevm/rollup-plugin')
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
			    "exists": [Function],
			    "existsSync": [MockFunction spy],
			    "mkdir": [Function],
			    "mkdirSync": [Function],
			    "readFile": [Function],
			    "readFileSync": [Function],
			    "stat": [Function],
			    "statSync": [Function],
			    "writeFile": [Function],
			    "writeFileSync": [Function],
			  },
			  {
			    "compile": [Function],
			    "features": {
			      "importCallback": true,
			      "legacySingleInput": true,
			      "multipleInputs": true,
			      "nativeStandardJSON": true,
			    },
			    "license": [Function],
			    "loadRemoteVersion": [Function],
			    "lowlevel": {
			      "compileCallback": null,
			      "compileMulti": null,
			      "compileSingle": null,
			      "compileStandard": [Function],
			    },
			    "semver": [Function],
			    "setupMethods": [Function],
			    "version": [Function],
			  },
			  {
			    "readArtifacts": [Function],
			    "readArtifactsSync": [Function],
			    "readDts": [Function],
			    "readDtsSync": [Function],
			    "readMjs": [Function],
			    "readMjsSync": [Function],
			    "writeArtifacts": [Function],
			    "writeArtifactsSync": [Function],
			    "writeDts": [Function],
			    "writeDtsSync": [Function],
			    "writeMjs": [Function],
			    "writeMjsSync": [Function],
			  },
			  "tevm/contract",
			]
		`)

		const result = plugin.load?.call(mockPlugin, 'test.sol')
		expect(await result).toMatchInlineSnapshot('"mockedModule"')
	})

	it('should watch the tsconfig.json file', async () => {
		const plugin = tevmUnplugin({}, {} as any)

		// call buildstart with mockPlugin as this
		await plugin.buildStart?.call(mockPlugin)

		// check if the addWatchFile function has been called with './tsconfig.json'
		expect(mockPlugin.addWatchFile).toHaveBeenCalledWith('./tsconfig.json')
	})

	it('should add module id to watch files if it is a .sol file', async () => {
		const plugin = tevmUnplugin({}, {} as any)
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
		const plugin = tevmUnplugin({}, {} as any)
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
		const plugin = tevmUnplugin({}, {} as any)
		mockExistsSync.mockReturnValueOnce(true)
		const result = plugin.loadInclude?.call(mockPlugin, 'test.js')
		expect(result).toBe(false)
		expect(mockExistsSync).not.toHaveBeenCalled()
	})

	it('should not load if .sol file has corresponding .ts file', async () => {
		const plugin = tevmUnplugin({}, {} as any)
		mockExistsSync.mockImplementation((path) => path.endsWith('.ts'))
		const result = plugin.loadInclude?.call(mockPlugin, 'test.sol')
		expect(result).toBe(false)
		expect(mockExistsSync).toHaveBeenCalledWith('test.sol.ts')
	})

	it('should not load if .sol file has corresponding .d.ts file', async () => {
		const plugin = tevmUnplugin({}, {} as any)
		mockExistsSync.mockImplementation((path) => path.endsWith('.d.ts'))
		const result = plugin.loadInclude?.call(mockPlugin, 'test.sol')
		expect(result).toBe(false)
		expect(mockExistsSync).toHaveBeenCalledWith('test.sol.d.ts')
	})

	describe('unpluginFn.resolveId', () => {
		it('should resolve to local @tevm/contract when id starts with @tevm/contract', async () => {
			const plugin = tevmUnplugin({}, {} as any)
			const mockCreateRequre = createRequire as MockedFunction<
				typeof createRequire
			>
			const mockRequireResolve = vi.fn()
			mockRequireResolve.mockReturnValue('/path/to/node_modules/@tevm/contract')
			mockCreateRequre.mockReturnValue({ resolve: mockRequireResolve } as any)
			const result = await plugin.resolveId?.call(
				mockPlugin,
				'@tevm/contract',
				'/different/workspace',
				{} as any,
			)

			expect(result).toMatchInlineSnapshot(
				'"/path/to/node_modules/@tevm/contract"',
			)
			expect(mockCreateRequre.mock.lastCall).toMatchInlineSnapshot(`
				[
				  "mock/process/dot/cwd/",
				]
			`)
			expect(mockRequireResolve.mock.lastCall).toMatchInlineSnapshot(`
				[
				  "@tevm/contract",
				]
			`)
		})

		it('should return null when id does not start with @tevm/contract', async () => {
			const plugin = tevmUnplugin({}, {} as any)

			const result = await plugin.resolveId?.call(
				mockPlugin,
				'some/other/id',
				'/some/workspace',
				{} as any,
			)

			expect(result).toBeNull()
		})

		it('should return null when id starts with @tevm/contract but importer is in node_modules or the same workspace', async () => {
			const plugin = tevmUnplugin({}, {} as any)

			const resultInNodeModules = await plugin.resolveId?.call(
				mockPlugin,
				'@tevm/contract',
				'/some/workspace/node_modules',
				{} as any,
			)
			expect(resultInNodeModules).toBeNull()

			const resultInSameWorkspace = await plugin.resolveId?.call(
				mockPlugin,
				'@tevm/contract',
				mockCwd,
				{} as any,
			)
			expect(resultInSameWorkspace).toBeNull()
		})
	})
})
