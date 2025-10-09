import type { Logger } from '@tevm/logger'
import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import type { CompileBaseOptions } from '../CompileBaseOptions.js'
import { AstParseError } from './errors.js'
import { validateBaseOptions } from './validateBaseOptions.js'

vi.mock('./validateSolcVersion.js', () => ({
	validateSolcVersion: vi.fn(),
}))

describe('validateBaseOptions', () => {
	const mockLogger = {
		debug: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
	} as unknown as Logger
	let mockValidateSolcVersion: ReturnType<typeof vi.fn>

	beforeEach(async () => {
		vi.clearAllMocks()
		const validateSolcVersionModule = await import('./validateSolcVersion.js')
		mockValidateSolcVersion = validateSolcVersionModule.validateSolcVersion as unknown as ReturnType<typeof vi.fn>

		// Default mock return value
		mockValidateSolcVersion.mockReturnValue('0.8.20')
	})

	describe('valid base options with defaults', () => {
		it('should validate with default language', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.language).toBe('Solidity')
			expect(mockLogger.debug).toHaveBeenCalledWith('No language provided, using default: Solidity')
		})

		it('should validate with default hardfork', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.hardfork).toBe('cancun')
			expect(mockLogger.debug).toHaveBeenCalledWith('No hardfork provided, using default: cancun')
		})

		it('should validate with default compilationOutput', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.compilationOutput).toEqual(['abi', 'ast', 'evm.bytecode', 'evm.deployedBytecode', 'storageLayout'])
			expect(mockLogger.debug).toHaveBeenCalledWith(
				expect.stringContaining('No compilation output selection, using default fields:'),
			)
		})

		it('should validate with default throwOnVersionMismatch', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.throwOnVersionMismatch).toBe(true)
		})

		it('should validate with default throwOnCompilationError', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.throwOnCompilationError).toBe(false)
		})

		it('should validate with default loggingLevel', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.loggingLevel).toBe('warn')
		})

		it('should call validateSolcVersion with correct arguments', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}

			validateBaseOptions(source, options, mockLogger)

			expect(mockValidateSolcVersion).toHaveBeenCalledWith(source, options, mockLogger)
		})

		it('should return solcVersion from validateSolcVersion', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}
			mockValidateSolcVersion.mockReturnValue('0.8.25')

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.solcVersion).toBe('0.8.25')
		})

		it('should log final validation debug message', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}
			mockValidateSolcVersion.mockReturnValue('0.8.20')

			validateBaseOptions(source, options, mockLogger)

			expect(mockLogger.debug).toHaveBeenCalledWith(
				'Validated source code with language: Solidity, hardfork: cancun, solc version: 0.8.20',
			)
		})
	})

	describe('valid base options with provided values', () => {
		it('should use provided language', () => {
			const source = 'object "Test" { code { } }'
			const options = { language: 'Yul' as const }

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.language).toBe('Yul')
			expect(mockLogger.debug).not.toHaveBeenCalledWith(expect.stringContaining('No language provided'))
		})

		it('should use provided hardfork', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = { hardfork: 'paris' as const }

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.hardfork).toBe('paris')
			expect(mockLogger.debug).not.toHaveBeenCalledWith(expect.stringContaining('No hardfork provided'))
		})

		it('should use provided compilationOutput', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = { compilationOutput: ['abi', 'ast'] } as const satisfies CompileBaseOptions

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.compilationOutput).toEqual(['abi', 'ast'])
			expect(mockLogger.debug).not.toHaveBeenCalledWith(expect.stringContaining('No compilation output'))
		})

		it('should use provided throwOnVersionMismatch', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = { throwOnVersionMismatch: false }

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.throwOnVersionMismatch).toBe(false)
		})

		it('should use provided throwOnCompilationError', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = { throwOnCompilationError: true }

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.throwOnCompilationError).toBe(true)
		})

		it('should use provided loggingLevel', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = { loggingLevel: 'debug' as const }

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.loggingLevel).toBe('debug')
		})

		it('should use provided solcVersion', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = { solcVersion: '0.8.19' as const }

			validateBaseOptions(source, options, mockLogger)

			expect(mockValidateSolcVersion).toHaveBeenCalledWith(source, options, mockLogger)
		})

		it('should preserve all provided options in result', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				hardfork: 'shanghai' as const,
				compilationOutput: ['abi', 'userdoc'] as const,
				throwOnVersionMismatch: false,
				throwOnCompilationError: true,
				loggingLevel: 'error' as const,
				optimizer: { enabled: true, runs: 200 },
				viaIR: true,
			} as const satisfies CompileBaseOptions

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.optimizer).toEqual({ enabled: true, runs: 200 })
			expect(result.viaIR).toBe(true)
		})
	})

	describe('language validation', () => {
		it('should validate Solidity language', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = { language: 'Solidity' as const }

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.language).toBe('Solidity')
		})

		it('should validate Yul language', () => {
			const source = 'object "Test" { code { } }'
			const options = { language: 'Yul' as const }

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.language).toBe('Yul')
		})

		it('should validate SolidityAST language with modern syntax', () => {
			const source = {
				nodeType: 'SourceUnit',
				nodes: [],
				src: '0:0:0',
			}
			const options = { language: 'SolidityAST' as const }

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.language).toBe('SolidityAST')
		})

		it('should validate SolidityAST language with legacy syntax', () => {
			const source = {
				name: 'SourceUnit',
				children: [],
				src: '0:0:0',
			}
			const options = { language: 'SolidityAST' as const }

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.language).toBe('SolidityAST')
		})
	})

	describe('AST source validation', () => {
		it('should throw AstParseError for invalid AST source without nodeType or name', () => {
			const source = { invalid: 'ast' }
			const options = { language: 'SolidityAST' as const }

			expect(() => validateBaseOptions(source, options, mockLogger)).toThrow(AstParseError)
		})

		it('should throw AstParseError with correct error code', () => {
			const source = { invalid: 'ast' }
			const options = { language: 'SolidityAST' as const }

			try {
				validateBaseOptions(source, options, mockLogger)
			} catch (error) {
				expect(error).toBeInstanceOf(AstParseError)
				expect((error as AstParseError).meta?.code).toBe('invalid_source_ast')
			}
		})

		it('should throw AstParseError with correct message', () => {
			const source = { invalid: 'ast' }
			const options = { language: 'SolidityAST' as const }

			expect(() => validateBaseOptions(source, options, mockLogger)).toThrow(
				'Invalid AST source, expected a SourceUnit',
			)
		})

		it('should log error before throwing AstParseError', () => {
			const source = { invalid: 'ast' }
			const options = { language: 'SolidityAST' as const }

			try {
				validateBaseOptions(source, options, mockLogger)
			} catch {
				expect(mockLogger.error).toHaveBeenCalledWith('Invalid AST source, expected a SourceUnit')
			}
		})

		it('should throw for AST with wrong nodeType', () => {
			const source = { nodeType: 'ContractDefinition' }
			const options = { language: 'SolidityAST' as const }

			expect(() => validateBaseOptions(source, options, mockLogger)).toThrow(AstParseError)
		})

		it('should throw for AST with wrong name (legacy)', () => {
			const source = { name: 'ContractDefinition' }
			const options = { language: 'SolidityAST' as const }

			expect(() => validateBaseOptions(source, options, mockLogger)).toThrow(AstParseError)
		})

		it('should not validate AST structure for Solidity language', () => {
			const source = { invalid: 'ast' }
			const options = { language: 'Solidity' as const }

			const result = validateBaseOptions(source as any, options, mockLogger)

			expect(result).toBeDefined()
		})

		it('should not validate AST structure for Yul language', () => {
			const source = { invalid: 'ast' }
			const options = { language: 'Yul' as const }

			const result = validateBaseOptions(source as any, options, mockLogger)

			expect(result).toBeDefined()
		})
	})

	describe('hardfork validation', () => {
		const validHardforks = [
			'homestead',
			'tangerineWhistle',
			'spuriousDragon',
			'byzantium',
			'constantinople',
			'petersburg',
			'istanbul',
			'berlin',
			'london',
			'paris',
			'shanghai',
			'cancun',
		] as const

		validHardforks.forEach((hardfork) => {
			it(`should accept ${hardfork} as valid hardfork`, () => {
				const source = 'pragma solidity ^0.8.0; contract Test {}'
				const options = { hardfork } as const satisfies CompileBaseOptions

				const result = validateBaseOptions(source, options, mockLogger)

				expect(result.hardfork).toBe(hardfork)
			})
		})
	})

	describe('compilation output validation', () => {
		it('should accept single output selection', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = { compilationOutput: ['abi'] } as const satisfies CompileBaseOptions

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.compilationOutput).toEqual(['abi'])
		})

		it('should accept multiple output selections', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = { compilationOutput: ['abi', 'ast', 'evm.bytecode'] } as const satisfies CompileBaseOptions

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.compilationOutput).toEqual(['abi', 'ast', 'evm.bytecode'])
		})

		it('should accept all output selections', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				compilationOutput: [
					'abi',
					'ast',
					'evm.bytecode',
					'evm.deployedBytecode',
					'storageLayout',
					'userdoc',
					'devdoc',
					'metadata',
				],
			} as const satisfies CompileBaseOptions

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.compilationOutput).toEqual([
				'abi',
				'ast',
				'evm.bytecode',
				'evm.deployedBytecode',
				'storageLayout',
				'userdoc',
				'devdoc',
				'metadata',
			])
		})

		it('should accept empty compilation output array', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = { compilationOutput: [] } as const satisfies CompileBaseOptions

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.compilationOutput).toEqual([])
		})
	})

	describe('type checking', () => {
		it('should return object with correct types', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}

			const result = validateBaseOptions(source, options, mockLogger)

			expectTypeOf(result.language).toBeString()
			expectTypeOf(result.hardfork).toBeString()
			expectTypeOf(result.compilationOutput).toBeArray()
			expectTypeOf(result.solcVersion).toBeString()
			expectTypeOf(result.throwOnVersionMismatch).toBeBoolean()
			expectTypeOf(result.throwOnCompilationError).toBeBoolean()
		})

		it('should have all required properties defined', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.language).toBeDefined()
			expect(result.hardfork).toBeDefined()
			expect(result.compilationOutput).toBeDefined()
			expect(result.solcVersion).toBeDefined()
			expect(result.throwOnVersionMismatch).toBeDefined()
			expect(result.throwOnCompilationError).toBeDefined()
			expect(result.loggingLevel).toBeDefined()
		})

		it('should have no undefined required values', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.language).not.toBeUndefined()
			expect(result.hardfork).not.toBeUndefined()
			expect(result.compilationOutput).not.toBeUndefined()
			expect(result.solcVersion).not.toBeUndefined()
			expect(result.throwOnVersionMismatch).not.toBeUndefined()
			expect(result.throwOnCompilationError).not.toBeUndefined()
		})

		it('should have no null required values', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.language).not.toBeNull()
			expect(result.hardfork).not.toBeNull()
			expect(result.compilationOutput).not.toBeNull()
			expect(result.solcVersion).not.toBeNull()
			expect(result.throwOnVersionMismatch).not.toBeNull()
			expect(result.throwOnCompilationError).not.toBeNull()
		})
	})

	describe('source types', () => {
		it('should accept single string source', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result).toBeDefined()
			expect(mockValidateSolcVersion).toHaveBeenCalledWith(source, options, mockLogger)
		})

		it('should accept array of string sources', () => {
			const source = ['pragma solidity ^0.8.0; contract Test {}', 'contract Test2 {}']
			const options = {}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result).toBeDefined()
			expect(mockValidateSolcVersion).toHaveBeenCalledWith(source, options, mockLogger)
		})

		it('should accept AST object source', () => {
			const source = {
				nodeType: 'SourceUnit',
				nodes: [],
				src: '0:0:0',
			}
			const options = { language: 'SolidityAST' as const }

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result).toBeDefined()
		})

		it('should accept empty string source', () => {
			const source = ''
			const options = {}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result).toBeDefined()
		})

		it('should accept empty array source', () => {
			const source: string[] = []
			const options = {}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result).toBeDefined()
		})
	})

	describe('logging behavior', () => {
		it('should log debug messages for all defaults used', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}

			validateBaseOptions(source, options, mockLogger)

			expect(mockLogger.debug).toHaveBeenCalledWith('No language provided, using default: Solidity')
			expect(mockLogger.debug).toHaveBeenCalledWith('No hardfork provided, using default: cancun')
			expect(mockLogger.debug).toHaveBeenCalledWith(expect.stringContaining('No compilation output selection'))
		})

		it('should not log debug messages for provided options', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				hardfork: 'paris' as const,
				compilationOutput: ['abi'] as const,
			} as const satisfies CompileBaseOptions

			;(mockLogger.debug as ReturnType<typeof vi.fn>).mockClear()
			validateBaseOptions(source, options, mockLogger)

			const debugCalls = (mockLogger.debug as ReturnType<typeof vi.fn>).mock.calls.map((call) => call[0])
			expect(debugCalls).not.toContain(expect.stringContaining('No language provided'))
			expect(debugCalls).not.toContain(expect.stringContaining('No hardfork provided'))
			expect(debugCalls).not.toContain(expect.stringContaining('No compilation output selection'))
		})

		it('should always log final validation message', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}
			mockValidateSolcVersion.mockReturnValue('0.8.20')

			validateBaseOptions(source, options, mockLogger)

			expect(mockLogger.debug).toHaveBeenCalledWith(
				'Validated source code with language: Solidity, hardfork: cancun, solc version: 0.8.20',
			)
		})

		it('should not call warn or error for valid options', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}

			validateBaseOptions(source, options, mockLogger)

			expect(mockLogger.warn).not.toHaveBeenCalled()
			expect(mockLogger.info).not.toHaveBeenCalled()
		})
	})

	describe('edge cases', () => {
		it('should handle undefined options parameter', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'

			const result = validateBaseOptions(source, undefined, mockLogger)

			expect(result).toBeDefined()
			expect(result.language).toBe('Solidity')
		})

		it('should handle options with explicitly undefined values', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				language: undefined,
				hardfork: undefined,
				compilationOutput: undefined,
			}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.language).toBe('Solidity')
			expect(result.hardfork).toBe('cancun')
			expect(result.compilationOutput).toEqual(['abi', 'ast', 'evm.bytecode', 'evm.deployedBytecode', 'storageLayout'])
		})

		it('should handle falsy boolean values correctly', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				throwOnVersionMismatch: false,
				throwOnCompilationError: false,
			}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.throwOnVersionMismatch).toBe(false)
			expect(result.throwOnCompilationError).toBe(false)
		})

		it('should handle truthy boolean values correctly', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				throwOnVersionMismatch: true,
				throwOnCompilationError: true,
			}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.throwOnVersionMismatch).toBe(true)
			expect(result.throwOnCompilationError).toBe(true)
		})

		it('should preserve optional properties when provided', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				optimizer: { enabled: true, runs: 200 },
				viaIR: true,
				metadata: { useLiteralContent: true },
			}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.optimizer).toEqual({ enabled: true, runs: 200 })
			expect(result.viaIR).toBe(true)
			expect(result.metadata).toEqual({ useLiteralContent: true })
		})

		it('should not modify optional properties when undefined', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.optimizer).toBeUndefined()
			expect(result.viaIR).toBeUndefined()
			expect(result.metadata).toBeUndefined()
		})
	})

	describe('validateSolcVersion integration', () => {
		it('should pass source to validateSolcVersion', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}

			validateBaseOptions(source, options, mockLogger)

			expect(mockValidateSolcVersion).toHaveBeenCalledWith(source, options, mockLogger)
		})

		it('should pass options to validateSolcVersion', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = { solcVersion: '0.8.19' as const }

			validateBaseOptions(source, options, mockLogger)

			expect(mockValidateSolcVersion).toHaveBeenCalledWith(source, options, mockLogger)
		})

		it('should pass logger to validateSolcVersion', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}

			validateBaseOptions(source, options, mockLogger)

			expect(mockValidateSolcVersion).toHaveBeenCalledWith(source, options, mockLogger)
		})

		it('should use solcVersion returned by validateSolcVersion', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}
			mockValidateSolcVersion.mockReturnValue('0.8.25')

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.solcVersion).toBe('0.8.25')
		})

		it('should propagate errors from validateSolcVersion', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}
			const error = new Error('Version validation failed')
			mockValidateSolcVersion.mockImplementation(() => {
				throw error
			})

			expect(() => validateBaseOptions(source, options, mockLogger)).toThrow('Version validation failed')
		})
	})

	describe('return value structure', () => {
		it('should return object with all required fields', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result).toHaveProperty('language')
			expect(result).toHaveProperty('hardfork')
			expect(result).toHaveProperty('compilationOutput')
			expect(result).toHaveProperty('solcVersion')
			expect(result).toHaveProperty('throwOnVersionMismatch')
			expect(result).toHaveProperty('throwOnCompilationError')
			expect(result).toHaveProperty('loggingLevel')
		})

		it('should spread all provided options into result', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				language: 'Solidity' as const,
				hardfork: 'paris' as const,
				optimizer: { enabled: true, runs: 200 },
				viaIR: true,
			}

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.optimizer).toEqual({ enabled: true, runs: 200 })
			expect(result.viaIR).toBe(true)
		})

		it('should override default values with provided values', () => {
			const source = 'pragma solidity ^0.8.0; contract Test {}'
			const options = {
				language: 'Yul' as const,
				hardfork: 'shanghai' as const,
				compilationOutput: ['abi', 'userdoc'] as const,
				throwOnVersionMismatch: false,
				throwOnCompilationError: true,
				loggingLevel: 'debug' as const,
			} as const satisfies CompileBaseOptions

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.language).toBe('Yul')
			expect(result.hardfork).toBe('shanghai')
			expect(result.compilationOutput).toEqual(['abi', 'userdoc'])
			expect(result.throwOnVersionMismatch).toBe(false)
			expect(result.throwOnCompilationError).toBe(true)
			expect(result.loggingLevel).toBe('debug')
		})
	})

	describe('AST validation with different structures', () => {
		it('should accept AST with modern nodeType syntax', () => {
			const source = {
				nodeType: 'SourceUnit',
				nodes: [{ nodeType: 'PragmaDirective' }],
				src: '0:0:0',
				absolutePath: 'Test.sol',
			}
			const options = { language: 'SolidityAST' as const }

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.language).toBe('SolidityAST')
		})

		it('should accept AST with legacy name syntax', () => {
			const source = {
				name: 'SourceUnit',
				children: [{ name: 'PragmaDirective' }],
				src: '0:0:0',
			}
			const options = { language: 'SolidityAST' as const }

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.language).toBe('SolidityAST')
		})

		it('should accept minimal valid modern AST', () => {
			const source = {
				nodeType: 'SourceUnit',
			}
			const options = { language: 'SolidityAST' as const }

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.language).toBe('SolidityAST')
		})

		it('should accept minimal valid legacy AST', () => {
			const source = {
				name: 'SourceUnit',
			}
			const options = { language: 'SolidityAST' as const }

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.language).toBe('SolidityAST')
		})

		it('should accept AST with correct name but wrong nodeType', () => {
			const source = {
				nodeType: 'ContractDefinition',
				name: 'SourceUnit',
			}
			const options = { language: 'SolidityAST' as const }

			const result = validateBaseOptions(source, options, mockLogger)

			expect(result.language).toBe('SolidityAST')
		})
	})
})
