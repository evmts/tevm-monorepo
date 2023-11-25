import { createFileAccessObject } from './fileAccessObject.js'
import { LanguageServiceHost } from 'typescript'
import { describe, expect, it, vi } from 'vitest'

// Mock the LanguageServiceHost
const mockLsHost = (fileContent: string | null): LanguageServiceHost =>
	({
		readFile: vi.fn().mockImplementation((fileName, encoding) => fileContent),
		fileExists: vi.fn().mockImplementation((fileName) => fileContent !== null),
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

		expect(
			fileAccessObject.readFile('test.ts', 'utf8'),
		).rejects.toThrowErrorMatchingInlineSnapshot(
			'"@evmts/ts-plugin: unable to read file test.ts"',
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
		}).toThrow('@evmts/ts-plugin: unable to read file test.ts')
	})
})
