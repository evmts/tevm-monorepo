import { describe, expect, it, vi } from 'vitest'
import { esbuildPluginTevm } from './esbuildPluginTevm.js'

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

	it('should verify the module exports a function', () => {
		// Ensure the export is a function
		expect(typeof esbuildPluginTevm).toBe('function')

		// Ensure it can be called without errors
		const plugin = esbuildPluginTevm()
		expect(plugin).toBeDefined()
	})

	it('should handle different esbuild configurations correctly', async () => {
		const plugin = esbuildPluginTevm()

		// Test with an empty configuration
		const emptyConfig = {
			initialOptions: {},
			resolve: vi.fn(),
			onStart: vi.fn(),
			onEnd: vi.fn(),
			onResolve: vi.fn(),
			onLoad: vi.fn(),
			onDispose: vi.fn(),
			esbuild: {
				context: vi.fn(),
				build: vi.fn(),
				version: 0,
				buildSync: vi.fn(),
				transform: vi.fn(),
				transformSync: vi.fn(),
			} as any,
		}

		await plugin.setup(emptyConfig)
		expect(emptyConfig.onStart).toBeCalledTimes(1)
		expect(emptyConfig.onLoad).toBeCalledTimes(1)

		// Verify onLoad was called
		expect(emptyConfig.onLoad).toHaveBeenCalled()

		// Check if mock data exists
		const mockCalls = emptyConfig.onLoad.mock.calls
		expect(mockCalls.length).toBeGreaterThan(0)

		// Verify onLoad callback works with options (safe access)
		const onLoadOptions = mockCalls[0]?.[0]
		expect(onLoadOptions).toBeDefined()
		if (onLoadOptions) {
			expect(typeof onLoadOptions).toBe('object')
			expect(onLoadOptions).toHaveProperty('filter')
		}
	})
})
