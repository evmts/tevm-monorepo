import { describe, expect, it } from 'vitest'
import * as moduleExports from './index.js'
import { rollupPluginTevm as namedExport } from './index.js'

describe('index.js', () => {
	it('should export rollupPluginTevm correctly', () => {
		// Check named export exists
		expect(namedExport).toBeDefined()

		// Check the module exports structure
		expect(Object.keys(moduleExports)).toHaveLength(1)
		expect(moduleExports).toHaveProperty('rollupPluginTevm')
	})

	it('should document the module with JSDoc', async () => {
		// Get the file content directly
		const fs = await import('node:fs/promises')
		const path = await import('node:path')

		const filePath = path.resolve('./src/index.js')
		const fileContent = await fs.readFile(filePath, 'utf-8')

		// Check JSDoc documentation patterns
		expect(fileContent).toContain('@module')
		expect(fileContent).toContain('@example')

		// Check for code examples
		expect(fileContent).toContain('rollup.config.js')
		expect(fileContent).toContain('defineConfig')
		expect(fileContent).toContain('rollupPluginTevm')
	})
})
