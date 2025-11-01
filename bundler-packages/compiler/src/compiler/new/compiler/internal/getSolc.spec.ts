import type { Logger } from '@tevm/logger'
import type { Solc } from '@tevm/solc'
import { assert, beforeEach, describe, expect, it, vi } from 'vitest'
import { SolcError } from './errors.js'
import { getSolc } from './getSolc.js'

vi.mock('@tevm/solc', () => ({
	createSolc: vi.fn(),
}))

const { createSolc } = await import('@tevm/solc')
const mockCreateSolc = vi.mocked(createSolc)

describe('getSolc', () => {
	const mockLogger = {
		debug: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
	} as unknown as Logger

	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('successful solc loading', () => {
		it('should load solc instance for valid version', async () => {
			const mockSolc = { compile: vi.fn() } as unknown as Solc
			mockCreateSolc.mockResolvedValue(mockSolc)

			const version = '0.8.28'
			const result = await getSolc(version, mockLogger)

			expect(result).toBe(mockSolc)
			expect(result.compile).toBeDefined()
			expect(typeof result.compile).toBe('function')
			expect(mockLogger.debug).toHaveBeenCalledWith('Successfully loaded solc instance for version 0.8.28')
		})

		it('should load different versions', async () => {
			const mockSolc1 = { compile: vi.fn() } as unknown as Solc
			const mockSolc2 = { compile: vi.fn() } as unknown as Solc
			mockCreateSolc.mockResolvedValueOnce(mockSolc1)
			mockCreateSolc.mockResolvedValueOnce(mockSolc2)

			const version1 = '0.8.28'
			const version2 = '0.8.20'

			const result1 = await getSolc(version1, mockLogger)
			const result2 = await getSolc(version2, mockLogger)

			expect(result1).toBe(mockSolc1)
			expect(result2).toBe(mockSolc2)
			expect(mockLogger.debug).toHaveBeenCalledWith('Successfully loaded solc instance for version 0.8.28')
			expect(mockLogger.debug).toHaveBeenCalledWith('Successfully loaded solc instance for version 0.8.20')
		})

		it('should not call error logger on success', async () => {
			const mockSolc = { compile: vi.fn() } as unknown as Solc
			mockCreateSolc.mockResolvedValue(mockSolc)

			const version = '0.8.28'
			await getSolc(version, mockLogger)

			expect(mockLogger.error).not.toHaveBeenCalled()
		})
	})

	describe('error handling', () => {
		it('should throw SolcError when createSolc fails', async () => {
			const originalError = new Error('Network error')
			mockCreateSolc.mockRejectedValue(originalError)

			const version = '99.99.99'
			// @ts-expect-error - Invalid version
			await expect(getSolc(version, mockLogger)).rejects.toThrow(SolcError)
		})

		it('should include correct error message', async () => {
			const originalError = new Error('Network error')
			mockCreateSolc.mockRejectedValue(originalError)

			const version = '99.99.99'
			// @ts-expect-error - Invalid version
			await expect(getSolc(version, mockLogger)).rejects.toThrow('Failed to load solc instance for version 99.99.99')
		})

		it('should include correct metadata in SolcError', async () => {
			const originalError = new Error('Network error')
			mockCreateSolc.mockRejectedValue(originalError)

			const version = '99.99.99'
			try {
				// @ts-expect-error - Invalid version
				await getSolc(version, mockLogger)
				expect.fail('Should have thrown an error')
			} catch (error) {
				expect(error).toBeInstanceOf(SolcError)
				const solcError = error as SolcError
				expect(solcError.meta?.code).toBe('instantiation_failed')
				expect(solcError.meta?.version).toBe(version)
			}
		})

		it('should log error message on failure', async () => {
			const originalError = new Error('Network error')
			mockCreateSolc.mockRejectedValue(originalError)

			const version = '99.99.99'

			try {
				// @ts-expect-error - Invalid version
				await getSolc(version, mockLogger)
			} catch {
				assert(true)
			}

			expect(mockLogger.error).toHaveBeenCalledWith('Failed to load solc instance for version 99.99.99')
		})

		it('should not log debug message on failure', async () => {
			const originalError = new Error('Network error')
			mockCreateSolc.mockRejectedValue(originalError)

			const version = '99.99.99'

			try {
				// @ts-expect-error - Invalid version
				await getSolc(version, mockLogger)
			} catch {
				assert(true)
			}

			expect(mockLogger.debug).not.toHaveBeenCalled()
		})

		it('should have correct error name and tag', async () => {
			const originalError = new Error('Network error')
			mockCreateSolc.mockRejectedValue(originalError)

			const version = '99.99.99'

			try {
				// @ts-expect-error - Invalid version
				await getSolc(version, mockLogger)
				expect.fail('Should have thrown an error')
			} catch (error) {
				expect((error as SolcError).name).toBe('SolcError')
				expect((error as SolcError)._tag).toBe('SolcError')
			}
		})

		it('should include cause in SolcError', async () => {
			const originalError = new Error('Network error')
			mockCreateSolc.mockRejectedValue(originalError)

			const version = '99.99.99'

			try {
				// @ts-expect-error - Invalid version
				await getSolc(version, mockLogger)
				expect.fail('Should have thrown an error')
			} catch (error) {
				expect((error as SolcError).cause).toBe(originalError)
			}
		})
	})

	describe('logger interaction', () => {
		it('should use provided logger for debug logging', async () => {
			const mockSolc = { compile: vi.fn() } as unknown as Solc
			mockCreateSolc.mockResolvedValue(mockSolc)

			const customLogger = {
				debug: vi.fn(),
				info: vi.fn(),
				warn: vi.fn(),
				error: vi.fn(),
			} as unknown as Logger

			const version = '0.8.28'
			await getSolc(version, customLogger)

			expect(customLogger.debug).toHaveBeenCalledWith('Successfully loaded solc instance for version 0.8.28')
			expect(mockLogger.debug).not.toHaveBeenCalled()
		})

		it('should use provided logger for error logging', async () => {
			const originalError = new Error('Network error')
			mockCreateSolc.mockRejectedValue(originalError)

			const customLogger = {
				debug: vi.fn(),
				info: vi.fn(),
				warn: vi.fn(),
				error: vi.fn(),
			} as unknown as Logger

			const version = '99.99.99'

			try {
				// @ts-expect-error - Invalid version
				await getSolc(version, customLogger)
			} catch {
				assert(true)
			}

			expect(customLogger.error).toHaveBeenCalledWith('Failed to load solc instance for version 99.99.99')
			expect(mockLogger.error).not.toHaveBeenCalled()
		})
	})
})
