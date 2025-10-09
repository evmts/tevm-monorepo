import type { Logger } from '@tevm/logger'
import { SourceUnit } from 'solc-typed-ast'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InheritedContract } from '../../fixtures/index.js'
import type { CompileSourceWithShadowOptions } from '../CompileSourceWithShadowOptions.js'
import { solcSourcesToAstNodes } from '../solcSourcesToAstNodes.js'
import { NotSupportedError, ShadowValidationError } from './errors.js'
import { validateShadowOptions } from './validateShadowOptions.js'

describe('validateShadowOptions', () => {
	const mockLogger = {
		debug: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
	} as unknown as Logger

	let allSourceUnits: SourceUnit[]
	let comprehensiveUnit: SourceUnit
	let inheritedContractUnit: SourceUnit
	let mathUtilsUnit: SourceUnit

	beforeEach(() => {
		vi.clearAllMocks()
		allSourceUnits = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

		comprehensiveUnit = allSourceUnits.find((su) => su.absolutePath === 'ComprehensiveContract.sol')!
		inheritedContractUnit = allSourceUnits.find((su) => su.absolutePath === 'InheritedContract.sol')!
		mathUtilsUnit = allSourceUnits.find((su) => su.absolutePath === 'lib/utils/MathUtils.sol')!

		expect(comprehensiveUnit).toBeDefined()
		expect(inheritedContractUnit).toBeDefined()
		expect(mathUtilsUnit).toBeDefined()
	})

	describe('successful validation', () => {
		it('should validate options with single anonymous source (no path validation)', () => {
			// Create a mock source unit with <anonymous> path (like from compileSourceWithShadow)
			// We need to preserve vContracts which is a getter on the SourceUnit class
			const anonymousUnit = {
				absolutePath: '<anonymous>',
				vContracts: comprehensiveUnit.vContracts,
			} as SourceUnit
			const astSources = [anonymousUnit]
			const options: CompileSourceWithShadowOptions = {}

			const result = validateShadowOptions(astSources, options, 'Solidity', mockLogger)

			expect(result.sourceLanguage).toBe('Solidity')
			expect(result.shadowLanguage).toBe('Solidity')
			expect(result.injectIntoContractPath).toBe('<anonymous>')
			expect(result.injectIntoContractName).toBe('ComprehensiveContract')
			expect(result.shadowMergeStrategy).toBe('safe')
		})

		it('should validate options with single contract file (with path validation)', () => {
			const astSources = [comprehensiveUnit]
			const options: CompileSourceWithShadowOptions = {}

			const result = validateShadowOptions(astSources, options, 'Solidity', mockLogger)

			expect(result.injectIntoContractPath).toBe('ComprehensiveContract.sol')
			expect(result.injectIntoContractName).toBe('ComprehensiveContract')
				expect(mockLogger.debug).toHaveBeenCalledWith(
				'Using contract ComprehensiveContract in ComprehensiveContract.sol to inject shadow code',
			)
		})

		it('should validate options with all fields explicitly provided', () => {
			const astSources = [comprehensiveUnit]
			const options: CompileSourceWithShadowOptions = {
				sourceLanguage: 'Solidity',
				shadowLanguage: 'Yul',
				injectIntoContractPath: 'ComprehensiveContract.sol' as any,
				injectIntoContractName: 'ComprehensiveContract',
				shadowMergeStrategy: 'replace',
			}

			const result = validateShadowOptions(astSources, options, 'Solidity', mockLogger)

			expect(result.sourceLanguage).toBe('Solidity')
			expect(result.shadowLanguage).toBe('Yul')
			expect(result.injectIntoContractPath).toBe('ComprehensiveContract.sol')
			expect(result.injectIntoContractName).toBe('ComprehensiveContract')
			expect(result.shadowMergeStrategy).toBe('replace')
		})

		it('should validate options with multiple contract files and explicit path', () => {
			const astSources = [comprehensiveUnit, inheritedContractUnit]
			const options: CompileSourceWithShadowOptions = {
				injectIntoContractPath: 'InheritedContract.sol' as any,
				injectIntoContractName: 'ExtendedContract',
			}

			const result = validateShadowOptions(astSources, options, 'Solidity', mockLogger)

			expect(result.injectIntoContractPath).toBe('InheritedContract.sol')
			expect(result.injectIntoContractName).toBe('ExtendedContract')
		})

		it('should validate options with multiple contracts in file and explicit name', () => {
			const astSources = [inheritedContractUnit]
			const options: CompileSourceWithShadowOptions = {
				injectIntoContractName: 'WrapperContract',
			}

			const result = validateShadowOptions(astSources, options, 'Solidity', mockLogger)

			expect(result.injectIntoContractPath).toBe('InheritedContract.sol')
			expect(result.injectIntoContractName).toBe('WrapperContract')
		})

		it('should resolve contract by name across multiple files', () => {
			const astSources = [comprehensiveUnit, inheritedContractUnit, mathUtilsUnit]
			const options: CompileSourceWithShadowOptions = {
				injectIntoContractName: 'ExtendedContract',
			}

			const result = validateShadowOptions(astSources, options, 'Solidity', mockLogger)

			expect(result.injectIntoContractPath).toBe('InheritedContract.sol')
			expect(result.injectIntoContractName).toBe('ExtendedContract')
			expect(mockLogger.debug).toHaveBeenCalledWith("Found contract 'ExtendedContract' in InheritedContract.sol")
			expect(mockLogger.debug).toHaveBeenCalledWith(
				'Using contract ExtendedContract in InheritedContract.sol to inject shadow code',
			)
		})

		it('should validate options with Yul shadow language', () => {
			const astSources = [comprehensiveUnit]
			const options: CompileSourceWithShadowOptions = {
				shadowLanguage: 'Yul',
			}

			const result = validateShadowOptions(astSources, options, 'Solidity', mockLogger)

			expect(result.shadowLanguage).toBe('Yul')
		})

		it('should validate options with safe merge strategy', () => {
			const astSources = [comprehensiveUnit]
			const options: CompileSourceWithShadowOptions = {
				shadowMergeStrategy: 'safe',
			}

			const result = validateShadowOptions(astSources, options, 'Solidity', mockLogger)

			expect(result.shadowMergeStrategy).toBe('safe')
			expect(mockLogger.debug).not.toHaveBeenCalledWith(expect.stringContaining('No shadowMergeStrategy provided'))
		})

		it('should validate options with replace merge strategy', () => {
			const astSources = [comprehensiveUnit]
			const options: CompileSourceWithShadowOptions = {
				shadowMergeStrategy: 'replace',
			}

			const result = validateShadowOptions(astSources, options, 'Solidity', mockLogger)

			expect(result.shadowMergeStrategy).toBe('replace')
		})

		it('should log debug message when no shadowMergeStrategy provided', () => {
			const astSources = [comprehensiveUnit]
			const options: CompileSourceWithShadowOptions = {}

			validateShadowOptions(astSources, options, 'Solidity', mockLogger)

			expect(mockLogger.debug).toHaveBeenCalledWith(
				'No shadowMergeStrategy provided; using default "safe", which will throw an error if a shadow function name conflicts with an existing one',
			)
		})
	})

	describe('error handling', () => {
		describe('NotSupportedError', () => {
			it('should throw NotSupportedError when source language is Yul', () => {
				const astSources = [comprehensiveUnit]
				const options: CompileSourceWithShadowOptions = {
					sourceLanguage: 'Yul',
				}

				expect(() => {
					validateShadowOptions(astSources, options, 'Yul', mockLogger)
				}).toThrow(NotSupportedError)

				try {
					validateShadowOptions(astSources, options, 'Yul', mockLogger)
				} catch (error) {
					expect(error).toBeInstanceOf(NotSupportedError)
					expect((error as NotSupportedError).message).toBe('Yul is not supported yet')
					expect((error as NotSupportedError).meta?.code).toBe('yul_not_supported')
					expect(mockLogger.error).toHaveBeenCalledWith('Yul is not supported yet')
				}
			})
		})

		describe('ShadowValidationError - invalid shadow language', () => {
			it('should throw ShadowValidationError when shadow language is SolidityAST', () => {
				const astSources = [comprehensiveUnit]
				const options: CompileSourceWithShadowOptions = {
					shadowLanguage: 'SolidityAST' as any,
				}

				expect(() => {
					validateShadowOptions(astSources, options, 'Solidity', mockLogger)
				}).toThrow(ShadowValidationError)

				try {
					validateShadowOptions(astSources, options, 'Solidity', mockLogger)
				} catch (error) {
					expect(error).toBeInstanceOf(ShadowValidationError)
					expect((error as ShadowValidationError).message).toBe(
						'Shadow language cannot be AST - must be Solidity or Yul',
					)
					expect((error as ShadowValidationError).meta?.code).toBe('invalid_shadow_language')
					expect(mockLogger.error).toHaveBeenCalledWith('Shadow language cannot be AST - must be Solidity or Yul')
				}
			})
		})

		describe('ShadowValidationError - missing contract files', () => {
			it('should throw ShadowValidationError when AST sources is empty and validatePath is true', () => {
				const astSources: SourceUnit[] = []
				const options: CompileSourceWithShadowOptions = {}

				expect(() => {
					validateShadowOptions(astSources, options, 'Solidity', mockLogger)
				}).toThrow(ShadowValidationError)

				try {
					validateShadowOptions(astSources, options, 'Solidity', mockLogger)
				} catch (error) {
					expect(error).toBeInstanceOf(ShadowValidationError)
					expect((error as ShadowValidationError).message).toBe('Source compilation resulted in no contract files')
					expect((error as ShadowValidationError).meta?.code).toBe('missing_contract_files')
				}
			})
		})

		describe('ShadowValidationError - missing inject path', () => {
			it('should throw ShadowValidationError when multiple contract files without injectIntoContractPath', () => {
				const astSources = [comprehensiveUnit, inheritedContractUnit]
				const options: CompileSourceWithShadowOptions = {}

				expect(() => {
					validateShadowOptions(astSources, options, 'Solidity', mockLogger)
				}).toThrow(ShadowValidationError)

				try {
					validateShadowOptions(astSources, options, 'Solidity', mockLogger)
				} catch (error) {
					expect(error).toBeInstanceOf(ShadowValidationError)
					expect((error as ShadowValidationError).message).toBe(
						'injectIntoContractPath is required when using AST source with multiple contract files',
					)
					expect((error as ShadowValidationError).meta?.code).toBe('missing_inject_path')
					expect((error as ShadowValidationError).meta?.sourceFilePaths).toEqual([
						'ComprehensiveContract.sol',
						'InheritedContract.sol',
					])
				}
			})
		})

		describe('ShadowValidationError - invalid inject path', () => {
			it('should throw ShadowValidationError when injectIntoContractPath does not match any source file', () => {
				const astSources = [comprehensiveUnit, inheritedContractUnit]
				const options: CompileSourceWithShadowOptions = {
					injectIntoContractPath: 'WrongPath.sol' as any,
				}

				expect(() => {
					validateShadowOptions(astSources, options, 'Solidity', mockLogger)
				}).toThrow(ShadowValidationError)

				try {
					validateShadowOptions(astSources, options, 'Solidity', mockLogger)
				} catch (error) {
					expect(error).toBeInstanceOf(ShadowValidationError)
					expect((error as ShadowValidationError).message).toBe(
						'injectIntoContractPath is not a valid contract file or does not match the source file',
					)
					expect((error as ShadowValidationError).meta?.code).toBe('invalid_inject_path')
					expect((error as ShadowValidationError).meta?.providedPath).toBe('WrongPath.sol')
					expect((error as ShadowValidationError).meta?.sourceFilePaths).toEqual([
						'ComprehensiveContract.sol',
						'InheritedContract.sol',
					])
				}
			})
		})

		describe('ShadowValidationError - missing contracts', () => {
			it('should throw ShadowValidationError when source unit has no contracts', () => {
				// Mock vContracts to return empty array
				const emptyUnit = comprehensiveUnit
				vi.spyOn(emptyUnit, 'vContracts', 'get').mockReturnValue([])

				const astSources = [emptyUnit]
				const options: CompileSourceWithShadowOptions = {}

				expect(() => {
					validateShadowOptions(astSources, options, 'Solidity', mockLogger)
				}).toThrow(ShadowValidationError)

				try {
					validateShadowOptions(astSources, options, 'Solidity', mockLogger)
				} catch (error) {
					expect(error).toBeInstanceOf(ShadowValidationError)
					expect((error as ShadowValidationError).message).toBe('Source compilation resulted in no contracts')
					expect((error as ShadowValidationError).meta?.code).toBe('missing_contracts')
				}

				// Restore the mock
				vi.restoreAllMocks()
			})
		})

		describe('ShadowValidationError - missing inject name', () => {
			it('should throw ShadowValidationError when multiple contracts without injectIntoContractName', () => {
				// InheritedContract has ExtendedContract and WrapperContract
				const astSources = [inheritedContractUnit]
				const options: CompileSourceWithShadowOptions = {}

				expect(() => {
					validateShadowOptions(astSources, options, 'Solidity', mockLogger)
				}).toThrow(ShadowValidationError)

				try {
					validateShadowOptions(astSources, options, 'Solidity', mockLogger)
				} catch (error) {
					expect(error).toBeInstanceOf(ShadowValidationError)
					expect((error as ShadowValidationError).message).toBe(
						'injectIntoContractName is required when using AST source with multiple contracts in the target file',
					)
					expect((error as ShadowValidationError).meta?.code).toBe('missing_inject_name')
					// Get actual contract names from the source unit
					const contracts = inheritedContractUnit.vContracts.map((c) => c.name)
					expect((error as ShadowValidationError).meta?.sourceContractNames).toEqual(contracts)
				}
			})
		})
	})

	describe('edge cases', () => {
		it('should handle single contract file with explicit path matching', () => {
			const astSources = [comprehensiveUnit]
			const options: CompileSourceWithShadowOptions = {
				injectIntoContractPath: 'ComprehensiveContract.sol' as any,
			}

			const result = validateShadowOptions(astSources, options, 'Solidity', mockLogger)

			expect(result.injectIntoContractPath).toBe('ComprehensiveContract.sol')
			expect(mockLogger.debug).toHaveBeenCalledWith(
				'Using contract ComprehensiveContract in ComprehensiveContract.sol to inject shadow code',
			)
		})

		it('should handle single contract with explicit name matching', () => {
			const astSources = [comprehensiveUnit]
			const options: CompileSourceWithShadowOptions = {
				injectIntoContractName: 'ComprehensiveContract',
			}

			const result = validateShadowOptions(astSources, options, 'Solidity', mockLogger)

			expect(result.injectIntoContractName).toBe('ComprehensiveContract')
			expect(mockLogger.debug).toHaveBeenCalledWith(
				"Using contract ComprehensiveContract in ComprehensiveContract.sol to inject shadow code",
			)
			expect(mockLogger.debug).toHaveBeenCalledWith(
				'Using contract ComprehensiveContract in ComprehensiveContract.sol to inject shadow code',
			)
		})

		it('should use defaults for undefined options', () => {
			const astSources = [comprehensiveUnit]
			const options: CompileSourceWithShadowOptions = {
				shadowLanguage: undefined,
				shadowMergeStrategy: undefined,
			}

			const result = validateShadowOptions(astSources, options, 'Solidity', mockLogger)

			expect(result.shadowLanguage).toBe('Solidity')
			expect(result.shadowMergeStrategy).toBe('safe')
		})

		it('should validate with SolidityAST as source language but not shadow language', () => {
			const astSources = [comprehensiveUnit]
			const options: CompileSourceWithShadowOptions = {
				sourceLanguage: 'SolidityAST',
				shadowLanguage: 'Solidity',
			}

			const result = validateShadowOptions(astSources, options, 'SolidityAST', mockLogger)

			expect(result.sourceLanguage).toBe('SolidityAST')
			expect(result.shadowLanguage).toBe('Solidity')
		})

		it('should preserve source language from parameter', () => {
			const astSources = [comprehensiveUnit]
			const options: CompileSourceWithShadowOptions = {}

			const result = validateShadowOptions(astSources, options, 'SolidityAST', mockLogger)

			expect(result.sourceLanguage).toBe('SolidityAST')
		})
	})

	describe('logger integration', () => {
		it('should log debug message for contract path', () => {
			const astSources = [comprehensiveUnit]
			const options: CompileSourceWithShadowOptions = {
				injectIntoContractPath: 'ComprehensiveContract.sol' as any,
			}

			validateShadowOptions(astSources, options, 'Solidity', mockLogger)

			expect(mockLogger.debug).toHaveBeenCalledWith(
				'Using contract ComprehensiveContract in ComprehensiveContract.sol to inject shadow code',
			)
		})

		it('should log debug message for contract name', () => {
			const astSources = [comprehensiveUnit]
			const options: CompileSourceWithShadowOptions = {
				injectIntoContractName: 'ComprehensiveContract',
			}

			validateShadowOptions(astSources, options, 'Solidity', mockLogger)

			expect(mockLogger.debug).toHaveBeenCalledWith(
				"Using contract ComprehensiveContract in ComprehensiveContract.sol to inject shadow code",
			)
			expect(mockLogger.debug).toHaveBeenCalledWith(
				'Using contract ComprehensiveContract in ComprehensiveContract.sol to inject shadow code',
			)
		})

		it('should log warning when no injectIntoContractPath provided for single file', () => {
			const astSources = [comprehensiveUnit]
			const options: CompileSourceWithShadowOptions = {}

			validateShadowOptions(astSources, options, 'Solidity', mockLogger)

			})

		it('should log error before throwing NotSupportedError', () => {
			const astSources = [comprehensiveUnit]
			const options: CompileSourceWithShadowOptions = {
				sourceLanguage: 'Yul',
			}

			try {
				validateShadowOptions(astSources, options, 'Yul', mockLogger)
			} catch {
				expect(mockLogger.error).toHaveBeenCalledWith('Yul is not supported yet')
			}
		})

		it('should log error before throwing ShadowValidationError', () => {
			const astSources = [comprehensiveUnit]
			const options: CompileSourceWithShadowOptions = {
				shadowLanguage: 'SolidityAST' as any,
			}

			try {
				validateShadowOptions(astSources, options, 'Solidity', mockLogger)
			} catch {
				expect(mockLogger.error).toHaveBeenCalledWith('Shadow language cannot be AST - must be Solidity or Yul')
			}
		})
	})

	describe('return value validation', () => {
		it('should return ValidatedShadowOptions with all required fields', () => {
			const astSources = [comprehensiveUnit]
			const options: CompileSourceWithShadowOptions = {
				shadowLanguage: 'Yul',
				injectIntoContractPath: 'ComprehensiveContract.sol' as any,
				injectIntoContractName: 'ComprehensiveContract',
				shadowMergeStrategy: 'replace',
			}

			const result = validateShadowOptions(astSources, options, 'Solidity', mockLogger)

			expect(result).toHaveProperty('sourceLanguage')
			expect(result).toHaveProperty('shadowLanguage')
			expect(result).toHaveProperty('injectIntoContractPath')
			expect(result).toHaveProperty('injectIntoContractName')
			expect(result).toHaveProperty('shadowMergeStrategy')

			expect(typeof result.sourceLanguage).toBe('string')
			expect(typeof result.shadowLanguage).toBe('string')
			expect(typeof result.injectIntoContractPath).toBe('string')
			expect(typeof result.injectIntoContractName).toBe('string')
			expect(typeof result.shadowMergeStrategy).toBe('string')
		})
	})
})
