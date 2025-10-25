import { describe, expect, it } from 'vitest'

describe('@tevm/requirejs index', () => {
	it('should export requirejsPluginTevm', async () => {
		const mod = await import('./index.js')
		expect(mod.requirejsPluginTevm).toBeDefined()
		expect(typeof mod.requirejsPluginTevm).toBe('function')
	})

	it('should export requirejsFileAccessObject', async () => {
		const mod = await import('./index.js')
		expect(mod.requirejsFileAccessObject).toBeDefined()
		expect(typeof mod.requirejsFileAccessObject).toBe('object')
	})
})
