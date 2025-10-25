import { describe, expect, it } from 'vitest'
import { requirejsPluginTevm } from './requirejsPluginTevm.js'

describe('requirejsPluginTevm', () => {
	it('should create a plugin object', () => {
		const plugin = requirejsPluginTevm()
		expect(plugin).toBeDefined()
		expect(typeof plugin).toBe('object')
	})

	it('should have a normalize method', () => {
		const plugin = requirejsPluginTevm() as any
		expect(plugin.normalize).toBeDefined()
		expect(typeof plugin.normalize).toBe('function')
	})

	it('should have a load method', () => {
		const plugin = requirejsPluginTevm() as any
		expect(plugin.load).toBeDefined()
		expect(typeof plugin.load).toBe('function')
	})

	it('should normalize paths using the provided normalize function', () => {
		const plugin = requirejsPluginTevm() as any
		const mockNormalize = (path: string) => `/normalized/${path}`

		const result = plugin.normalize('test.sol', mockNormalize)
		expect(result).toBe('/normalized/test.sol')
	})

	it('should accept solc version option', () => {
		const plugin = requirejsPluginTevm({ solc: '0.8.20' }) as any
		expect(plugin).toBeDefined()
		expect(plugin.load).toBeDefined()
		expect(plugin.normalize).toBeDefined()
	})
})
