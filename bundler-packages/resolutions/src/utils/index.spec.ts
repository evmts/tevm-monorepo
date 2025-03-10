import { describe, expect, it } from 'vitest'
import * as utils from './index.js'

describe('utils index exports', () => {
	it('should export all utility functions', () => {
		// Check for specific exports
		expect(utils.isRelativeSolidity).toBeDefined()
		expect(utils.isSolidity).toBeDefined()
		expect(utils.isImportLocal).toBeDefined()
		expect(utils.formatPath).toBeDefined()
		expect(utils.invariant).toBeDefined()
		expect(utils.resolveSafe).toBeDefined()

		// Ensure all expected utilities are exported
		const expectedExports = [
			'isRelativeSolidity',
			'isSolidity',
			'isImportLocal',
			'formatPath',
			'invariant',
			'resolveSafe',
			'ResolveError',
		]

		expectedExports.forEach((exportName) => {
			expect(utils).toHaveProperty(exportName)
		})
	})
})
