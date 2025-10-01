import * as fs from 'node:fs'
import * as path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// We can't mock bun directly through vi.mock since it's required directly
// in the module we're testing. Instead we'll just check the module structure.

describe('bunFile', () => {
	// Mock for Bun file module
	const _mockBunFile = {
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

	it('should have comprehensive documentation with Bun API link', () => {
		const filePath = path.resolve(__dirname, 'bunFile.js')
		const fileContent = fs.readFileSync(filePath, 'utf8')

		// Verify the API documentation link is included
		expect(fileContent).toContain('https://bun.sh/docs/api/file-io')

		// Check for comprehensive method documentation
		expect(fileContent).toMatch(/file\('path\/to\/file\.txt'\)/)
		expect(fileContent).toMatch(/await myFile\.exists\(\)/)
		expect(fileContent).toMatch(/await myFile\.text\(\)/)
		expect(fileContent).toMatch(/await myFile\.write\('Hello, world!'\)/)

		// Verify doc structure with proper annotations
		expect(fileContent).toContain('@example')
		expect(fileContent).toContain('@type')
		expect(fileContent).toContain('@see')
	})

	it('should handle exports correctly for bundling', () => {
		// This test ensures the export pattern is consistent with how bundlers
		// and TypeScript expect them to be structured

		const filePath = path.resolve(__dirname, 'bunFile.js')
		const fileContent = fs.readFileSync(filePath, 'utf8')

		// Check export structure - should be a named export, not default
		expect(fileContent).toMatch(/export const file =/)
		expect(fileContent).not.toMatch(/export default/)

		// Ensure the export is directly accessing Bun's file API without modifications
		expect(fileContent).toMatch(/require\('bun'\)\.file/)
		expect(fileContent.trim().split('\n').pop()).toMatch(/export const file = require\('bun'\)\.file/)

		// Check if the export line is direct and properly structured
		const exportStatement = fileContent.split('\n').find((line) => line.trim().startsWith('export const file ='))
		expect(exportStatement).toBeTruthy()
		expect(exportStatement).toContain("require('bun').file")
	})

	it('should verify that file API methods needed for the bundle system are documented', () => {
		// This test ensures that the file documents all Bun file API methods
		// that are essential for the bundling system to work correctly
		const filePath = path.resolve(__dirname, 'bunFile.js')
		const fileContent = fs.readFileSync(filePath, 'utf8')

		// Required file system operations for bundling
		const requiredOperations = [
			'exists', // Checking if a file exists
			'text', // Reading file content
			'write', // Writing content to a file
		]

		// Check that example section covers all required operations
		// Extract the example code block
		const exampleMatch = fileContent.match(/```javascript\n([\s\S]*?)```/)
		const exampleCode = exampleMatch ? exampleMatch[1] : ''

		// Verify each required operation is shown in the example
		for (const operation of requiredOperations) {
			expect(exampleCode).toContain(operation)
			expect(fileContent).toContain(operation)
		}

		// Validate that the JSDoc refers to the correct import pattern
		expect(fileContent).toContain("import { file } from '@tevm/bun'")

		// Check that type definition references Bun's type system
		expect(fileContent).toContain("@type {typeof import('bun').file}")
	})
})
