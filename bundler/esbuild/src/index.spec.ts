import { esbuildPluginEvmts } from './index.js'
import { describe, expect, it, vi } from 'vitest'

describe('esbuildPluginEvmts', () => {
	it('should properly export the unplugin bundler from @evmts/base', async () => {
		const plugin = esbuildPluginEvmts()

		expect(plugin.name).toMatchInlineSnapshot('"@evmts/rollup-plugin"')

		const initialOptions = {}
		const resolve = vi.fn()
		const onStart = vi.fn()
		const onEnd = vi.fn()
		const onResolve = vi.fn()
		const onLoad = vi.fn()
		const onDispose = vi.fn()
		const esbuild = {
			context: vi.fn(),
			build: vi.fn(),
			version: 420,
			buildSync: vi.fn(),
			transform: vi.fn(),
			transformSync: vi.fn(),
		} as any
		await plugin.setup({
			initialOptions,
			resolve,
			onStart,
			onEnd,
			onResolve,
			onLoad,
			onDispose,
			esbuild,
		})
		expect(onStart).toBeCalledTimes(1)
		expect(onLoad).toBeCalledTimes(1)
	})
})
