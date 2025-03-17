import { describe, expect, it } from 'vitest'
import { esbuildPluginTevm } from './esbuildPluginTevm.js'
import * as esbuildPackage from './index.js'

describe('esbuild package index', () => {
	it('should export the esbuildPluginTevm function', () => {
		expect(esbuildPackage.esbuildPluginTevm).toBeDefined()
		expect(esbuildPackage.esbuildPluginTevm).toBe(esbuildPluginTevm)
		expect(typeof esbuildPackage.esbuildPluginTevm).toBe('function')
	})

	it('should have the correct plugin factory interface', () => {
		// Verify the exported function can be called with no arguments
		const plugin = esbuildPackage.esbuildPluginTevm()

		// Check that it returns an esbuild plugin with the expected properties
		expect(plugin).toHaveProperty('name')
		expect(plugin.name).toBe('@tevm/rollup-plugin') // The name comes from unplugin
		expect(plugin).toHaveProperty('setup')
		expect(typeof plugin.setup).toBe('function')
	})
})
