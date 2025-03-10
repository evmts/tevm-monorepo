import { describe, expect, it } from 'vitest'
import * as indexExports from './index.js'

describe('index exports', () => {
	it('should export moduleFactory and resolveImports', () => {
		expect(indexExports.moduleFactory).toBeDefined()
		expect(indexExports.resolveImports).toBeDefined()
		expect(Object.keys(indexExports).sort()).toEqual(['moduleFactory', 'resolveImports'].sort())
	})
})
