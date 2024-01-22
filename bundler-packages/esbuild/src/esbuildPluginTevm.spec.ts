import { esbuildPluginTevm } from './esbuildPluginTevm.js'
import { describe, expect, it, vi } from 'vitest'

describe('esbuildPluginTevm', () => {
	it('should properly export the unplugin bundler from @tevm/base-bundler', async () => {
		const plugin = esbuildPluginTevm()

		expect(plugin.name).toMatchInlineSnapshot('"@tevm/rollup-plugin"')

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
