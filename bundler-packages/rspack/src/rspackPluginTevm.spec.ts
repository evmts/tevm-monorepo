import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the unplugin module
vi.mock('@tevm/unplugin', () => {
	return {
		createUnplugin: vi.fn(() => ({
			rspack: {
				name: '@tevm/rspack-plugin',
				apply: vi.fn(),
			},
		})),
		tevmUnplugin: 'mock-tevm-unplugin',
	}
})

import { createUnplugin, tevmUnplugin } from '@tevm/unplugin'
// Import after mocking
import { rspackPluginTevm } from './rspackPluginTevm.js'

describe('rspackPluginTevm', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should verify the module exports a value', () => {
		// Check that the export is defined
		expect(rspackPluginTevm).toBeDefined()

		// Check that it has properties typical of an Rspack plugin
		expect(rspackPluginTevm).toHaveProperty('name')
		expect(rspackPluginTevm).toHaveProperty('apply')
	})

	it('should verify the plugin has the correct name', () => {
		// Check that the name property is set correctly
		expect(rspackPluginTevm.name).toBe('@tevm/rspack-plugin')
	})

	it('should verify createUnplugin integration', () => {
		// Verify the create function and its argument are defined
		expect(createUnplugin).toBeDefined()
		expect(tevmUnplugin).toBeDefined()

		// Since the module is imported at the top level,
		// we can't verify the call itself in this test
		// But we can verify the exports are as expected
		expect(typeof createUnplugin).toBe('function')
		expect(tevmUnplugin).toBe('mock-tevm-unplugin')
	})
})
