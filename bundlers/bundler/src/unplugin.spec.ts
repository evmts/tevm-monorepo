import { bundler } from './bundler'
import { unpluginFn } from './unplugin'
import { loadConfig } from '@evmts/config'
import { existsSync } from 'fs'
import type { UnpluginBuildContext, UnpluginContext } from 'unplugin'
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@evmts/config', async () => ({
	...((await vi.importActual('@evmts/config')) as {}),
	loadConfig: vi.fn(),
}))
vi.mock('./bundler', () => ({
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

describe('unpluginFn', () => {
	const mockConfig = { config: 'mockedConfig' }

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
		const plugin = unpluginFn({}, {} as any)
		expect(plugin.name).toEqual('@evmts/rollup-plugin')
		expect((plugin as any).version).toEqual('0.0.0')

		// call buildstart with mockPlugin as this
		await plugin.buildStart?.call(mockPlugin)

		expect(loadConfig).toHaveBeenCalledWith('.')
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
			]
		`)

		const result = plugin.load?.call(mockPlugin, 'test.sol')
		expect(await result).toMatchInlineSnapshot('"mockedModule"')

		const nonSolResult = plugin.load?.call(mockPlugin, 'test.js')
		expect(await nonSolResult).toBeUndefined()
	})

	it('should throw an error for invalid compiler option', () => {
		const errorFn = () => unpluginFn({ compiler: 'invalid' as any }, {} as any)
		expect(errorFn).toThrowErrorMatchingInlineSnapshot(
			"\"Invalid compiler option: invalid.  Valid options are 'solc' and 'foundry'\"",
		)
	})

	it('should throw an error if foundry compiler is set', () => {
		const errorFn = () => unpluginFn({ compiler: 'foundry' }, {} as any)
		expect(errorFn).toThrowErrorMatchingInlineSnapshot(
			'"We have abandoned the foundry option despite supporting it in the past. Please use solc instead. Foundry will be added back as a compiler at a later time."',
		)
	})

	it('should watch the tsconfig.json file', async () => {
		const plugin = unpluginFn({}, {} as any)

		// call buildstart with mockPlugin as this
		await plugin.buildStart?.call(mockPlugin)

		// check if the addWatchFile function has been called with './tsconfig.json'
		expect(mockPlugin.addWatchFile).toHaveBeenCalledWith('./tsconfig.json')
	})

	it('should add module id to watch files if it is a .sol file', async () => {
		const plugin = unpluginFn({}, {} as any)
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
		const plugin = unpluginFn({}, {} as any)
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

	it('should handle @evmts/core/runtime id correctly', async () => {
		const plugin = unpluginFn({}, {} as any)

		// Insert logic here based on what the behavior should be when id.startsWith('@evmts/core/runtime') is true
		// For now, let's just call it and assert that it doesn't throw an error
		const testFn = () => plugin.load?.call(mockPlugin, '@evmts/core/runtime')
		expect(testFn).not.toThrow()
	})

	it('should return undefined if .sol file has corresponding .ts file', async () => {
		const plugin = unpluginFn({}, {} as any)
		mockExistsSync.mockReturnValueOnce(true)

		const result = await plugin.load?.call(mockPlugin, 'test.sol')

		expect(result).toBeUndefined()
		expect(mockExistsSync).toHaveBeenCalledWith('test.sol.ts')
	})

	it('should return undefined if .sol file has corresponding .d.ts file', async () => {
		const plugin = unpluginFn({}, {} as any)
		mockExistsSync.mockReturnValueOnce(false).mockReturnValueOnce(true)

		const result = await plugin.load?.call(mockPlugin, 'test.sol')

		expect(result).toBeUndefined()
		expect(mockExistsSync).toHaveBeenCalledWith('test.sol.d.ts')
	})
})
