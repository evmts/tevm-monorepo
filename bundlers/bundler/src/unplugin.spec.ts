import { bundler } from './bundler'
import {
	esbuildPluginEvmts,
	rollupPluginEvmts,
	rspackPluginEvmts,
	unpluginFn,
	vitePluginEvmts,
	webpackPluginEvmts,
} from './unplugin'
import { defaultConfig, loadConfig } from '@evmts/config'
import { Mock, afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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

describe('unpluginFn', () => {
	const mockConfig = { config: 'mockedConfig' }

	beforeEach(() => {
		mockLoadConfig.mockReturnValue(mockConfig)
		mockBundler.mockReturnValue({
			resolveEsmModule: vi.fn().mockReturnValue('mockedModule'),
		})
	})

	it('should create the plugin correctly', async () => {
		const plugin = unpluginFn()
		expect(plugin.name).toEqual('@evmts/rollup-plugin')
		expect(plugin.version).toEqual('0.0.0')

		await plugin.buildStart?.()

		expect(loadConfig).toHaveBeenCalledWith('.')
		expect(bundler).toHaveBeenCalledWith(mockConfig, console)

		const result = plugin.load?.('test.sol')
		expect(result).toBe('mockedModule')

		const nonSolResult = plugin.load?.('test.js')
		expect(nonSolResult).toBeUndefined()
	})

	it('should throw an error for invalid compiler option', () => {
		const errorFn = () => unpluginFn({ compiler: 'invalid' as any })
		expect(errorFn).toThrowErrorMatchingInlineSnapshot(
			"\"Invalid compiler option: invalid.  Valid options are 'solc' and 'foundry'\"",
		)
	})

	it('should throw an error if foundry compiler is set', () => {
		const errorFn = () => unpluginFn({ compiler: 'foundry' })
		expect(errorFn).toThrowErrorMatchingInlineSnapshot(
			'"We have abandoned the foundry option despite supporting it in the past. Please use solc instead. Foundry will be added back as a compiler at a later time."',
		)
	})
})
describe('EVMts Rollup Plugin', () => {
	beforeEach(() => {
		mockLoadConfig.mockReturnValue(defaultConfig)
	})

	it('vitePluginEvmts output matches snapshot', () => {
		expect(vitePluginEvmts()).toMatchInlineSnapshot(`
      {
        "buildStart": [Function],
        "load": [Function],
        "name": "@evmts/rollup-plugin",
        "version": "0.0.0",
      }
    `)
	})

	it('rollupPluginEvmts output matches snapshot', () => {
		expect(rollupPluginEvmts()).toMatchInlineSnapshot(`
      {
        "buildStart": [Function],
        "load": [Function],
        "name": "@evmts/rollup-plugin",
        "version": "0.0.0",
      }
    `)
	})

	it('esbuildPluginEvmts output matches snapshot', () => {
		expect(esbuildPluginEvmts()).toMatchInlineSnapshot(`
      {
        "name": "@evmts/rollup-plugin",
        "setup": [Function],
      }
    `)
	})

	it('webpackFoundry output matches snapshot', () => {
		expect(webpackPluginEvmts()).toMatchInlineSnapshot(`
      {
        "apply": [Function],
      }
    `)
	})

	it('rspackPluginFoundry output matches snapshot', () => {
		expect(rspackPluginEvmts()).toMatchInlineSnapshot(`
      {
        "apply": [Function],
      }
    `)
	})

	afterEach(() => {
		vi.resetAllMocks()
	})
})
