import type { Logger } from '@tevm/logger'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FileValidationError } from './errors.js'
import { validateFiles } from './validateFiles.js'

describe('validateFiles', () => {
	const mockLogger = {
		debug: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
	} as unknown as Logger

	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('valid file paths', () => {
		it('should validate single .sol file', () => {
			const filePaths = ['Contract.sol']
			const result = validateFiles(filePaths, undefined, mockLogger)

			expect(result).toEqual(filePaths)
			expect(mockLogger.debug).toHaveBeenCalledWith(
				"Validated 1 files with extension '.sol'; language will be set to Solidity",
			)
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should validate multiple .sol files', () => {
			const filePaths = ['Contract1.sol', 'Contract2.sol', 'Contract3.sol']
			const result = validateFiles(filePaths, undefined, mockLogger)

			expect(result).toEqual(filePaths)
			expect(mockLogger.debug).toHaveBeenCalledWith(
				"Validated 3 files with extension '.sol'; language will be set to Solidity",
			)
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should validate single .yul file', () => {
			const filePaths = ['Contract.yul']
			const result = validateFiles(filePaths, undefined, mockLogger)

			expect(result).toEqual(filePaths)
			expect(mockLogger.debug).toHaveBeenCalledWith(
				"Validated 1 files with extension '.yul'; language will be set to Yul",
			)
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should validate multiple .yul files', () => {
			const filePaths = ['Contract1.yul', 'Contract2.yul']
			const result = validateFiles(filePaths, undefined, mockLogger)

			expect(result).toEqual(filePaths)
			expect(mockLogger.debug).toHaveBeenCalledWith(
				"Validated 2 files with extension '.yul'; language will be set to Yul",
			)
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should validate single .json file', () => {
			const filePaths = ['ast.json']
			const result = validateFiles(filePaths, undefined, mockLogger)

			expect(result).toEqual(filePaths)
			expect(mockLogger.debug).toHaveBeenCalledWith(
				"Validated 1 files with extension '.json'; language will be set to SolidityAST",
			)
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should validate multiple .json files', () => {
			const filePaths = ['ast1.json', 'ast2.json']
			const result = validateFiles(filePaths, undefined, mockLogger)

			expect(result).toEqual(filePaths)
			expect(mockLogger.debug).toHaveBeenCalledWith(
				"Validated 2 files with extension '.json'; language will be set to SolidityAST",
			)
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should validate file paths with directories', () => {
			const filePaths = ['/path/to/Contract.sol', './relative/Contract.sol', '../other/Contract.sol']
			const result = validateFiles(filePaths, undefined, mockLogger)

			expect(result).toEqual(filePaths)
			expect(mockLogger.debug).toHaveBeenCalledWith(
				"Validated 3 files with extension '.sol'; language will be set to Solidity",
			)
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should validate file paths with special characters in names', () => {
			const filePaths = ['Contract-v1.sol', 'Contract_v2.sol', 'Contract.v3.sol']
			const result = validateFiles(filePaths, undefined, mockLogger)

			expect(result).toEqual(filePaths)
			expect(mockLogger.error).not.toHaveBeenCalled()
		})
	})

	describe('validation with explicit language', () => {
		it('should validate .sol files with Solidity language', () => {
			const filePaths = ['Contract.sol']
			const result = validateFiles(filePaths, 'Solidity', mockLogger)

			expect(result).toEqual(filePaths)
			expect(mockLogger.debug).toHaveBeenCalledWith("Validated 1 files with extension '.sol' for language 'Solidity'")
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should validate .yul files with Yul language', () => {
			const filePaths = ['Contract.yul']
			const result = validateFiles(filePaths, 'Yul', mockLogger)

			expect(result).toEqual(filePaths)
			expect(mockLogger.debug).toHaveBeenCalledWith("Validated 1 files with extension '.yul' for language 'Yul'")
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should validate .json files with SolidityAST language', () => {
			const filePaths = ['ast.json']
			const result = validateFiles(filePaths, 'SolidityAST', mockLogger)

			expect(result).toEqual(filePaths)
			expect(mockLogger.debug).toHaveBeenCalledWith(
				"Validated 1 files with extension '.json' for language 'SolidityAST'",
			)
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should validate multiple .sol files with Solidity language', () => {
			const filePaths = ['Contract1.sol', 'Contract2.sol', 'Contract3.sol']
			const result = validateFiles(filePaths, 'Solidity', mockLogger)

			expect(result).toEqual(filePaths)
			expect(mockLogger.debug).toHaveBeenCalledWith("Validated 3 files with extension '.sol' for language 'Solidity'")
			expect(mockLogger.error).not.toHaveBeenCalled()
		})
	})

	describe('invalid input - not an array', () => {
		it('should throw FileValidationError when filePaths is not an array', () => {
			// @ts-expect-error - Testing invalid input
			expect(() => validateFiles('Contract.sol', undefined, mockLogger)).toThrow(FileValidationError)
		})

		it('should throw error with correct message when filePaths is string', () => {
			try {
				// @ts-expect-error - Testing invalid input
				validateFiles('Contract.sol', undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).message).toBe('File paths must be an array')
				expect((error as FileValidationError).meta?.code).toBe('invalid_array')
				expect(mockLogger.error).toHaveBeenCalledWith('File paths must be an array')
			}
		})

		it('should throw error with correct metadata when filePaths is null', () => {
			try {
				// @ts-expect-error - Testing invalid input
				validateFiles(null, undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).meta?.code).toBe('invalid_array')
				expect((error as FileValidationError).meta?.filePaths).toBe(null)
			}
		})

		it('should throw error when filePaths is undefined', () => {
			try {
				// @ts-expect-error - Testing invalid input
				validateFiles(undefined, undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).meta?.code).toBe('invalid_array')
			}
		})

		it('should throw error when filePaths is an object', () => {
			try {
				// @ts-expect-error - Testing invalid input
				validateFiles({ file: 'Contract.sol' }, undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).meta?.code).toBe('invalid_array')
			}
		})

		it('should throw error when filePaths is a number', () => {
			try {
				// @ts-expect-error - Testing invalid input
				validateFiles(123, undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).meta?.code).toBe('invalid_array')
			}
		})
	})

	describe('empty array', () => {
		it('should throw FileValidationError when filePaths is empty array', () => {
			expect(() => validateFiles([], undefined, mockLogger)).toThrow(FileValidationError)
		})

		it('should throw error with correct message for empty array', () => {
			try {
				validateFiles([], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).message).toBe('At least one file path must be provided')
				expect((error as FileValidationError).meta?.code).toBe('empty_array')
				expect((error as FileValidationError).meta?.filePaths).toEqual([])
				expect(mockLogger.error).toHaveBeenCalledWith('At least one file path must be provided')
			}
		})
	})

	describe('invalid file paths', () => {
		it('should throw error when filePath is not a string', () => {
			try {
				// @ts-expect-error - Testing invalid input
				validateFiles([123], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).message).toBe('Invalid file path: 123')
				expect((error as FileValidationError).meta?.code).toBe('invalid_path')
				expect((error as FileValidationError).meta?.invalidPath).toBe(123)
			}
		})

		it('should throw error when filePath is empty string', () => {
			try {
				validateFiles([''], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).message).toBe('Invalid file path: ')
				expect((error as FileValidationError).meta?.code).toBe('invalid_path')
				expect((error as FileValidationError).meta?.invalidPath).toBe('')
			}
		})

		it('should throw error when filePath is whitespace only', () => {
			try {
				validateFiles(['   '], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).message).toBe('Invalid file path:    ')
				expect((error as FileValidationError).meta?.code).toBe('invalid_path')
			}
		})

		it('should throw error when one filePath in array is invalid', () => {
			try {
				validateFiles(['Contract1.sol', '', 'Contract2.sol'], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).meta?.code).toBe('invalid_path')
			}
		})

		it('should throw error when filePath is null in array', () => {
			try {
				// @ts-expect-error - Testing invalid input
				validateFiles(['Contract1.sol', null], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).meta?.code).toBe('invalid_path')
				expect((error as FileValidationError).meta?.invalidPath).toBe(null)
			}
		})

		it('should throw error when filePath is undefined in array', () => {
			try {
				// @ts-expect-error - Testing invalid input
				validateFiles(['Contract1.sol', undefined], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).meta?.code).toBe('invalid_path')
			}
		})
	})

	describe('file extensions', () => {
		it('should throw error when file has no extension', () => {
			try {
				validateFiles(['Contract'], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).message).toBe('All files must have an extension')
				expect((error as FileValidationError).meta?.code).toBe('no_extension')
				expect((error as FileValidationError).meta?.filePaths).toEqual(['Contract'])
			}
		})

		it('should throw error when one file has no extension', () => {
			try {
				validateFiles(['Contract1.sol', 'Contract2'], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).meta?.code).toBe('mixed_extensions')
			}
		})

		it('should throw error for unsupported extension', () => {
			try {
				validateFiles(['Contract.txt'], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).message).toBe(
					"Unsupported file extension '.txt'. Supported: .sol, .yul, .json",
				)
				expect((error as FileValidationError).meta?.code).toBe('unsupported_extension')
				expect((error as FileValidationError).meta?.invalidPath).toBe('Contract.txt')
			}
		})

		it('should throw error for .js extension', () => {
			try {
				validateFiles(['script.js'], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).meta?.code).toBe('unsupported_extension')
			}
		})

		it('should throw error for .ts extension', () => {
			try {
				validateFiles(['script.ts'], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).meta?.code).toBe('unsupported_extension')
			}
		})

		it('should throw error for .py extension', () => {
			try {
				validateFiles(['script.py'], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).meta?.code).toBe('unsupported_extension')
			}
		})
	})

	describe('mixed extensions', () => {
		it('should throw error when mixing .sol and .yul files', () => {
			try {
				validateFiles(['Contract.sol', 'Contract.yul'], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).message).toBe('All files must have the same extension. Found: .sol, .yul')
				expect((error as FileValidationError).meta?.code).toBe('mixed_extensions')
				expect((error as FileValidationError).meta?.extensions).toEqual(['.sol', '.yul'])
			}
		})

		it('should throw error when mixing .sol and .json files', () => {
			try {
				validateFiles(['Contract.sol', 'ast.json'], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).message).toBe(
					'All files must have the same extension. Found: .sol, .json',
				)
				expect((error as FileValidationError).meta?.code).toBe('mixed_extensions')
				expect((error as FileValidationError).meta?.extensions).toEqual(['.sol', '.json'])
			}
		})

		it('should throw error when mixing .yul and .json files', () => {
			try {
				validateFiles(['Contract.yul', 'ast.json'], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).meta?.code).toBe('mixed_extensions')
				expect((error as FileValidationError).meta?.extensions).toEqual(['.yul', '.json'])
			}
		})

		it('should throw error when mixing three different extensions', () => {
			try {
				validateFiles(['Contract.sol', 'Contract.yul', 'ast.json'], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).meta?.code).toBe('mixed_extensions')
				expect((error as FileValidationError).meta?.extensions?.length).toBe(3)
			}
		})

		it('should throw error when mixing supported and unsupported extensions', () => {
			try {
				validateFiles(['Contract.sol', 'script.txt'], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).meta?.code).toBe('mixed_extensions')
			}
		})
	})

	describe('language and extension mismatch', () => {
		it('should throw error when .sol file used with Yul language', () => {
			try {
				validateFiles(['Contract.sol'], 'Yul', mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).message).toBe(
					"Files with extension '.sol' cannot be compiled as 'Yul'. Expected: .yul",
				)
				expect((error as FileValidationError).meta?.code).toBe('extension_mismatch')
				expect((error as FileValidationError).meta?.language).toBe('Yul')
				expect((error as FileValidationError).meta?.extension).toBe('.sol')
				expect((error as FileValidationError).meta?.expectedExtension).toBe('.yul')
			}
		})

		it('should throw error when .sol file used with SolidityAST language', () => {
			try {
				validateFiles(['Contract.sol'], 'SolidityAST', mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).message).toBe(
					"Files with extension '.sol' cannot be compiled as 'SolidityAST'. Expected: .json",
				)
				expect((error as FileValidationError).meta?.code).toBe('extension_mismatch')
				expect((error as FileValidationError).meta?.expectedExtension).toBe('.json')
			}
		})

		it('should throw error when .yul file used with Solidity language', () => {
			try {
				validateFiles(['Contract.yul'], 'Solidity', mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).message).toBe(
					"Files with extension '.yul' cannot be compiled as 'Solidity'. Expected: .sol",
				)
				expect((error as FileValidationError).meta?.code).toBe('extension_mismatch')
				expect((error as FileValidationError).meta?.expectedExtension).toBe('.sol')
			}
		})

		it('should throw error when .yul file used with SolidityAST language', () => {
			try {
				validateFiles(['Contract.yul'], 'SolidityAST', mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).meta?.code).toBe('extension_mismatch')
				expect((error as FileValidationError).meta?.expectedExtension).toBe('.json')
			}
		})

		it('should throw error when .json file used with Solidity language', () => {
			try {
				validateFiles(['ast.json'], 'Solidity', mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).message).toBe(
					"Files with extension '.json' cannot be compiled as 'Solidity'. Expected: .sol",
				)
				expect((error as FileValidationError).meta?.code).toBe('extension_mismatch')
				expect((error as FileValidationError).meta?.expectedExtension).toBe('.sol')
			}
		})

		it('should throw error when .json file used with Yul language', () => {
			try {
				validateFiles(['ast.json'], 'Yul', mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
				expect((error as FileValidationError).meta?.code).toBe('extension_mismatch')
				expect((error as FileValidationError).meta?.expectedExtension).toBe('.yul')
			}
		})
	})

	describe('edge cases', () => {
		it('should handle file path with multiple dots', () => {
			const filePaths = ['Contract.v1.2.3.sol']
			const result = validateFiles(filePaths, undefined, mockLogger)

			expect(result).toEqual(filePaths)
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should handle file path with dot at start', () => {
			const filePaths = ['.Contract.sol']
			const result = validateFiles(filePaths, undefined, mockLogger)

			expect(result).toEqual(filePaths)
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should handle very long file paths', () => {
			const longPath = '/very/long/path/to/some/deeply/nested/directory/structure/Contract.sol'
			const filePaths = [longPath]
			const result = validateFiles(filePaths, undefined, mockLogger)

			expect(result).toEqual(filePaths)
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should handle file path with spaces', () => {
			const filePaths = ['My Contract.sol']
			const result = validateFiles(filePaths, undefined, mockLogger)

			expect(result).toEqual(filePaths)
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should handle absolute Windows-style paths', () => {
			const filePaths = ['C:\\Users\\Developer\\Contract.sol']
			const result = validateFiles(filePaths, undefined, mockLogger)

			expect(result).toEqual(filePaths)
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should handle file path with unicode characters', () => {
			const filePaths = ['Contract_日本語.sol']
			const result = validateFiles(filePaths, undefined, mockLogger)

			expect(result).toEqual(filePaths)
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should extract extension from last dot only', () => {
			const filePaths = ['Contract.backup.sol']
			const result = validateFiles(filePaths, undefined, mockLogger)

			expect(result).toEqual(filePaths)
			expect(mockLogger.debug).toHaveBeenCalledWith(
				"Validated 1 files with extension '.sol'; language will be set to Solidity",
			)
		})
	})

	describe('logger calls', () => {
		it('should call logger.error when throwing FileValidationError', () => {
			try {
				validateFiles([], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch {
				expect(mockLogger.error).toHaveBeenCalled()
			}
		})

		it('should call logger.debug on successful validation without language', () => {
			validateFiles(['Contract.sol'], undefined, mockLogger)

			expect(mockLogger.debug).toHaveBeenCalledTimes(1)
			expect(mockLogger.debug).toHaveBeenCalledWith(
				"Validated 1 files with extension '.sol'; language will be set to Solidity",
			)
		})

		it('should call logger.debug on successful validation with language', () => {
			validateFiles(['Contract.sol'], 'Solidity', mockLogger)

			expect(mockLogger.debug).toHaveBeenCalledTimes(1)
			expect(mockLogger.debug).toHaveBeenCalledWith("Validated 1 files with extension '.sol' for language 'Solidity'")
		})

		it('should not call logger.info or logger.warn on successful validation', () => {
			validateFiles(['Contract.sol'], undefined, mockLogger)

			expect(mockLogger.info).not.toHaveBeenCalled()
			expect(mockLogger.warn).not.toHaveBeenCalled()
		})

		it('should call logger.error for each error type', () => {
			const testCases = [
				{ input: [], expectedError: 'At least one file path must be provided' },
				{ input: [''], expectedError: 'Invalid file path: ' },
				{ input: ['Contract'], expectedError: 'All files must have an extension' },
				{ input: ['Contract.txt'], expectedError: "Unsupported file extension '.txt'. Supported: .sol, .yul, .json" },
				{ input: ['Contract.sol', 'Contract.yul'], expectedError: 'All files must have the same extension' },
			]

			testCases.forEach(({ input, expectedError }) => {
				;(mockLogger.error as ReturnType<typeof vi.fn>).mockClear()
				try {
					validateFiles(input, undefined, mockLogger)
					expect.fail('Should have thrown FileValidationError')
				} catch {
					expect(mockLogger.error).toHaveBeenCalled()
					expect((mockLogger.error as ReturnType<typeof vi.fn>).mock.calls[0]?.[0]).toContain(
						expectedError.split('.')[0],
					)
				}
			})
		})
	})

	describe('return value', () => {
		it('should return the same array reference', () => {
			const filePaths = ['Contract.sol']
			const result = validateFiles(filePaths, undefined, mockLogger)

			expect(result).toBe(filePaths)
		})

		it('should return array with all original paths', () => {
			const filePaths = ['Contract1.sol', 'Contract2.sol', 'Contract3.sol']
			const result = validateFiles(filePaths, undefined, mockLogger)

			expect(result).toHaveLength(3)
			expect(result[0]).toBe('Contract1.sol')
			expect(result[1]).toBe('Contract2.sol')
			expect(result[2]).toBe('Contract3.sol')
		})

		it('should not modify the input array', () => {
			const filePaths = ['Contract.sol']
			const originalLength = filePaths.length
			const originalFirstItem = filePaths[0]

			validateFiles(filePaths, undefined, mockLogger)

			expect(filePaths.length).toBe(originalLength)
			expect(filePaths[0]).toBe(originalFirstItem)
		})
	})

	describe('error inheritance', () => {
		it('should throw error that is instance of Error', () => {
			try {
				validateFiles([], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(Error)
			}
		})

		it('should throw error that is instance of FileValidationError', () => {
			try {
				validateFiles([], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect(error).toBeInstanceOf(FileValidationError)
			}
		})

		it('should throw error with correct name property', () => {
			try {
				validateFiles([], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect((error as FileValidationError).name).toBe('FileValidationError')
			}
		})

		it('should throw error with stack trace', () => {
			try {
				validateFiles([], undefined, mockLogger)
				expect.fail('Should have thrown FileValidationError')
			} catch (error) {
				expect((error as Error).stack).toBeDefined()
				expect((error as Error).stack).toContain('FileValidationError')
			}
		})
	})
})
