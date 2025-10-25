import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { requirejsFileAccessObject } from './requirejsFileAccessObject.js'

describe('requirejsFileAccessObject', () => {
	it('should export an object with required methods', () => {
		expect(requirejsFileAccessObject).toBeDefined()
		expect(typeof requirejsFileAccessObject).toBe('object')
	})

	it('should have existsSync method', () => {
		expect(requirejsFileAccessObject.existsSync).toBeDefined()
		expect(typeof requirejsFileAccessObject.existsSync).toBe('function')
		expect(requirejsFileAccessObject.existsSync).toBe(existsSync)
	})

	it('should have exists method', () => {
		expect(requirejsFileAccessObject.exists).toBeDefined()
		expect(typeof requirejsFileAccessObject.exists).toBe('function')
	})

	it('should have readFile method', () => {
		expect(requirejsFileAccessObject.readFile).toBeDefined()
		expect(typeof requirejsFileAccessObject.readFile).toBe('function')
	})

	it('should have readFileSync method', () => {
		expect(requirejsFileAccessObject.readFileSync).toBeDefined()
		expect(typeof requirejsFileAccessObject.readFileSync).toBe('function')
	})

	it('should have writeFileSync method', () => {
		expect(requirejsFileAccessObject.writeFileSync).toBeDefined()
		expect(typeof requirejsFileAccessObject.writeFileSync).toBe('function')
	})

	it('should have statSync method', () => {
		expect(requirejsFileAccessObject.statSync).toBeDefined()
		expect(typeof requirejsFileAccessObject.statSync).toBe('function')
	})

	it('should have stat method', () => {
		expect(requirejsFileAccessObject.stat).toBeDefined()
		expect(typeof requirejsFileAccessObject.stat).toBe('function')
	})

	it('should have mkdirSync method', () => {
		expect(requirejsFileAccessObject.mkdirSync).toBeDefined()
		expect(typeof requirejsFileAccessObject.mkdirSync).toBe('function')
	})

	it('should have mkdir method', () => {
		expect(requirejsFileAccessObject.mkdir).toBeDefined()
		expect(typeof requirejsFileAccessObject.mkdir).toBe('function')
	})

	it('should have writeFile method', () => {
		expect(requirejsFileAccessObject.writeFile).toBeDefined()
		expect(typeof requirejsFileAccessObject.writeFile).toBe('function')
	})

	it('should check if package.json exists', () => {
		const exists = requirejsFileAccessObject.existsSync('./package.json')
		expect(exists).toBe(true)
	})

	it('should check if non-existent file does not exist', () => {
		const exists = requirejsFileAccessObject.existsSync('./non-existent-file-xyz.sol')
		expect(exists).toBe(false)
	})

	it('should check file existence asynchronously', async () => {
		const exists = await requirejsFileAccessObject.exists('./package.json')
		expect(exists).toBe(true)
	})

	it('should return false for non-existent file asynchronously', async () => {
		const exists = await requirejsFileAccessObject.exists('./non-existent-file-xyz.sol')
		expect(exists).toBe(false)
	})
})
