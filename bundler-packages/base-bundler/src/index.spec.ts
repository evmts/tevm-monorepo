import { describe, expect, it } from 'vitest'
import * as index from './index.js'

describe('index.js', () => {
	it('should export bundler function', () => {
		expect(index.bundler).toBeDefined()
		expect(typeof index.bundler).toBe('function')
	})

	it('should export getContractPath function', () => {
		expect(index.getContractPath).toBeDefined()
		expect(typeof index.getContractPath).toBe('function')
	})
	
	it('should ensure all required exports are present and have correct types', () => {
		// Define expected exports and their types
		const expectedExports = {
			bundler: 'function',
			getContractPath: 'function',
			readCache: 'function',
			readCacheSync: 'function',
			writeCache: 'function',
			writeCacheSync: 'function',
		}
		
		// Check all expected exports
		for (const [exportName, expectedType] of Object.entries(expectedExports)) {
			expect(index).toHaveProperty(exportName)
			expect(typeof (index as any)[exportName]).toBe(expectedType)
		}
		
		// Verify export count to catch any unexpected additions or removals
		const actualExports = Object.keys(index).filter(key => !key.startsWith('_') && key !== 'default')
		expect(actualExports.length).toBe(Object.keys(expectedExports).length)
	})
})
