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

	it('should handle different relative path formats correctly', () => {
		expect(isImportLocal('../MyContract.sol')).toBe(true)
		expect(isImportLocal('./path/to/MyContract.sol')).toBe(true)
		expect(isImportLocal('../path/to/MyContract.sol')).toBe(true)
		expect(isImportLocal('.//path//to//MyContract.sol')).toBe(true)
		expect(isImportLocal('.\\MyContract.sol')).toBe(true)
		expect(isImportLocal('..\\MyContract.sol')).toBe(true)
	})

	it('should return false for non-local import paths', () => {
		expect(isImportLocal('/absolute/path/MyContract.sol')).toBe(false)
		expect(isImportLocal('C:/path/to/MyContract.sol')).toBe(false)
		expect(isImportLocal('@openzeppelin/contracts/token/ERC20.sol')).toBe(false)
		expect(isImportLocal('')).toBe(false)
	})

	it('should handle edge cases correctly', () => {
		expect(isImportLocal('.')).toBe(true)
		expect(isImportLocal('..')).toBe(true)
		expect(isImportLocal('./')).toBe(true)
		expect(isImportLocal('../')).toBe(true)
		expect(isImportLocal('./.')).toBe(true)
		expect(isImportLocal('./path/.')).toBe(true)
		expect(isImportLocal('./path/..')).toBe(true)
	})
})
