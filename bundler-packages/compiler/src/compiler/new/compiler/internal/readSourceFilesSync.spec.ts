import { createLogger } from '@tevm/logger'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FileReadError } from './errors.js'
import { readSourceFilesSync } from './readSourceFilesSync.js'

vi.mock('node:fs', () => ({
	readFileSync: vi.fn(),
}))

vi.mock('node:path', () => ({
	resolve: vi.fn(),
}))

vi.mock('./validateFiles.js', () => ({
	validateFiles: vi.fn(),
}))

describe('readSourceFilesSync', () => {
	let mockReadFileSync: ReturnType<typeof vi.fn>
	let mockResolve: ReturnType<typeof vi.fn>
	let mockValidateFiles: ReturnType<typeof vi.fn>
	let mockLogger: ReturnType<typeof createLogger>

	beforeEach(async () => {
		vi.clearAllMocks()

		const fs = await import('node:fs')
		const path = await import('node:path')
		const { validateFiles } = await import('./validateFiles.js')

		mockReadFileSync = fs.readFileSync as unknown as ReturnType<typeof vi.fn>
		mockResolve = path.resolve as unknown as ReturnType<typeof vi.fn>
		mockValidateFiles = validateFiles as unknown as ReturnType<typeof vi.fn>

		mockLogger = {
			debug: vi.fn(),
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
		} as unknown as ReturnType<typeof createLogger>

		mockResolve.mockImplementation((filePath: string) => `/absolute/${filePath}`)
	})

	describe('reading single file sync', () => {
		it('should read a single Solidity file successfully', () => {
			const filePaths = ['Contract.sol']
			const content = 'pragma solidity ^0.8.0; contract TestContract {}'

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue(content)

			const result = readSourceFilesSync(filePaths, 'Solidity', mockLogger)

			expect(result).toEqual({
				'Contract.sol': content,
			})
			expect(mockValidateFiles).toHaveBeenCalledWith(filePaths, 'Solidity', mockLogger)
			expect(mockResolve).toHaveBeenCalledWith('Contract.sol')
			expect(mockReadFileSync).toHaveBeenCalledWith('/absolute/Contract.sol', 'utf-8')
			expect(mockLogger.debug).toHaveBeenCalledWith('Preparing to read 1 files')
			expect(mockLogger.debug).toHaveBeenCalledWith('Reading file: /absolute/Contract.sol')
		})

		it('should read a single Yul file successfully', () => {
			const filePaths = ['Contract.yul']
			const content = 'object "Contract" { code { sstore(0, 1) } }'

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue(content)

			const result = readSourceFilesSync(filePaths, 'Yul', mockLogger)

			expect(result).toEqual({
				'Contract.yul': content,
			})
			expect(mockValidateFiles).toHaveBeenCalledWith(filePaths, 'Yul', mockLogger)
			expect(mockReadFileSync).toHaveBeenCalledWith('/absolute/Contract.yul', 'utf-8')
		})

		it('should read and parse a single JSON AST file successfully', () => {
			const filePaths = ['Contract.json']
			const astObject = {
				nodeType: 'SourceUnit',
				src: '0:0:0',
				nodes: [],
				absolutePath: 'Contract.sol',
				id: 0,
				exportedSymbols: {},
			}
			const jsonContent = JSON.stringify(astObject)

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue(jsonContent)

			const result = readSourceFilesSync(filePaths, 'SolidityAST', mockLogger)

			expect(result).toEqual({
				'Contract.json': astObject,
			})
			expect(mockValidateFiles).toHaveBeenCalledWith(filePaths, 'SolidityAST', mockLogger)
			expect(mockReadFileSync).toHaveBeenCalledWith('/absolute/Contract.json', 'utf-8')
		})

		it('should use language undefined when not specified', () => {
			const filePaths = ['Contract.sol']
			const content = 'pragma solidity ^0.8.0; contract TestContract {}'

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue(content)

			const result = readSourceFilesSync(filePaths, undefined, mockLogger)

			expect(result).toEqual({
				'Contract.sol': content,
			})
			expect(mockValidateFiles).toHaveBeenCalledWith(filePaths, undefined, mockLogger)
		})
	})

	describe('reading multiple files sync', () => {
		it('should read multiple Solidity files successfully', () => {
			const filePaths = ['Contract1.sol', 'Contract2.sol', 'Contract3.sol']
			const contents = [
				'pragma solidity ^0.8.0; contract Contract1 {}',
				'pragma solidity ^0.8.0; contract Contract2 {}',
				'pragma solidity ^0.8.0; contract Contract3 {}',
			]

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync
				.mockReturnValueOnce(contents[0])
				.mockReturnValueOnce(contents[1])
				.mockReturnValueOnce(contents[2])

			const result = readSourceFilesSync(filePaths, 'Solidity', mockLogger)

			expect(result).toEqual({
				'Contract1.sol': contents[0],
				'Contract2.sol': contents[1],
				'Contract3.sol': contents[2],
			})
			expect(mockResolve).toHaveBeenCalledTimes(3)
			expect(mockReadFileSync).toHaveBeenCalledTimes(3)
			expect(mockLogger.debug).toHaveBeenCalledWith('Preparing to read 3 files')
		})

		it('should read multiple JSON AST files successfully', () => {
			const filePaths = ['Contract1.json', 'Contract2.json']
			const astObjects = [
				{
					nodeType: 'SourceUnit',
					src: '0:0:0',
					nodes: [],
					absolutePath: 'Contract1.sol',
					id: 0,
					exportedSymbols: {},
				},
				{
					nodeType: 'SourceUnit',
					src: '0:0:0',
					nodes: [],
					absolutePath: 'Contract2.sol',
					id: 1,
					exportedSymbols: {},
				},
			]

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync
				.mockReturnValueOnce(JSON.stringify(astObjects[0]))
				.mockReturnValueOnce(JSON.stringify(astObjects[1]))

			const result = readSourceFilesSync(filePaths, 'SolidityAST', mockLogger)

			expect(result).toEqual({
				'Contract1.json': astObjects[0],
				'Contract2.json': astObjects[1],
			})
			expect(mockReadFileSync).toHaveBeenCalledTimes(2)
		})

		it('should call debug logger for each file being read', () => {
			const filePaths = ['File1.sol', 'File2.sol']

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue('content')

			readSourceFilesSync(filePaths, 'Solidity', mockLogger)

			expect(mockLogger.debug).toHaveBeenCalledWith('Preparing to read 2 files')
			expect(mockLogger.debug).toHaveBeenCalledWith('Reading file: /absolute/File1.sol')
			expect(mockLogger.debug).toHaveBeenCalledWith('Reading file: /absolute/File2.sol')
		})
	})

	describe('file not found', () => {
		it('should throw FileReadError when file does not exist', () => {
			const filePaths = ['NonExistent.sol']
			const fsError = new Error('ENOENT: no such file or directory')
			Object.assign(fsError, { code: 'ENOENT' })

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockImplementation(() => {
				throw fsError
			})

			expect(() => {
				readSourceFilesSync(filePaths, 'Solidity', mockLogger)
			}).toThrow(FileReadError)

			try {
				readSourceFilesSync(filePaths, 'Solidity', mockLogger)
			} catch (error) {
				expect(error).toBeInstanceOf(FileReadError)
				expect((error as FileReadError).message).toBe('Failed to read file NonExistent.sol')
				expect((error as FileReadError).meta?.code).toBe('read_failed')
				expect((error as FileReadError).meta?.filePath).toBe('NonExistent.sol')
				expect((error as FileReadError).meta?.absolutePath).toBe('/absolute/NonExistent.sol')
				expect((error as FileReadError).cause).toBe(fsError)
			}

			expect(mockLogger.error).toHaveBeenCalledWith('Failed to read file NonExistent.sol')
		})

		it('should throw FileReadError with proper metadata for missing file', () => {
			const filePaths = ['path/to/missing.sol']
			const fsError = new Error('File not found')

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockImplementation(() => {
				throw fsError
			})

			expect(() => {
				readSourceFilesSync(filePaths, 'Solidity', mockLogger)
			}).toThrow(FileReadError)

			try {
				readSourceFilesSync(filePaths, 'Solidity', mockLogger)
			} catch (error) {
				const fileError = error as FileReadError
				expect(fileError.meta?.code).toBe('read_failed')
				expect(fileError.meta?.filePath).toBe('path/to/missing.sol')
				expect(fileError.meta?.absolutePath).toBe('/absolute/path/to/missing.sol')
			}
		})
	})

	describe('permission errors', () => {
		it('should throw FileReadError when file cannot be read due to permissions', () => {
			const filePaths = ['ProtectedFile.sol']
			const permissionError = new Error('EACCES: permission denied')
			Object.assign(permissionError, { code: 'EACCES' })

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockImplementation(() => {
				throw permissionError
			})

			expect(() => {
				readSourceFilesSync(filePaths, 'Solidity', mockLogger)
			}).toThrow(FileReadError)

			try {
				readSourceFilesSync(filePaths, 'Solidity', mockLogger)
			} catch (error) {
				expect(error).toBeInstanceOf(FileReadError)
				expect((error as FileReadError).message).toBe('Failed to read file ProtectedFile.sol')
				expect((error as FileReadError).meta?.code).toBe('read_failed')
				expect((error as FileReadError).cause).toBe(permissionError)
			}

			expect(mockLogger.error).toHaveBeenCalledWith('Failed to read file ProtectedFile.sol')
		})

		it('should handle EPERM error code', () => {
			const filePaths = ['LockedFile.sol']
			const lockError = new Error('EPERM: operation not permitted')
			Object.assign(lockError, { code: 'EPERM' })

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockImplementation(() => {
				throw lockError
			})

			expect(() => {
				readSourceFilesSync(filePaths, 'Solidity', mockLogger)
			}).toThrow(FileReadError)
		})
	})

	describe('invalid paths', () => {
		it('should handle validateFiles rejecting invalid paths', () => {
			const filePaths = ['']
			const validationError = new Error('Invalid file path')

			mockValidateFiles.mockImplementation(() => {
				throw validationError
			})

			expect(() => {
				readSourceFilesSync(filePaths, 'Solidity', mockLogger)
			}).toThrow(validationError)

			expect(mockValidateFiles).toHaveBeenCalledWith(filePaths, 'Solidity', mockLogger)
			expect(mockReadFileSync).not.toHaveBeenCalled()
		})

		it('should not attempt to read files if validation fails', () => {
			const filePaths = ['invalid', 'paths']
			const validationError = new Error('Validation failed')

			mockValidateFiles.mockImplementation(() => {
				throw validationError
			})

			expect(() => {
				readSourceFilesSync(filePaths, 'Solidity', mockLogger)
			}).toThrow(validationError)

			expect(mockReadFileSync).not.toHaveBeenCalled()
			expect(mockLogger.debug).not.toHaveBeenCalled()
		})
	})

	describe('sync operation', () => {
		it('should execute synchronously without promises', () => {
			const filePaths = ['Contract.sol']
			const content = 'pragma solidity ^0.8.0; contract TestContract {}'

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue(content)

			const result = readSourceFilesSync(filePaths, 'Solidity', mockLogger)

			expect(result).not.toBeInstanceOf(Promise)
			expect(result).toEqual({
				'Contract.sol': content,
			})
		})

		it('should read files in sequence synchronously', () => {
			const filePaths = ['File1.sol', 'File2.sol', 'File3.sol']
			const callOrder: string[] = []

			mockValidateFiles.mockReturnValue(filePaths)
			mockResolve.mockImplementation((path: string) => {
				callOrder.push(`resolve:${path}`)
				return `/absolute/${path}`
			})
			mockReadFileSync.mockImplementation((path: string) => {
				callOrder.push(`read:${path}`)
				return 'content'
			})

			readSourceFilesSync(filePaths, 'Solidity', mockLogger)

			expect(callOrder).toEqual([
				'resolve:File1.sol',
				'read:/absolute/File1.sol',
				'resolve:File2.sol',
				'read:/absolute/File2.sol',
				'resolve:File3.sol',
				'read:/absolute/File3.sol',
			])
		})

		it('should return immediately without async operations', () => {
			const filePaths = ['QuickFile.sol']

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue('content')

			const startTime = Date.now()
			const result = readSourceFilesSync(filePaths, 'Solidity', mockLogger)
			const endTime = Date.now()

			expect(result).toBeDefined()
			expect(endTime - startTime).toBeLessThan(100)
		})
	})

	describe('JSON parsing for SolidityAST', () => {
		it('should parse valid JSON AST', () => {
			const filePaths = ['Contract.json']
			const astObject = {
				nodeType: 'SourceUnit',
				src: '0:0:0',
				nodes: [],
			}

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue(JSON.stringify(astObject))

			const result = readSourceFilesSync(filePaths, 'SolidityAST', mockLogger)

			expect(result['Contract.json']).toEqual(astObject)
		})

		it('should parse complex nested JSON AST', () => {
			const filePaths = ['Complex.json']
			const complexAst = {
				nodeType: 'SourceUnit',
				src: '0:0:0',
				nodes: [
					{
						nodeType: 'ContractDefinition',
						name: 'TestContract',
						nodes: [
							{
								nodeType: 'FunctionDefinition',
								name: 'testFunction',
								parameters: [],
							},
						],
					},
				],
			}

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue(JSON.stringify(complexAst))

			const result = readSourceFilesSync(filePaths, 'SolidityAST', mockLogger)

			expect(result['Complex.json']).toEqual(complexAst)
		})

		it('should handle empty JSON object', () => {
			const filePaths = ['Empty.json']
			const emptyAst = {}

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue(JSON.stringify(emptyAst))

			const result = readSourceFilesSync(filePaths, 'SolidityAST', mockLogger)

			expect(result['Empty.json']).toEqual(emptyAst)
		})

		it('should handle JSON array', () => {
			const filePaths = ['Array.json']
			const arrayAst = [{ nodeType: 'SourceUnit' }, { nodeType: 'SourceUnit' }]

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue(JSON.stringify(arrayAst))

			const result = readSourceFilesSync(filePaths, 'SolidityAST', mockLogger)

			expect(result['Array.json']).toEqual(arrayAst)
		})
	})

	describe('JSON parsing errors', () => {
		it('should throw FileReadError when JSON parsing fails', () => {
			const filePaths = ['Invalid.json']
			const invalidJson = '{ invalid json }'

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue(invalidJson)

			expect(() => {
				readSourceFilesSync(filePaths, 'SolidityAST', mockLogger)
			}).toThrow(FileReadError)

			try {
				readSourceFilesSync(filePaths, 'SolidityAST', mockLogger)
			} catch (error) {
				expect(error).toBeInstanceOf(FileReadError)
				expect((error as FileReadError).message).toBe('Failed to parse JSON file Invalid.json')
				expect((error as FileReadError).meta?.code).toBe('json_parse_failed')
				expect((error as FileReadError).meta?.filePath).toBe('Invalid.json')
				expect((error as FileReadError).meta?.absolutePath).toBe('/absolute/Invalid.json')
			}

			expect(mockLogger.error).toHaveBeenCalledWith('Failed to parse JSON file Invalid.json')
		})

		it('should throw FileReadError for malformed JSON', () => {
			const filePaths = ['Malformed.json']
			const malformedJson = '{"key": "value",}'

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue(malformedJson)

			expect(() => {
				readSourceFilesSync(filePaths, 'SolidityAST', mockLogger)
			}).toThrow(FileReadError)
		})

		it('should throw FileReadError for truncated JSON', () => {
			const filePaths = ['Truncated.json']
			const truncatedJson = '{"key": "val'

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue(truncatedJson)

			expect(() => {
				readSourceFilesSync(filePaths, 'SolidityAST', mockLogger)
			}).toThrow(FileReadError)
		})

		it('should throw FileReadError for empty string when expecting JSON', () => {
			const filePaths = ['Empty.json']

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue('')

			expect(() => {
				readSourceFilesSync(filePaths, 'SolidityAST', mockLogger)
			}).toThrow(FileReadError)
		})

		it('should include cause in FileReadError for JSON parse failure', () => {
			const filePaths = ['BadJson.json']
			const badJson = 'not json at all'

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue(badJson)

			try {
				readSourceFilesSync(filePaths, 'SolidityAST', mockLogger)
			} catch (error) {
				expect(error).toBeInstanceOf(FileReadError)
				expect((error as FileReadError).cause).toBeInstanceOf(Error)
			}
		})
	})

	describe('path resolution', () => {
		it('should resolve relative paths to absolute paths', () => {
			const filePaths = ['relative/path/Contract.sol']

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue('content')
			mockResolve.mockReturnValue('/absolute/resolved/path/Contract.sol')

			readSourceFilesSync(filePaths, 'Solidity', mockLogger)

			expect(mockResolve).toHaveBeenCalledWith('relative/path/Contract.sol')
			expect(mockReadFileSync).toHaveBeenCalledWith('/absolute/resolved/path/Contract.sol', 'utf-8')
		})

		it('should handle paths with special characters', () => {
			const filePaths = ['path with spaces/Contract.sol']

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue('content')
			mockResolve.mockReturnValue('/absolute/path with spaces/Contract.sol')

			readSourceFilesSync(filePaths, 'Solidity', mockLogger)

			expect(mockResolve).toHaveBeenCalledWith('path with spaces/Contract.sol')
		})

		it('should use resolved path in logger debug messages', () => {
			const filePaths = ['Contract.sol']

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue('content')
			mockResolve.mockReturnValue('/custom/absolute/path/Contract.sol')

			readSourceFilesSync(filePaths, 'Solidity', mockLogger)

			expect(mockLogger.debug).toHaveBeenCalledWith('Reading file: /custom/absolute/path/Contract.sol')
		})
	})

	describe('error handling during partial reads', () => {
		it('should throw error on first file failure when reading multiple files', () => {
			const filePaths = ['File1.sol', 'File2.sol', 'File3.sol']
			const fsError = new Error('Read failed')

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockImplementation(() => {
				throw fsError
			})

			expect(() => {
				readSourceFilesSync(filePaths, 'Solidity', mockLogger)
			}).toThrow(FileReadError)

			expect(mockReadFileSync).toHaveBeenCalledTimes(1)
		})

		it('should throw error on second file failure', () => {
			const filePaths = ['File1.sol', 'File2.sol', 'File3.sol']
			const fsError = new Error('Read failed on second file')

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValueOnce('content1').mockImplementation(() => {
				throw fsError
			})

			expect(() => {
				readSourceFilesSync(filePaths, 'Solidity', mockLogger)
			}).toThrow(FileReadError)

			expect(mockReadFileSync).toHaveBeenCalledTimes(2)
		})

		it('should not return partial results on error', () => {
			const filePaths = ['File1.sol', 'File2.sol']
			const fsError = new Error('Read failed')

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValueOnce('content1').mockImplementation(() => {
				throw fsError
			})

			let caughtError: Error | null = null
			let result: any = null

			try {
				result = readSourceFilesSync(filePaths, 'Solidity', mockLogger)
			} catch (error) {
				caughtError = error as Error
			}

			expect(caughtError).toBeInstanceOf(FileReadError)
			expect(result).toBeNull()
		})
	})

	describe('mixed language scenarios', () => {
		it('should not parse JSON when language is Solidity', () => {
			const filePaths = ['Contract.sol']
			const jsonLikeContent = '{"key": "value"}'

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue(jsonLikeContent)

			const result = readSourceFilesSync(filePaths, 'Solidity', mockLogger)

			expect(result['Contract.sol']).toBe(jsonLikeContent)
			expect(typeof result['Contract.sol']).toBe('string')
		})

		it('should not parse JSON when language is Yul', () => {
			const filePaths = ['Contract.yul']
			const jsonLikeContent = '{"key": "value"}'

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue(jsonLikeContent)

			const result = readSourceFilesSync(filePaths, 'Yul', mockLogger)

			expect(result['Contract.yul']).toBe(jsonLikeContent)
			expect(typeof result['Contract.yul']).toBe('string')
		})

		it('should not parse JSON when language is undefined', () => {
			const filePaths = ['Contract.sol']
			const jsonLikeContent = '{"key": "value"}'

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue(jsonLikeContent)

			const result = readSourceFilesSync(filePaths, undefined, mockLogger)

			expect(result['Contract.sol']).toBe(jsonLikeContent)
			expect(typeof result['Contract.sol']).toBe('string')
		})
	})

	describe('return value structure', () => {
		it('should return object with file paths as keys', () => {
			const filePaths = ['File1.sol', 'File2.sol']

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue('content')

			const result = readSourceFilesSync(filePaths, 'Solidity', mockLogger)

			expect(Object.keys(result)).toEqual(['File1.sol', 'File2.sol'])
		})

		it('should preserve original file path in keys, not absolute path', () => {
			const filePaths = ['relative/Contract.sol']

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue('content')
			mockResolve.mockReturnValue('/absolute/relative/Contract.sol')

			const result = readSourceFilesSync(filePaths, 'Solidity', mockLogger)

			expect(Object.keys(result)).toEqual(['relative/Contract.sol'])
			expect(result['relative/Contract.sol']).toBe('content')
		})

		it('should return empty object when validated paths is empty', () => {
			mockValidateFiles.mockReturnValue([])

			const result = readSourceFilesSync(['Contract.sol'], 'Solidity', mockLogger)

			expect(result).toEqual({})
			expect(Object.keys(result)).toHaveLength(0)
		})
	})

	describe('edge cases', () => {
		it('should handle very large file content', () => {
			const filePaths = ['LargeFile.sol']
			const largeContent = 'a'.repeat(10_000_000)

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue(largeContent)

			const result = readSourceFilesSync(filePaths, 'Solidity', mockLogger)

			expect(result['LargeFile.sol']).toBe(largeContent)
			expect((result['LargeFile.sol'] as string).length).toBe(10_000_000)
		})

		it('should handle file with unicode characters', () => {
			const filePaths = ['Unicode.sol']
			const unicodeContent = 'pragma solidity ^0.8.0; // 你好世界 🌍'

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue(unicodeContent)

			const result = readSourceFilesSync(filePaths, 'Solidity', mockLogger)

			expect(result['Unicode.sol']).toBe(unicodeContent)
		})

		it('should handle file with newlines and special characters', () => {
			const filePaths = ['Special.sol']
			const specialContent = 'line1\nline2\r\nline3\ttab'

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue(specialContent)

			const result = readSourceFilesSync(filePaths, 'Solidity', mockLogger)

			expect(result['Special.sol']).toBe(specialContent)
		})

		it('should handle empty file content', () => {
			const filePaths = ['Empty.sol']

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue('')

			const result = readSourceFilesSync(filePaths, 'Solidity', mockLogger)

			expect(result['Empty.sol']).toBe('')
		})

		it('should handle file paths with dots', () => {
			const filePaths = ['../parent/Contract.sol']

			mockValidateFiles.mockReturnValue(filePaths)
			mockReadFileSync.mockReturnValue('content')

			const result = readSourceFilesSync(filePaths, 'Solidity', mockLogger)

			expect(result['../parent/Contract.sol']).toBe('content')
		})
	})
})
