import { describe, expect, it } from 'vitest'
import * as indexModule from './index.js'
import { createSolc, releases, solcCompile } from './solc.js'

describe('index.js', () => {
	it('should re-export all functions from solc.js', () => {
		// Test that all expected exports from solc.js are available from index.js
		expect(indexModule.solcCompile).toBeDefined()
		expect(indexModule.createSolc).toBeDefined()
		expect(indexModule.releases).toBeDefined()

		// Verify that they are the same functions
		expect(indexModule.solcCompile).toBe(solcCompile)
		expect(indexModule.createSolc).toBe(createSolc)
		expect(indexModule.releases).toBe(releases)
	})

	it('should maintain the correct function signatures', () => {
		// Check that solcCompile takes two parameters
		expect(indexModule.solcCompile.length).toBe(2)

		// Check that createSolc takes one parameter
		expect(indexModule.createSolc.length).toBe(1)

		// Check that releases is an object
		expect(typeof indexModule.releases).toBe('object')
	})
})
