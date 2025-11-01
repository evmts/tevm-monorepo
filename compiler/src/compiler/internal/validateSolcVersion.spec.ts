import type { Logger } from '@tevm/logger'
import { releases } from '@tevm/solc'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defaults } from './defaults.js'
import { VersionResolutionError } from './errors.js'
import { validateSolcVersion } from './validateSolcVersion.js'

vi.mock('./extractCompatibleSolcVersions.js', () => ({
	extractCompatibleSolcVersions: vi.fn(),
}))

describe('validateSolcVersion', () => {
	const mockLogger = {
		debug: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
	} as unknown as Logger
	let mockExtractCompatibleSolcVersions: ReturnType<typeof vi.fn>

	beforeEach(async () => {
		vi.clearAllMocks()
		const compatModule = await import('./extractCompatibleSolcVersions.js')
		mockExtractCompatibleSolcVersions = compatModule.extractCompatibleSolcVersions as unknown as ReturnType<
			typeof vi.fn
		>
	})

	describe('Yul language handling', () => {
		it('should return provided version for Yul without logging', () => {
			const source = 'object "Test" { code { } }'
			const options = {
				language: 'Yul' as const,
				solcVersion: '0.8.20' as keyof typeof releases,
			}

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe('0.8.20')
			expect(mockExtractCompatibleSolcVersions).not.toHaveBeenCalled()
			expect(mockLogger.debug).not.toHaveBeenCalled()
		})

		it('should return default version for Yul when no version provided', () => {
			const source = 'object "Test" { code { } }'
			const options = {
				language: 'Yul' as const,
			}

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe(defaults.solcVersion)
			expect(mockLogger.debug).toHaveBeenCalledWith(`No solc version provided, using default: ${defaults.solcVersion}`)
			expect(mockExtractCompatibleSolcVersions).not.toHaveBeenCalled()
		})

		it('should prioritize provided version over default for Yul', () => {
			const source = 'object "Test" { code { } }'
			const options = {
				language: 'Yul' as const,
				solcVersion: '0.8.15' as keyof typeof releases,
			}

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe('0.8.15')
			expect(result).not.toBe(defaults.solcVersion)
		})

		it('should handle Yul with undefined solcVersion', () => {
			const source = 'object "Test" { code { } }'
			const options = {
				language: 'Yul' as const,
				solcVersion: undefined,
			}

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe(defaults.solcVersion)
		})
	})

	describe('Solidity with compatible versions found', () => {
		it('should return provided version when it is older than latest compatible', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				solcVersion: '0.8.20' as keyof typeof releases,
			}
			const compatibleVersions = ['0.8.28', '0.8.27', '0.8.20', '0.8.15']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe('0.8.20')
			expect(mockExtractCompatibleSolcVersions).toHaveBeenCalledWith(source, mockLogger)
			expect(mockLogger.debug).toHaveBeenCalledWith(
				'Provided solc version 0.8.20 is not the latest compatible version: 0.8.28',
			)
		})

		it('should return latest compatible version when no version provided', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				language: 'Solidity' as const,
			}
			const compatibleVersions = ['0.8.28', '0.8.27', '0.8.26']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe('0.8.28')
			expect(mockLogger.debug).toHaveBeenCalledWith(
				'No solc version was provided, using the latest compatible version: 0.8.28',
			)
		})

		it('should return provided version when it equals latest compatible', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				solcVersion: '0.8.28' as keyof typeof releases,
			}
			const compatibleVersions = ['0.8.28', '0.8.27', '0.8.26']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe('0.8.28')
			expect(mockLogger.debug).toHaveBeenCalledWith('Provided solc version 0.8.28 is compatible with the source code')
		})

		it('should handle single compatible version', () => {
			const source = 'pragma solidity 0.8.20; contract Test {}'
			const options = {
				language: 'Solidity' as const,
			}
			const compatibleVersions = ['0.8.20']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe('0.8.20')
		})

		it('should handle multiple compatible versions and return first', () => {
			const source = 'pragma solidity >=0.8.0 <0.9.0; contract Test {}'
			const options = {
				language: 'Solidity' as const,
			}
			const compatibleVersions = ['0.8.28', '0.8.27', '0.8.26', '0.8.25', '0.8.24']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe('0.8.28')
		})
	})

	describe('Solidity with incompatible version and throwOnVersionMismatch=true', () => {
		it('should throw VersionResolutionError when provided version is incompatible', () => {
			const source = 'pragma solidity >=0.8.0 <0.8.20; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				solcVersion: '0.8.28' as keyof typeof releases,
				throwOnVersionMismatch: true,
			}
			const compatibleVersions = ['0.8.19', '0.8.18', '0.8.17']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			expect(() => validateSolcVersion(source, options, mockLogger)).toThrow(VersionResolutionError)
			expect(() => validateSolcVersion(source, options, mockLogger)).toThrow(
				'Provided solc version 0.8.28 is not compatible with the source code',
			)
		})

		it('should include error metadata when throwing on version mismatch', () => {
			const source = 'pragma solidity >=0.8.0 <0.8.20; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				solcVersion: '0.8.28' as keyof typeof releases,
				throwOnVersionMismatch: true,
			}
			const compatibleVersions = ['0.8.19', '0.8.18', '0.8.17']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			try {
				validateSolcVersion(source, options, mockLogger)
				expect.fail('Should have thrown')
			} catch (error) {
				expect(error).toBeInstanceOf(VersionResolutionError)
				const err = error as VersionResolutionError
				expect(err.meta).toEqual({
					code: 'version_mismatch',
					providedVersion: '0.8.28',
					compatibleVersions: ['0.8.19', '0.8.18', '0.8.17'],
				})
			}
		})

		it('should log error message with compatible versions when throwing', () => {
			const source = 'pragma solidity >=0.8.0 <0.8.20; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				solcVersion: '0.8.28' as keyof typeof releases,
				throwOnVersionMismatch: true,
			}
			const compatibleVersions = ['0.8.19', '0.8.18', '0.8.17']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			try {
				validateSolcVersion(source, options, mockLogger)
			} catch {
				expect(mockLogger.error).toHaveBeenCalledWith(
					'Provided solc version 0.8.28 is not compatible with the source code; compatible versions: 0.8.19, 0.8.18, 0.8.17',
				)
			}
		})
	})

	describe('Solidity with incompatible version and throwOnVersionMismatch=false', () => {
		it('should warn and return provided version when incompatible', () => {
			const source = 'pragma solidity >=0.8.0 <0.8.20; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				solcVersion: '0.8.28' as keyof typeof releases,
				throwOnVersionMismatch: false,
			}
			const compatibleVersions = ['0.8.19', '0.8.18', '0.8.17']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe('0.8.28')
			expect(mockLogger.warn).toHaveBeenCalledWith(
				'Provided solc version 0.8.28 is not compatible with the source code; compatible versions: 0.8.19, 0.8.18, 0.8.17',
			)
		})

		it('should not throw when incompatible and throwOnVersionMismatch is undefined', () => {
			const source = 'pragma solidity >=0.8.0 <0.8.20; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				solcVersion: '0.8.28' as keyof typeof releases,
			}
			const compatibleVersions = ['0.8.19', '0.8.18', '0.8.17']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe('0.8.28')
			expect(mockLogger.warn).toHaveBeenCalled()
		})
	})

	describe('Solidity with no compatible versions and throwOnVersionMismatch=true', () => {
		it('should throw VersionResolutionError when no compatible versions found', () => {
			const source = 'contract Test {}'
			const options = {
				language: 'Solidity' as const,
				throwOnVersionMismatch: true,
			}
			const compatibleVersions: string[] = []

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			expect(() => validateSolcVersion(source, options, mockLogger)).toThrow(VersionResolutionError)
			expect(() => validateSolcVersion(source, options, mockLogger)).toThrow(
				'No compatible solc versions found for the source code',
			)
		})

		it('should include error metadata with available versions when no compatible versions', () => {
			const source = 'contract Test {}'
			const options = {
				language: 'Solidity' as const,
				throwOnVersionMismatch: true,
			}
			const compatibleVersions: string[] = []

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			try {
				validateSolcVersion(source, options, mockLogger)
				expect.fail('Should have thrown')
			} catch (error) {
				expect(error).toBeInstanceOf(VersionResolutionError)
				const err = error as VersionResolutionError
				expect(err.meta).toEqual({
					code: 'no_compatible_version',
					availableVersions: Object.keys(releases),
				})
			}
		})

		it('should log error message when throwing on no compatible versions', () => {
			const source = 'contract Test {}'
			const options = {
				language: 'Solidity' as const,
				throwOnVersionMismatch: true,
			}
			const compatibleVersions: string[] = []

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			try {
				validateSolcVersion(source, options, mockLogger)
			} catch {
				expect(mockLogger.error).toHaveBeenCalledWith('No compatible solc versions found for the source code')
			}
		})
	})

	describe('Solidity with no compatible versions and throwOnVersionMismatch=false', () => {
		it('should return provided version when no compatible versions found', () => {
			const source = 'contract Test {}'
			const options = {
				language: 'Solidity' as const,
				solcVersion: '0.8.20' as keyof typeof releases,
				throwOnVersionMismatch: false,
			}
			const compatibleVersions: string[] = []

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe('0.8.20')
			expect(mockLogger.warn).toHaveBeenCalledWith(
				'Provided solc version 0.8.20 is not compatible with the source code',
			)
		})

		it('should return default version when no compatible versions and no provided version', () => {
			const source = 'contract Test {}'
			const options = {
				language: 'Solidity' as const,
				throwOnVersionMismatch: false,
			}
			const compatibleVersions: string[] = []

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe(defaults.solcVersion)
			expect(mockLogger.warn).toHaveBeenCalledWith(
				`No compatible solc versions found for the source code, using default: ${defaults.solcVersion}`,
			)
		})

		it('should handle undefined throwOnVersionMismatch as falsy', () => {
			const source = 'contract Test {}'
			const options = {
				language: 'Solidity' as const,
			}
			const compatibleVersions: string[] = []

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe(defaults.solcVersion)
			expect(mockLogger.warn).toHaveBeenCalled()
		})
	})

	describe('SolidityAST language handling with vPragmaDirectives', () => {
		it('should handle single AST input with vPragmaDirectives', () => {
			const astInput = {
				vPragmaDirectives: [{ literals: ['solidity', '^0.8.0'] }, { literals: ['solidity', '<0.9.0'] }],
			}
			const options = {
				language: 'SolidityAST' as const,
			}
			const compatibleVersions = ['0.8.28', '0.8.27', '0.8.26']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(astInput as any, options, mockLogger)

			expect(result).toBe('0.8.28')
			expect(mockExtractCompatibleSolcVersions).toHaveBeenCalledWith(['^0.8.0', '<0.9.0'], mockLogger)
		})

		it('should handle array of AST inputs with vPragmaDirectives', () => {
			const astInputs = [
				{
					vPragmaDirectives: [{ literals: ['solidity', '^0.8.0'] }],
				},
				{
					vPragmaDirectives: [{ literals: ['solidity', '<0.9.0'] }],
				},
			]
			const options = {
				language: 'SolidityAST' as const,
			}
			const compatibleVersions = ['0.8.28', '0.8.27']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(astInputs as any, options, mockLogger)

			expect(result).toBe('0.8.28')
			expect(mockExtractCompatibleSolcVersions).toHaveBeenCalledWith(['^0.8.0', '<0.9.0'], mockLogger)
		})

		it('should extract version from vPragmaDirectives by joining literals after first', () => {
			const astInput = {
				vPragmaDirectives: [{ literals: ['solidity', '>=', '0.8.0', '<', '0.9.0'] }],
			}
			const options = {
				language: 'SolidityAST' as const,
			}
			const compatibleVersions = ['0.8.28']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			validateSolcVersion(astInput as any, options, mockLogger)

			expect(mockExtractCompatibleSolcVersions).toHaveBeenCalledWith(['>=0.8.0<0.9.0'], mockLogger)
		})

		it('should handle empty vPragmaDirectives array', () => {
			const astInput = {
				vPragmaDirectives: [],
			}
			const options = {
				language: 'SolidityAST' as const,
			}
			const compatibleVersions: string[] = []

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(astInput as any, options, mockLogger)

			expect(result).toBe(defaults.solcVersion)
			expect(mockExtractCompatibleSolcVersions).toHaveBeenCalledWith([], mockLogger)
		})
	})

	describe('SolidityAST language handling with nodes', () => {
		it('should handle AST input with PragmaDirective nodes', () => {
			const astInput = {
				nodes: [
					{ nodeType: 'PragmaDirective', literals: ['solidity', '^0.8.0'] },
					{ nodeType: 'ContractDefinition', name: 'Test' },
				],
			}
			const options = {
				language: 'SolidityAST' as const,
			}
			const compatibleVersions = ['0.8.28', '0.8.27']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(astInput as any, options, mockLogger)

			expect(result).toBe('0.8.28')
			expect(mockExtractCompatibleSolcVersions).toHaveBeenCalledWith(['^0.8.0', ''], mockLogger)
		})

		it('should handle AST input with non-PragmaDirective nodes', () => {
			const astInput = {
				nodes: [
					{ nodeType: 'ContractDefinition', name: 'Test' },
					{ nodeType: 'FunctionDefinition', name: 'test' },
				],
			}
			const options = {
				language: 'SolidityAST' as const,
			}
			const compatibleVersions: string[] = []

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			validateSolcVersion(astInput as any, options, mockLogger)

			expect(mockExtractCompatibleSolcVersions).toHaveBeenCalledWith(['', ''], mockLogger)
		})

		it('should handle array of AST inputs with mixed node types', () => {
			const astInputs = [
				{
					nodes: [{ nodeType: 'PragmaDirective', literals: ['solidity', '^0.8.0'] }],
				},
				{
					nodes: [{ nodeType: 'ContractDefinition', name: 'Test' }],
				},
			]
			const options = {
				language: 'SolidityAST' as const,
			}
			const compatibleVersions = ['0.8.28']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(astInputs as any, options, mockLogger)

			expect(result).toBe('0.8.28')
			expect(mockExtractCompatibleSolcVersions).toHaveBeenCalledWith(['^0.8.0', ''], mockLogger)
		})

		it('should handle empty nodes array', () => {
			const astInput = {
				nodes: [],
			}
			const options = {
				language: 'SolidityAST' as const,
			}
			const compatibleVersions: string[] = []

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			validateSolcVersion(astInput as any, options, mockLogger)

			expect(mockExtractCompatibleSolcVersions).toHaveBeenCalledWith([], mockLogger)
		})
	})

	describe('SolidityAST with version resolution', () => {
		it('should respect provided version when compatible with AST', () => {
			const astInput = {
				vPragmaDirectives: [{ literals: ['solidity', '^0.8.0'] }],
			}
			const options = {
				language: 'SolidityAST' as const,
				solcVersion: '0.8.20' as keyof typeof releases,
			}
			const compatibleVersions = ['0.8.28', '0.8.27', '0.8.20']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(astInput as any, options, mockLogger)

			expect(result).toBe('0.8.20')
		})

		it('should throw when provided version incompatible with AST and throwOnVersionMismatch=true', () => {
			const astInput = {
				vPragmaDirectives: [{ literals: ['solidity', '>=0.8.0'] }, { literals: ['solidity', '<0.8.20'] }],
			}
			const options = {
				language: 'SolidityAST' as const,
				solcVersion: '0.8.28' as keyof typeof releases,
				throwOnVersionMismatch: true,
			}
			const compatibleVersions = ['0.8.19', '0.8.18', '0.8.17']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			expect(() => validateSolcVersion(astInput as any, options, mockLogger)).toThrow(VersionResolutionError)
		})
	})

	describe('Solidity with string array input', () => {
		it('should handle array of Solidity source strings', () => {
			const sources = ['pragma solidity ^0.8.0; contract Test1 {}', 'pragma solidity ^0.8.0; contract Test2 {}']
			const options = {
				language: 'Solidity' as const,
			}
			const compatibleVersions = ['0.8.28', '0.8.27']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(sources, options, mockLogger)

			expect(result).toBe('0.8.28')
			expect(mockExtractCompatibleSolcVersions).toHaveBeenCalledWith(sources.join('\n'), mockLogger)
		})

		it('should concatenate multiple sources for pragma extraction', () => {
			const sources = ['pragma solidity >=0.8.0;', 'pragma solidity <0.9.0;', 'contract Test {}']
			const options = {
				language: 'Solidity' as const,
			}
			const compatibleVersions = ['0.8.28']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			validateSolcVersion(sources, options, mockLogger)

			expect(mockExtractCompatibleSolcVersions).toHaveBeenCalledWith(sources.join('\n'), mockLogger)
		})

		it('should handle empty source array', () => {
			const sources: string[] = []
			const options = {
				language: 'Solidity' as const,
			}
			const compatibleVersions: string[] = []

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(sources, options, mockLogger)

			expect(result).toBe(defaults.solcVersion)
		})
	})

	describe('version ordering and comparison', () => {
		it('should correctly identify when provided version is older than latest compatible', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				solcVersion: '0.8.20' as keyof typeof releases,
			}
			const compatibleVersions = ['0.8.28', '0.8.27', '0.8.20', '0.8.15']
			const versions = Object.keys(releases)

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe('0.8.20')
			expect(versions.indexOf('0.8.20')).toBeGreaterThan(versions.indexOf('0.8.28'))
		})

		it('should use provided version when it is same as latest compatible', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				solcVersion: '0.8.28' as keyof typeof releases,
			}
			const compatibleVersions = ['0.8.28', '0.8.27', '0.8.26']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe('0.8.28')
		})
	})

	describe('default version handling', () => {
		it('should use default version when no version provided and no compatible versions', () => {
			const source = 'contract Test {}'
			const options = {
				language: 'Solidity' as const,
				throwOnVersionMismatch: false,
			}
			const compatibleVersions: string[] = []

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe(defaults.solcVersion)
		})

		it('should use latest compatible version when no version provided', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				language: 'Solidity' as const,
			}
			const compatibleVersions = ['0.8.28', '0.8.27', '0.8.26']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe('0.8.28')
			expect(result).not.toBe(defaults.solcVersion)
		})

		it('should handle when default version is in compatible versions list', () => {
			const source = 'pragma solidity >=0.4.0; contract Test {}'
			const options = {
				language: 'Solidity' as const,
			}
			const allVersions = Object.keys(releases)
			const compatibleVersions = allVersions

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(compatibleVersions).toContain(result)
		})
	})

	describe('logger interaction', () => {
		it('should log debug when version is same as latest compatible', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				solcVersion: '0.8.28' as keyof typeof releases,
			}
			const compatibleVersions = ['0.8.28', '0.8.27', '0.8.20']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			validateSolcVersion(source, options, mockLogger)

			expect(mockLogger.debug).toHaveBeenCalledWith('Provided solc version 0.8.28 is compatible with the source code')
			expect(mockLogger.warn).not.toHaveBeenCalled()
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should log warn when version is incompatible and not throwing', () => {
			const source = 'pragma solidity >=0.8.0 <0.8.20; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				solcVersion: '0.8.28' as keyof typeof releases,
				throwOnVersionMismatch: false,
			}
			const compatibleVersions = ['0.8.19', '0.8.18']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			validateSolcVersion(source, options, mockLogger)

			expect(mockLogger.warn).toHaveBeenCalled()
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should log error when version is incompatible and throwing', () => {
			const source = 'pragma solidity ^0.8.20; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				solcVersion: '0.7.6' as keyof typeof releases,
				throwOnVersionMismatch: true,
			}
			const compatibleVersions = ['0.8.28', '0.8.20']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			try {
				validateSolcVersion(source, options, mockLogger)
			} catch {
				expect(mockLogger.error).toHaveBeenCalled()
			}
		})

		it('should log debug when using default version for Yul', () => {
			const source = 'object "Test" { code { } }'
			const options = {
				language: 'Yul' as const,
			}

			validateSolcVersion(source, options, mockLogger)

			expect(mockLogger.debug).toHaveBeenCalledWith(`No solc version provided, using default: ${defaults.solcVersion}`)
		})

		it('should log debug when no version provided and using latest compatible', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				language: 'Solidity' as const,
			}
			const compatibleVersions = ['0.8.28', '0.8.27']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			validateSolcVersion(source, options, mockLogger)

			expect(mockLogger.debug).toHaveBeenCalledWith(
				'No solc version was provided, using the latest compatible version: 0.8.28',
			)
		})

		it('should log debug when provided version is older than latest compatible', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				solcVersion: '0.8.20' as keyof typeof releases,
			}
			const compatibleVersions = ['0.8.28', '0.8.27', '0.8.20', '0.8.15']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			validateSolcVersion(source, options, mockLogger)

			expect(mockLogger.debug).toHaveBeenCalledWith(
				'Provided solc version 0.8.20 is not the latest compatible version: 0.8.28',
			)
		})

		it('should not call logger when Yul with provided version', () => {
			const source = 'object "Test" { code { } }'
			const options = {
				language: 'Yul' as const,
				solcVersion: '0.8.20' as keyof typeof releases,
			}

			validateSolcVersion(source, options, mockLogger)

			expect(mockLogger.debug).not.toHaveBeenCalled()
			expect(mockLogger.info).not.toHaveBeenCalled()
			expect(mockLogger.warn).not.toHaveBeenCalled()
			expect(mockLogger.error).not.toHaveBeenCalled()
		})
	})

	describe('edge cases', () => {
		it('should handle empty source string', () => {
			const source = ''
			const options = {
				language: 'Solidity' as const,
			}
			const compatibleVersions: string[] = []

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe(defaults.solcVersion)
		})

		it('should handle source with only whitespace', () => {
			const source = '   \n\t  '
			const options = {
				language: 'Solidity' as const,
			}
			const compatibleVersions: string[] = []

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe(defaults.solcVersion)
		})

		it('should handle source with comments but no pragma', () => {
			const source = '// This is a comment\n/* Another comment */\ncontract Test {}'
			const options = {
				language: 'Solidity' as const,
			}
			const compatibleVersions: string[] = []

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe(defaults.solcVersion)
		})

		it('should handle very large compatible versions array', () => {
			const source = 'pragma solidity >=0.5.0; contract Test {}'
			const options = {
				language: 'Solidity' as const,
			}
			const allVersions = Object.keys(releases)
			const compatibleVersions = allVersions.slice(0, 100)

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe(compatibleVersions[0])
		})

		it('should handle options with only language specified', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				language: 'Solidity' as const,
			}
			const compatibleVersions = ['0.8.28']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe('0.8.28')
		})

		it('should handle options with explicit undefined values', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				solcVersion: undefined,
				throwOnVersionMismatch: undefined,
			}
			const compatibleVersions = ['0.8.28']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe('0.8.28')
		})
	})

	describe('return value validation', () => {
		it('should always return a valid Releases key type', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				language: 'Solidity' as const,
			}
			const compatibleVersions = ['0.8.28', '0.8.27']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(typeof result).toBe('string')
			expect(result).toMatch(/^\d+\.\d+\.\d+/)
		})

		it('should return version that exists in releases object', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				solcVersion: '0.8.20' as keyof typeof releases,
			}
			const compatibleVersions = ['0.8.28', '0.8.27', '0.8.20']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(Object.keys(releases)).toContain(result)
		})

		it('should never return undefined or null', () => {
			const source = 'contract Test {}'
			const options = {
				language: 'Solidity' as const,
				throwOnVersionMismatch: false,
			}
			const compatibleVersions: string[] = []

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).not.toBeUndefined()
			expect(result).not.toBeNull()
			expect(result).toBeDefined()
		})
	})

	describe('complex scenarios', () => {
		it('should handle multiple AST inputs with different pragma formats', () => {
			const astInputs = [
				{
					vPragmaDirectives: [{ literals: ['solidity', '^0.8.0'] }],
				},
				{
					nodes: [{ nodeType: 'PragmaDirective', literals: ['solidity', '<0.9.0'] }],
				},
			]
			const options = {
				language: 'SolidityAST' as const,
			}
			const compatibleVersions = ['0.8.28', '0.8.27']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(astInputs as any, options, mockLogger)

			expect(result).toBe('0.8.28')
			expect(mockExtractCompatibleSolcVersions).toHaveBeenCalledWith(['^0.8.0', '<0.9.0'], mockLogger)
		})

		it('should handle Solidity sources with mixed pragma styles', () => {
			const sources = [
				'pragma solidity >=0.8.0;',
				'pragma solidity <0.9.0;',
				'pragma solidity ^0.8.20;',
				'contract Test {}',
			]
			const options = {
				language: 'Solidity' as const,
			}
			const compatibleVersions = [
				'0.8.28',
				'0.8.27',
				'0.8.26',
				'0.8.25',
				'0.8.24',
				'0.8.23',
				'0.8.22',
				'0.8.21',
				'0.8.20',
			]

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(sources, options, mockLogger)

			expect(result).toBe('0.8.28')
		})

		it('should handle provided version newer than compatible and should throw with mismatch', () => {
			const source = 'pragma solidity >=0.8.0 <0.8.20; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				solcVersion: '0.8.28' as keyof typeof releases,
				throwOnVersionMismatch: true,
			}
			const compatibleVersions = ['0.8.19', '0.8.18', '0.8.17', '0.8.16', '0.8.15']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			expect(() => validateSolcVersion(source, options, mockLogger)).toThrow(VersionResolutionError)
		})

		it('should handle scenario where provided version equals latest compatible', () => {
			const source = 'pragma solidity ^0.8.28; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				solcVersion: '0.8.28' as keyof typeof releases,
			}
			const compatibleVersions = ['0.8.28']

			mockExtractCompatibleSolcVersions.mockReturnValue(compatibleVersions)

			const result = validateSolcVersion(source, options, mockLogger)

			expect(result).toBe('0.8.28')
			expect(mockLogger.debug).toHaveBeenCalledWith('Provided solc version 0.8.28 is compatible with the source code')
		})
	})
})
