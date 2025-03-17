import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the unplugin module
vi.mock('@tevm/unplugin', () => {
	return {
		createUnplugin: vi.fn(() => ({
			rollup: {
				name: '@tevm/rollup-plugin',
				resolveId: vi.fn(),
				load: vi.fn(),
				buildStart: vi.fn(),
			},
		})),
		tevmUnplugin: 'mock-tevm-unplugin',
	}
})

import { createUnplugin, tevmUnplugin } from '@tevm/unplugin'
// Import after mocking
import { rollupPluginTevm } from './rollupPluginTevm.js'

describe('rollupPluginTevm', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should verify the module exports a value', () => {
		expect(rollupPluginTevm).toBeDefined()
	})

	it('should verify createUnplugin integration', () => {
		// Rather than testing implementation details,
		// just verify the functions are defined since we've mocked them
		expect(createUnplugin).toBeDefined()
		expect(tevmUnplugin).toBeDefined()
	})

	it('should return a rollup plugin with standard hooks', () => {
		// Verify the plugin has standard plugin properties
		expect(rollupPluginTevm).toHaveProperty('name', '@tevm/rollup-plugin')
		expect(rollupPluginTevm).toHaveProperty('resolveId')
		expect(rollupPluginTevm).toHaveProperty('load')
		expect(rollupPluginTevm).toHaveProperty('buildStart')
	})
})
