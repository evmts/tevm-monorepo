import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { access, mkdir, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import type { LanguageServiceHost } from 'typescript'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createFileAccessObject, createRealFileAccessObject } from './fileAccessObject.js'

// Mock the LanguageServiceHost
const mockLsHost = (fileContent: string | null): LanguageServiceHost =>
	({
		readFile: vi.fn().mockImplementation((fileName, encoding) => fileContent),
		fileExists: vi.fn().mockImplementation((fileName) => fileContent !== null),
		writeFile: vi.fn(),
	}) as any

describe('createFileAccessObject', () => {
	it('should read file asynchronously', async () => {
		const fileContent = 'file content here'
		const lsHost = mockLsHost(fileContent)
		const fileAccessObject = createFileAccessObject(lsHost)

		const result = await fileAccessObject.readFile('test.ts', 'utf8')
		expect(result).toBe(fileContent)
	})

	it('should throw error when unable to read file asynchronously', async () => {
		const lsHost = mockLsHost(null) // Simulate no file content
		const fileAccessObject = createFileAccessObject(lsHost)

		await expect(fileAccessObject.readFile('test.ts', 'utf8')).rejects.toThrowErrorMatchingInlineSnapshot(
			'[Error: @tevm/ts-plugin: unable to read file test.ts]',
		)
	})

	it('should check if file exists synchronously', () => {
		const lsHost = mockLsHost('file content') // Simulate file exists
		const fileAccessObject = createFileAccessObject(lsHost)

		const result = fileAccessObject.existsSync('test.ts')
		expect(result).toBe(true)
	})

	it('should read file synchronously', () => {
		const fileContent = 'file content here'
		const lsHost = mockLsHost(fileContent)
		const fileAccessObject = createFileAccessObject(lsHost)

		const result = fileAccessObject.readFileSync('test.ts', 'utf8')
		expect(result).toBe(fileContent)
	})

	it('should throw error when unable to read file synchronously', () => {
		const lsHost = mockLsHost(null) // Simulate no file content
		const fileAccessObject = createFileAccessObject(lsHost)

		expect(() => {
			fileAccessObject.readFileSync('test.ts', 'utf8')
		}).toThrow('@tevm/ts-plugin: unable to read file test.ts')
	})

	it('should call writeFile on languageServiceHost', () => {
		const lsHost = mockLsHost('file content')
		const fileAccessObject = createFileAccessObject(lsHost)

		fileAccessObject.writeFileSync('test.ts', 'new content')
		expect(lsHost.writeFile).toHaveBeenCalledWith('test.ts', 'new content')
	})

	it('should check if file exists asynchronously', async () => {
		const lsHost = mockLsHost('file content') // Simulate file exists
		const fileAccessObject = createFileAccessObject(lsHost)

		const result = await fileAccessObject.exists('test.ts')
		expect(result).toBe(true)
	})

	it('should handle different encoding parameters during read operations', async () => {
		const fileContent = 'file content here'
		const lsHost = mockLsHost(fileContent)
		const fileAccessObject = createFileAccessObject(lsHost)

		// Test with utf8 encoding
		const result1 = await fileAccessObject.readFile('test.ts', 'utf8')
		expect(result1).toBe(fileContent)
		expect(lsHost.readFile).toHaveBeenCalledWith('test.ts', 'utf8')

		// Test with ascii encoding
		const result2 = fileAccessObject.readFileSync('test.ts', 'ascii')
		expect(result2).toBe(fileContent)
		expect(lsHost.readFile).toHaveBeenCalledWith('test.ts', 'ascii')
	})

	it('should handle paths with special characters', () => {
		const fileContent = 'special file content'
		const lsHost = mockLsHost(fileContent)
		const fileAccessObject = createFileAccessObject(lsHost)

		// Test with path containing spaces and special characters
		const specialPath = 'path/to/special file name with $#@!.ts'

		// Check file exists
		const exists = fileAccessObject.existsSync(specialPath)
		expect(exists).toBe(true)
		expect(lsHost.fileExists).toHaveBeenCalledWith(specialPath)

		// Read file
		const content = fileAccessObject.readFileSync(specialPath, 'utf8')
		expect(content).toBe(fileContent)
		expect(lsHost.readFile).toHaveBeenCalledWith(specialPath, 'utf8')

		// Write file
		fileAccessObject.writeFileSync(specialPath, 'new content with $#@!')
		expect(lsHost.writeFile).toHaveBeenCalledWith(specialPath, 'new content with $#@!')
	})
})

describe('createRealFileAccessObject', () => {
	let tempFilePath: string

	beforeEach(() => {
		tempFilePath = path.join(os.tmpdir(), `test-${Date.now()}.txt`)
	})

	afterEach(() => {
		try {
			if (existsSync(tempFilePath)) {
				require('node:fs').unlinkSync(tempFilePath)
			}
		} catch (e) {
			// Ignore cleanup errors
		}
	})

	it('should create a file access object using real fs functions', async () => {
		const fao = createRealFileAccessObject()

		// Test that the object contains all expected methods
		expect(fao.readFile).toBeDefined()
		expect(fao.existsSync).toBe(existsSync)
		expect(fao.readFileSync).toBe(readFileSync)
		expect(fao.writeFileSync).toBe(writeFileSync)
		expect(fao.statSync).toBe(statSync)
		expect(fao.mkdirSync).toBe(mkdirSync)
		expect(fao.mkdir).toBe(mkdir)
		expect(fao.writeFile).toBe(writeFile)
	})

	it('should check if file exists using real fs', async () => {
		const fao = createRealFileAccessObject()

		// Write a test file
		await fao.writeFile(tempFilePath, 'test content')

		// Check if it exists
		const exists = await fao.exists(tempFilePath)
		expect(exists).toBe(true)

		// Check a non-existent file
		const nonExistentPath = `${tempFilePath}.nonexistent`
		const nonExists = await fao.exists(nonExistentPath)
		expect(nonExists).toBe(false)
	})

	it('should properly create directories and write files to them', async () => {
		const fao = createRealFileAccessObject()

		// Create a temporary directory path
		const tempDir = path.join(os.tmpdir(), `tevm-test-dir-${Date.now()}`)
		const nestedFilePath = path.join(tempDir, 'nested', 'file.txt')

		try {
			// Create the nested directory structure
			await fao.mkdir(path.join(tempDir, 'nested'), { recursive: true })

			// Write a file in the nested directory
			await fao.writeFile(nestedFilePath, 'nested file content')

			// Verify the file exists
			const exists = await fao.exists(nestedFilePath)
			expect(exists).toBe(true)

			// Read the file content
			const content = await fao.readFile(nestedFilePath, 'utf8')
			expect(content).toBe('nested file content')
		} finally {
			// Clean up
			try {
				require('node:fs').rmSync(tempDir, { recursive: true, force: true })
			} catch (e) {
				// Ignore cleanup errors
			}
		}
	})
})
