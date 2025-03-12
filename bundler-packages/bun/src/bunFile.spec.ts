import * as fs from 'node:fs'
import * as path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// We can't mock bun directly through vi.mock since it's required directly
// in the module we're testing. Instead we'll just check the module structure.

describe('bunFile', () => {
	// Mock for Bun file module
	const mockBunFile = {
		exists: vi.fn(),
		text: vi.fn(),
		write: vi.fn(),
	}

	// Cache original require
	const originalRequire = globalThis.require

	beforeEach(() => {
		// Reset mocks
		vi.resetAllMocks()
	})

	afterEach(() => {
		// Restore original require if needed
		if (originalRequire !== globalThis.require) {
			globalThis.require = originalRequire
		}
	})

	it('should have the correct structure', () => {
		// We can't directly test the functionality since it depends on bun,
		// so we'll verify the file structure instead
		const filePath = path.resolve(__dirname, 'bunFile.js')
		const fileContent = fs.readFileSync(filePath, 'utf8')

		// Verify export and structure
		expect(fileContent).toContain("export const file = require('bun').file")

		// Verify JSDoc exists
		expect(fileContent).toContain('Re-exports the Bun file API')
		expect(fileContent).toContain("@type {typeof import('bun').file}")
		expect(fileContent).toContain('@see')

		// Check for examples
		expect(fileContent).toContain('example')
		expect(fileContent).toContain("import { file } from '@tevm/bun'")
	})

	it('should export Bun file API', () => {
		// Mock the require('bun') statement for this test
		const mockBunFileFn = vi.fn()
		vi.doMock(
			'bun',
			() => ({
				file: mockBunFileFn,
			}),
			{ virtual: true },
		)

		// We can verify that the file attempts to export the Bun file API
		// without actually importing it, which would fail
		const fileContent = fs.readFileSync(path.resolve(__dirname, 'bunFile.js'), 'utf8')

		// Ensure the file does the right thing
		expect(fileContent).toContain("export const file = require('bun').file")
	})

	it('should expose properties needed for the package to work', () => {
		// NOTE: Code coverage for bunFile.js will report 0% because it's a direct
		// re-export that requires 'bun', which isn't available in the test environment.
		// We can only do structural tests rather than functional tests for this file.

		// Test file structure
		const filePath = path.resolve(__dirname, 'bunFile.js')
		const fileContent = fs.readFileSync(filePath, 'utf8')

		// Check important code structures
		expect(fileContent).toContain("export const file = require('bun').file")

		// Verify file is correctly listed as a direct export from the package
		const indexPath = path.resolve(__dirname, 'index.js')
		const indexContent = fs.readFileSync(indexPath, 'utf8')
		expect(indexContent).toContain("export { file } from './bunFile.js'")
	})

	it('should document all main file operations in JSDoc', () => {
		const filePath = path.resolve(__dirname, 'bunFile.js')
		const fileContent = fs.readFileSync(filePath, 'utf8')

		// Verify documentation covers main operations
		expect(fileContent).toContain('exists()')
		expect(fileContent).toContain('text()')
		expect(fileContent).toContain('write(')
	})
})
