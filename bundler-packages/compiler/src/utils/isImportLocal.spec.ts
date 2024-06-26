import { describe, expect, it } from 'vitest'
import { isImportLocal } from './isImportLocal.js'

describe(isImportLocal.name, () => {
	it('should return true if import path starts with a dot', () => {
		const importPath = './MyContract.sol'
		expect(isImportLocal(importPath)).toBe(true)
	})

	it('should return false if import path does not start with a dot', () => {
		const importPath = 'MyContract.sol'
		expect(isImportLocal(importPath)).toBe(false)
	})
})
