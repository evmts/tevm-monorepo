import type { Logger } from '@tevm/logger'
import { releases } from '@tevm/solc'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { extractCompatibleSolcVersions } from './extractCompatibleSolcVersions.js'

describe('extractCompatibleSolcVersions', () => {
	const mockLogger = {
		debug: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
	} as unknown as Logger

	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('string source input', () => {
		it('should extract versions from source with pragma', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'

			const result = extractCompatibleSolcVersions(source, mockLogger)

			expect(result.length).toBeGreaterThan(0)
			expect(result.every((v) => v.startsWith('0.8.'))).toBe(true)
			expect(mockLogger.warn).not.toHaveBeenCalled()
		})

		it('should warn when no pragma found in source', () => {
			const source = 'contract Test {}'

			const result = extractCompatibleSolcVersions(source, mockLogger)

			expect(result).toEqual(Object.keys(releases))
			expect(mockLogger.warn).toHaveBeenCalledWith(
				'Could not extract Solidity version from pragma statements in the source code',
			)
		})

		it('should warn when pragma exists but no compatible version found', () => {
			const source = 'pragma solidity 99.99.99; contract Test {}'

			const result = extractCompatibleSolcVersions(source, mockLogger)

			expect(result).toEqual([])
			expect(mockLogger.warn).toHaveBeenCalledWith(
				'Could not find a compatible version for the pragma specifiers in the source code',
			)
		})
	})

	describe('specifier array input', () => {
		it('should handle direct specifier array input', () => {
			const specifiers = ['^0.8.0']

			const result = extractCompatibleSolcVersions(specifiers, mockLogger)

			expect(result.length).toBeGreaterThan(0)
			expect(result.every((v) => v.startsWith('0.8.'))).toBe(true)
			expect(mockLogger.warn).not.toHaveBeenCalled()
		})

		it('should warn when empty specifier array provided', () => {
			const specifiers: string[] = []

			const result = extractCompatibleSolcVersions(specifiers, mockLogger)

			expect(result).toEqual(Object.keys(releases))
			expect(mockLogger.warn).toHaveBeenCalledWith(
				'Could not extract Solidity version from pragma statements in the source code',
			)
		})

		it('should warn when specifiers have no compatible versions', () => {
			const specifiers = ['99.99.99']

			const result = extractCompatibleSolcVersions(specifiers, mockLogger)

			expect(result).toEqual([])
			expect(mockLogger.warn).toHaveBeenCalledWith(
				'Could not find a compatible version for the pragma specifiers in the source code',
			)
		})
	})

	describe('return value', () => {
		it('should return array compatible with Releases keys type', () => {
			const source = 'pragma solidity ^0.8.20; contract Test {}'

			const result = extractCompatibleSolcVersions(source, mockLogger)

			expect(Array.isArray(result)).toBe(true)
			result.forEach((version) => {
				expect(typeof version).toBe('string')
				expect(version in releases).toBe(true)
			})
		})
	})

	describe('logger interaction', () => {
		it('should not call logger when successful', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'

			extractCompatibleSolcVersions(source, mockLogger)

			expect(mockLogger.debug).not.toHaveBeenCalled()
			expect(mockLogger.info).not.toHaveBeenCalled()
			expect(mockLogger.warn).not.toHaveBeenCalled()
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should warn for both missing specifiers and no compatible versions', () => {
			const source = 'contract Test {}'

			extractCompatibleSolcVersions(source, mockLogger)

			expect(mockLogger.warn).toHaveBeenCalledWith(
				'Could not extract Solidity version from pragma statements in the source code',
			)
		})
	})
})
