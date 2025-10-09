import { createLogger } from '@tevm/logger'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FileReadError } from './errors.js'
import { readSourceFiles } from './readSourceFiles.js'

vi.mock('node:fs/promises', () => ({
	readFile: vi.fn(),
}))

vi.mock('./validateFiles.js', () => ({
	validateFiles: vi.fn((filePaths) => filePaths),
}))

describe('readSourceFiles', () => {
	let mockLogger: ReturnType<typeof createLogger>
	let mockReadFile: ReturnType<typeof vi.fn>
	let mockValidateFiles: ReturnType<typeof vi.fn>

	beforeEach(async () => {
		vi.clearAllMocks()

		const { readFile } = await import('node:fs/promises')
		mockReadFile = readFile as unknown as ReturnType<typeof vi.fn>

		const { validateFiles } = await import('./validateFiles.js')
		mockValidateFiles = validateFiles as unknown as ReturnType<typeof vi.fn>
		mockValidateFiles.mockImplementation((filePaths) => filePaths)

		mockLogger = {
			debug: vi.fn(),
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
		} as unknown as ReturnType<typeof createLogger>
	})

	describe('reading single file', () => {
		it('should read a single Solidity file successfully', async () => {
			const filePath = 'Contract.sol'
			const fileContent = 'pragma solidity ^0.8.0; contract TestContract {}'

			mockReadFile.mockResolvedValue(fileContent)

			const result = await readSourceFiles([filePath], 'Solidity', mockLogger)

			expect(result[filePath]).toBe(fileContent)
			expect(mockValidateFiles).toHaveBeenCalledWith([filePath], 'Solidity', mockLogger)
			expect(mockReadFile).toHaveBeenCalledWith(expect.stringContaining(filePath), 'utf-8')
			expect(mockLogger.debug).toHaveBeenCalledWith('Preparing to read 1 files')
			expect(mockLogger.debug).toHaveBeenCalledWith(expect.stringContaining('Reading file:'))
		})

		it('should read a single Yul file successfully', async () => {
			const filePath = 'Contract.yul'
			const fileContent = 'object "Contract" { code { } }'

			mockReadFile.mockResolvedValue(fileContent)

			const result = await readSourceFiles([filePath], 'Yul', mockLogger)

			expect(result[filePath]).toBe(fileContent)
			expect(mockValidateFiles).toHaveBeenCalledWith([filePath], 'Yul', mockLogger)
		})

		it('should read and parse a single JSON file for SolidityAST', async () => {
			const filePath = 'Contract.json'
			const astData = {
				nodeType: 'SourceUnit',
				nodes: [],
				absolutePath: 'Contract.sol',
			}
			const fileContent = JSON.stringify(astData)

			mockReadFile.mockResolvedValue(fileContent)

			const result = await readSourceFiles([filePath], 'SolidityAST', mockLogger)

			expect(result[filePath]).toEqual(astData)
			expect(mockValidateFiles).toHaveBeenCalledWith([filePath], 'SolidityAST', mockLogger)
		})

		it('should handle files without explicit language', async () => {
			const filePath = 'Contract.sol'
			const fileContent = 'pragma solidity ^0.8.0;'

			mockReadFile.mockResolvedValue(fileContent)

			const result = await readSourceFiles([filePath], undefined, mockLogger)

			expect(result[filePath]).toBe(fileContent)
			expect(mockValidateFiles).toHaveBeenCalledWith([filePath], undefined, mockLogger)
		})
	})

	describe('reading multiple files', () => {
		it('should read multiple Solidity files successfully', async () => {
			const filePaths = ['Contract1.sol', 'Contract2.sol', 'Contract3.sol']
			const fileContents = [
				'pragma solidity ^0.8.0; contract Contract1 {}',
				'pragma solidity ^0.8.0; contract Contract2 {}',
				'pragma solidity ^0.8.0; contract Contract3 {}',
			]

			mockReadFile
				.mockResolvedValueOnce(fileContents[0])
				.mockResolvedValueOnce(fileContents[1])
				.mockResolvedValueOnce(fileContents[2])

			const result = await readSourceFiles(filePaths, 'Solidity', mockLogger)

			expect(result['Contract1.sol']).toBe(fileContents[0])
			expect(result['Contract2.sol']).toBe(fileContents[1])
			expect(result['Contract3.sol']).toBe(fileContents[2])
			expect(mockReadFile).toHaveBeenCalledTimes(3)
			expect(mockLogger.debug).toHaveBeenCalledWith('Preparing to read 3 files')
		})

		it('should read multiple JSON files for SolidityAST', async () => {
			const filePaths = ['Contract1.json', 'Contract2.json']
			const astData1 = { nodeType: 'SourceUnit', nodes: [], absolutePath: 'Contract1.sol' }
			const astData2 = { nodeType: 'SourceUnit', nodes: [], absolutePath: 'Contract2.sol' }

			mockReadFile.mockResolvedValueOnce(JSON.stringify(astData1)).mockResolvedValueOnce(JSON.stringify(astData2))

			const result = await readSourceFiles(filePaths, 'SolidityAST', mockLogger)

			expect(result['Contract1.json']).toEqual(astData1)
			expect(result['Contract2.json']).toEqual(astData2)
			expect(mockReadFile).toHaveBeenCalledTimes(2)
		})

		it('should maintain correct order when reading multiple files', async () => {
			const filePaths = ['A.sol', 'B.sol', 'C.sol']

			mockReadFile
				.mockResolvedValueOnce('content A')
				.mockResolvedValueOnce('content B')
				.mockResolvedValueOnce('content C')

			const result = await readSourceFiles(filePaths, 'Solidity', mockLogger)

			const keys = Object.keys(result)
			expect(keys).toEqual(filePaths)
		})
	})

	describe('file not found errors', () => {
		it('should throw FileReadError when file does not exist', async () => {
			const filePath = 'NonExistent.sol'
			const error = new Error('ENOENT: no such file or directory')
			;(error as any).code = 'ENOENT'

			mockReadFile.mockRejectedValue(error)

			await expect(readSourceFiles([filePath], 'Solidity', mockLogger)).rejects.toThrow(FileReadError)

			await expect(readSourceFiles([filePath], 'Solidity', mockLogger)).rejects.toThrow(
				`Failed to read file ${filePath}`,
			)
		})

		it('should include proper metadata in FileReadError for missing file', async () => {
			const filePath = 'Missing.sol'
			const error = new Error('ENOENT: no such file or directory')

			mockReadFile.mockRejectedValue(error)

			try {
				await readSourceFiles([filePath], 'Solidity', mockLogger)
				expect.fail('Should have thrown FileReadError')
			} catch (err) {
				expect(err).toBeInstanceOf(FileReadError)
				const fileReadError = err as FileReadError
				expect(fileReadError.meta?.code).toBe('read_failed')
				expect(fileReadError.meta?.filePath).toBe(filePath)
				expect(fileReadError.meta?.absolutePath).toContain(filePath)
				expect(fileReadError.cause).toBe(error)
			}
		})

		it('should log error when file read fails', async () => {
			const filePath = 'Missing.sol'
			mockReadFile.mockRejectedValue(new Error('File not found'))

			await expect(readSourceFiles([filePath], 'Solidity', mockLogger)).rejects.toThrow(FileReadError)

			expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to read file'))
		})
	})

	describe('permission errors', () => {
		it('should throw FileReadError on permission denied', async () => {
			const filePath = 'Restricted.sol'
			const error = new Error('EACCES: permission denied')
			;(error as any).code = 'EACCES'

			mockReadFile.mockRejectedValue(error)

			await expect(readSourceFiles([filePath], 'Solidity', mockLogger)).rejects.toThrow(FileReadError)
		})

		it('should include cause in FileReadError for permission errors', async () => {
			const filePath = 'Restricted.sol'
			const permissionError = new Error('EACCES: permission denied')
			;(permissionError as any).code = 'EACCES'

			mockReadFile.mockRejectedValue(permissionError)

			try {
				await readSourceFiles([filePath], 'Solidity', mockLogger)
				expect.fail('Should have thrown FileReadError')
			} catch (err) {
				expect(err).toBeInstanceOf(FileReadError)
				const fileReadError = err as FileReadError
				expect(fileReadError.cause).toBe(permissionError)
				expect(fileReadError.meta?.code).toBe('read_failed')
			}
		})
	})

	describe('invalid paths', () => {
		it('should throw when validateFiles rejects invalid paths', async () => {
			const filePaths = ['']
			const validationError = new Error('Invalid file path')

			mockValidateFiles.mockImplementation(() => {
				throw validationError
			})

			await expect(readSourceFiles(filePaths, 'Solidity', mockLogger)).rejects.toThrow(validationError)
		})

		it('should call validateFiles before attempting to read', async () => {
			const filePaths = ['Contract.sol']
			mockValidateFiles.mockImplementation(() => {
				throw new Error('Validation failed')
			})

			await expect(readSourceFiles(filePaths, 'Solidity', mockLogger)).rejects.toThrow()

			expect(mockValidateFiles).toHaveBeenCalledWith(filePaths, 'Solidity', mockLogger)
			expect(mockReadFile).not.toHaveBeenCalled()
		})
	})

	describe('JSON parsing', () => {
		it('should parse valid JSON for SolidityAST language', async () => {
			const filePath = 'Contract.json'
			const astData = {
				nodeType: 'SourceUnit',
				nodes: [{ nodeType: 'PragmaDirective' }],
				absolutePath: 'Contract.sol',
				id: 123,
			}

			mockReadFile.mockResolvedValue(JSON.stringify(astData))

			const result = await readSourceFiles([filePath], 'SolidityAST', mockLogger)

			expect(result[filePath]).toEqual(astData)
			expect(typeof result[filePath]).toBe('object')
		})

		it('should throw FileReadError on invalid JSON for SolidityAST', async () => {
			const filePath = 'Invalid.json'
			const invalidJson = '{ invalid json content'

			mockReadFile.mockResolvedValue(invalidJson)

			await expect(readSourceFiles([filePath], 'SolidityAST', mockLogger)).rejects.toThrow(FileReadError)

			await expect(readSourceFiles([filePath], 'SolidityAST', mockLogger)).rejects.toThrow(
				`Failed to parse JSON file ${filePath}`,
			)
		})

		it('should include proper metadata in FileReadError for JSON parse failure', async () => {
			const filePath = 'Invalid.json'
			const invalidJson = '{ "key": invalid }'

			mockReadFile.mockResolvedValue(invalidJson)

			try {
				await readSourceFiles([filePath], 'SolidityAST', mockLogger)
				expect.fail('Should have thrown FileReadError')
			} catch (err) {
				expect(err).toBeInstanceOf(FileReadError)
				const fileReadError = err as FileReadError
				expect(fileReadError.meta?.code).toBe('json_parse_failed')
				expect(fileReadError.meta?.filePath).toBe(filePath)
				expect(fileReadError.meta?.absolutePath).toContain(filePath)
				expect(fileReadError.cause).toBeInstanceOf(Error)
			}
		})

		it('should log error on JSON parse failure', async () => {
			const filePath = 'Invalid.json'
			mockReadFile.mockResolvedValue('{ invalid }')

			await expect(readSourceFiles([filePath], 'SolidityAST', mockLogger)).rejects.toThrow(FileReadError)

			expect(mockLogger.error).toHaveBeenCalledWith(expect.stringContaining('Failed to parse JSON'))
		})

		it('should not parse JSON for non-SolidityAST languages', async () => {
			const filePath = 'Contract.sol'
			const jsonLikeContent = '{"key": "value"}'

			mockReadFile.mockResolvedValue(jsonLikeContent)

			const result = await readSourceFiles([filePath], 'Solidity', mockLogger)

			expect(result[filePath]).toBe(jsonLikeContent)
			expect(typeof result[filePath]).toBe('string')
		})

		it('should handle empty JSON objects', async () => {
			const filePath = 'Empty.json'
			const emptyJson = '{}'

			mockReadFile.mockResolvedValue(emptyJson)

			const result = await readSourceFiles([filePath], 'SolidityAST', mockLogger)

			expect(result[filePath]).toEqual({})
		})

		it('should handle complex nested JSON', async () => {
			const filePath = 'Complex.json'
			const complexAst = {
				nodeType: 'SourceUnit',
				nodes: [
					{
						nodeType: 'ContractDefinition',
						name: 'TestContract',
						baseContracts: [],
						nodes: [
							{
								nodeType: 'FunctionDefinition',
								name: 'testFunction',
								parameters: { parameters: [] },
							},
						],
					},
				],
			}

			mockReadFile.mockResolvedValue(JSON.stringify(complexAst))

			const result = await readSourceFiles([filePath], 'SolidityAST', mockLogger)

			expect(result[filePath]).toEqual(complexAst)
		})
	})

	describe('async operation', () => {
		it('should handle async file reading correctly', async () => {
			const filePath = 'Contract.sol'
			const fileContent = 'pragma solidity ^0.8.0;'

			mockReadFile.mockImplementation(
				() =>
					new Promise((resolve) => {
						setTimeout(() => resolve(fileContent), 10)
					}),
			)

			const resultPromise = readSourceFiles([filePath], 'Solidity', mockLogger)

			expect(resultPromise).toBeInstanceOf(Promise)

			const result = await resultPromise

			expect(result[filePath]).toBe(fileContent)
		})

		it('should read files sequentially', async () => {
			const filePaths = ['A.sol', 'B.sol']
			const callOrder: string[] = []

			mockReadFile.mockImplementation((path: string) => {
				callOrder.push(path)
				return Promise.resolve('content')
			})

			await readSourceFiles(filePaths, 'Solidity', mockLogger)

			expect(callOrder.length).toBe(2)
			expect(callOrder[0]).toContain('A.sol')
			expect(callOrder[1]).toContain('B.sol')
		})

		it('should handle rejected promises correctly', async () => {
			const filePath = 'Error.sol'

			mockReadFile.mockRejectedValue(new Error('Read error'))

			await expect(readSourceFiles([filePath], 'Solidity', mockLogger)).rejects.toThrow(FileReadError)
		})
	})

	describe('path resolution', () => {
		it('should resolve absolute paths correctly', async () => {
			const filePath = 'Contract.sol'

			mockReadFile.mockResolvedValue('content')

			await readSourceFiles([filePath], 'Solidity', mockLogger)

			const callArg = mockReadFile.mock.calls[0]?.[0]
			expect(callArg).toContain(filePath)
			expect(mockLogger.debug).toHaveBeenCalledWith(expect.stringContaining('Reading file:'))
		})

		it('should handle relative paths', async () => {
			const filePath = './contracts/Contract.sol'

			mockReadFile.mockResolvedValue('content')

			const result = await readSourceFiles([filePath], 'Solidity', mockLogger)

			expect(result[filePath]).toBe('content')
			expect(mockReadFile).toHaveBeenCalledWith(expect.stringContaining('contracts'), 'utf-8')
		})

		it('should handle nested directory paths', async () => {
			const filePath = 'contracts/utils/SafeMath.sol'

			mockReadFile.mockResolvedValue('content')

			const result = await readSourceFiles([filePath], 'Solidity', mockLogger)

			expect(result[filePath]).toBe('content')
		})
	})

	describe('logging behavior', () => {
		it('should log preparation message with file count', async () => {
			const filePaths = ['A.sol', 'B.sol', 'C.sol']

			mockReadFile.mockResolvedValue('content')

			await readSourceFiles(filePaths, 'Solidity', mockLogger)

			expect(mockLogger.debug).toHaveBeenCalledWith('Preparing to read 3 files')
		})

		it('should log reading message for each file', async () => {
			const filePaths = ['A.sol', 'B.sol']

			mockReadFile.mockResolvedValue('content')

			await readSourceFiles(filePaths, 'Solidity', mockLogger)

			expect(mockLogger.debug).toHaveBeenCalledWith(expect.stringContaining('Reading file:'))
			expect(mockLogger.debug).toHaveBeenCalledWith(expect.stringContaining('A.sol'))
			expect(mockLogger.debug).toHaveBeenCalledWith(expect.stringContaining('B.sol'))
		})

		it('should not log error when operation succeeds', async () => {
			const filePath = 'Contract.sol'

			mockReadFile.mockResolvedValue('content')

			await readSourceFiles([filePath], 'Solidity', mockLogger)

			expect(mockLogger.error).not.toHaveBeenCalled()
		})
	})

	describe('edge cases', () => {
		it('should handle empty file content', async () => {
			const filePath = 'Empty.sol'

			mockReadFile.mockResolvedValue('')

			const result = await readSourceFiles([filePath], 'Solidity', mockLogger)

			expect(result[filePath]).toBe('')
		})

		it('should handle very large file content', async () => {
			const filePath = 'Large.sol'
			const largeContent = 'x'.repeat(1000000)

			mockReadFile.mockResolvedValue(largeContent)

			const result = await readSourceFiles([filePath], 'Solidity', mockLogger)

			expect(result[filePath]).toBe(largeContent)
			expect((result[filePath] as string).length).toBe(1000000)
		})

		it('should handle special characters in file content', async () => {
			const filePath = 'Special.sol'
			const specialContent = 'pragma solidity ^0.8.0; // Comment with émojis 🎉 and spëcial çhars'

			mockReadFile.mockResolvedValue(specialContent)

			const result = await readSourceFiles([filePath], 'Solidity', mockLogger)

			expect(result[filePath]).toBe(specialContent)
		})

		it('should handle unicode characters in JSON', async () => {
			const filePath = 'Unicode.json'
			const unicodeData = { message: 'Hello 世界 🌍' }

			mockReadFile.mockResolvedValue(JSON.stringify(unicodeData))

			const result = await readSourceFiles([filePath], 'SolidityAST', mockLogger)

			expect(result[filePath]).toEqual(unicodeData)
		})

		it('should handle file paths with spaces', async () => {
			const filePath = 'My Contract.sol'

			mockReadFile.mockResolvedValue('content')

			const result = await readSourceFiles([filePath], 'Solidity', mockLogger)

			expect(result[filePath]).toBe('content')
		})

		it('should return empty object for zero validated files', async () => {
			mockValidateFiles.mockReturnValue([])

			const result = await readSourceFiles(['any.sol'], 'Solidity', mockLogger)

			expect(result).toEqual({})
			expect(mockReadFile).not.toHaveBeenCalled()
		})

		it('should handle mixed success and failure in multiple files', async () => {
			const filePaths = ['Success.sol', 'Fail.sol']

			mockReadFile.mockResolvedValueOnce('content').mockRejectedValueOnce(new Error('Read failed'))

			await expect(readSourceFiles(filePaths, 'Solidity', mockLogger)).rejects.toThrow(FileReadError)

			expect(mockReadFile).toHaveBeenCalledTimes(2)
		})
	})

	describe('file encoding', () => {
		it('should read files with utf-8 encoding', async () => {
			const filePath = 'Contract.sol'

			mockReadFile.mockResolvedValue('content')

			await readSourceFiles([filePath], 'Solidity', mockLogger)

			expect(mockReadFile).toHaveBeenCalledWith(expect.anything(), 'utf-8')
		})

		it('should handle utf-8 encoded special characters', async () => {
			const filePath = 'Contract.sol'
			const utf8Content = '// Copyright © 2024\npragma solidity ^0.8.0;'

			mockReadFile.mockResolvedValue(utf8Content)

			const result = await readSourceFiles([filePath], 'Solidity', mockLogger)

			expect(result[filePath]).toBe(utf8Content)
		})
	})

	describe('return value structure', () => {
		it('should return object with file paths as keys', async () => {
			const filePaths = ['A.sol', 'B.sol']

			mockReadFile.mockResolvedValue('content')

			const result = await readSourceFiles(filePaths, 'Solidity', mockLogger)

			expect(typeof result).toBe('object')
			expect(Object.keys(result)).toEqual(filePaths)
		})

		it('should return string values for non-AST files', async () => {
			const filePath = 'Contract.sol'

			mockReadFile.mockResolvedValue('content')

			const result = await readSourceFiles([filePath], 'Solidity', mockLogger)

			expect(typeof result[filePath]).toBe('string')
		})

		it('should return object values for AST files', async () => {
			const filePath = 'Contract.json'
			const astData = { nodeType: 'SourceUnit' }

			mockReadFile.mockResolvedValue(JSON.stringify(astData))

			const result = await readSourceFiles([filePath], 'SolidityAST', mockLogger)

			expect(typeof result[filePath]).toBe('object')
			expect(result[filePath]).not.toBeInstanceOf(String)
		})
	})
})
