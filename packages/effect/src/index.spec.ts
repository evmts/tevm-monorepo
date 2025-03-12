import { describe, expect, it } from 'vitest'
import * as index from './index.js'

describe('index', () => {
	it('should export all functions from the package', () => {
		// Check that all modules are exported
		expect(index).toMatchObject({
			// createRequireEffect exports
			createRequireEffect: expect.any(Function),
			CreateRequireError: expect.any(Function),
			RequireError: expect.any(Function),

			// fileExists exports
			fileExists: expect.any(Function),

			// logAllErrors exports
			logAllErrors: expect.any(Function),

			// parseJson exports
			parseJson: expect.any(Function),
			ParseJsonError: expect.any(Function),

			// resolve exports
			resolveSync: expect.any(Function),
			resolveAsync: expect.any(Function),
			CouldNotResolveImportError: expect.any(Function),
		})
	})
})
