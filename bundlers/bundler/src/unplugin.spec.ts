import { bundler } from './bundler'
import { unpluginFn } from './unplugin'
import { loadConfig } from '@evmts/config'
import { UnpluginBuildContext, UnpluginContext } from 'unplugin'
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@evmts/config', async () => ({
	...((await vi.importActual('@evmts/config')) as {}),
	loadConfig: vi.fn(),
}))
vi.mock('./bundler', () => ({
	bundler: vi.fn(),
}))
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
})
