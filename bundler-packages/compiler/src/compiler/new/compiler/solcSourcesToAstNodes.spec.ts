import type { Logger } from '@tevm/logger'
import type { SolcSourceEntry } from '@tevm/solc'
import { ASTReader, SourceUnit } from 'solc-typed-ast'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InheritedContract } from '../fixtures/index.js'
import { AstParseError } from './internal/errors.js'
import { solcSourcesToAstNodes } from './solcSourcesToAstNodes.js'

describe('solcSourcesToAstNodes', () => {
	const mockLogger = {
		debug: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
		log: vi.fn(),
	} as unknown as Logger

	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('valid sources parsing', () => {
		it('should parse single source file with no imports', () => {
			const sources = {
				'lib/utils/MathUtils.sol': InheritedContract.solcOutput.sources?.[`lib/utils/MathUtils.sol`] as SolcSourceEntry,
			}

			const result = solcSourcesToAstNodes(sources, mockLogger)

			expect(Array.isArray(result)).toBe(true)
			expect(result.length).toBe(1)
			expect(result[0]).toBeInstanceOf(SourceUnit)
			expect(result[0]?.absolutePath).toBe('lib/utils/MathUtils.sol')
			expect(mockLogger.debug).toHaveBeenCalledWith('Parsing 1 source file(s) into AST nodes')
			expect(mockLogger.debug).toHaveBeenCalledWith('Parsed 1 source unit(s) from sources')
		})

		it('should parse multiple source files with imports', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			expect(Array.isArray(result)).toBe(true)
			expect(result.length).toBeGreaterThan(1)
			expect(result.every((su) => su instanceof SourceUnit)).toBe(true)
			const sourcePaths = Object.keys(InheritedContract.solcOutput.sources ?? {})
			expect(mockLogger.debug).toHaveBeenCalledWith(`Parsing ${sourcePaths.length} source file(s) into AST nodes`)
		})

		it('should parse sources with OpenZeppelin imports', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const comprehensiveContract = result.find((su) => su.absolutePath === 'ComprehensiveContract.sol')
			expect(comprehensiveContract).toBeDefined()

			const imports = comprehensiveContract!.children.filter((node) => node.type === 'ImportDirective')
			expect(imports.length).toBeGreaterThan(0)

			const hasOpenZeppelinImport = imports.some((imp: any) => imp.file?.includes('@openzeppelin'))
			expect(hasOpenZeppelinImport).toBe(true)
		})

		it('should parse sources with local relative imports', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const comprehensiveContract = result.find((su) => su.absolutePath === 'ComprehensiveContract.sol')
			expect(comprehensiveContract).toBeDefined()

			const imports = comprehensiveContract!.children.filter((node) => node.type === 'ImportDirective')
			const hasLocalImport = imports.some((imp: any) => imp.file?.includes('MathUtils'))
			expect(hasLocalImport).toBe(true)
		})

		it('should parse sources with remapping imports', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const comprehensiveContract = result.find((su) => su.absolutePath === 'ComprehensiveContract.sol')
			expect(comprehensiveContract).toBeDefined()

			const imports = comprehensiveContract!.children.filter((node) => node.type === 'ImportDirective')
			const hasRemappedImport = imports.some((imp: any) => imp.file?.includes('utils/'))
			expect(hasRemappedImport).toBe(true)
		})

		it('should preserve source order from compilation', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const sourcePaths = Object.keys(InheritedContract.solcOutput.sources ?? {})
			const resultPaths = result.map((su) => su.absolutePath)

			sourcePaths.forEach((path) => {
				expect(resultPaths).toContain(path)
			})
		})

		it('should ensure all SourceUnits have correct absolutePath', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const sourcePaths = Object.keys(InheritedContract.solcOutput.sources ?? {})

			result.forEach((sourceUnit) => {
				expect(sourceUnit.absolutePath).toBeDefined()
				expect(sourcePaths).toContain(sourceUnit.absolutePath)
			})
		})

		it('should properly resolve import references between source units', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const comprehensiveContract = result.find((su) => su.absolutePath === 'ComprehensiveContract.sol')
			expect(comprehensiveContract).toBeDefined()

			const imports = comprehensiveContract!.children.filter((node) => node.type === 'ImportDirective')
			expect(imports.length).toBeGreaterThan(0)

			imports.forEach((imp: any) => {
				if (imp.vSourceUnit) {
					expect(imp.vSourceUnit).toBeInstanceOf(SourceUnit)
					expect(result.some((su) => su.id === imp.vSourceUnit.id)).toBe(true)
				}
			})
		})
	})

	describe('source unit content validation', () => {
		it('should parse contracts correctly', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const comprehensiveContract = result.find((su) => su.absolutePath === 'ComprehensiveContract.sol')
			expect(comprehensiveContract).toBeDefined()
			expect(comprehensiveContract!.vContracts.length).toBeGreaterThan(0)

			const contract = comprehensiveContract!.vContracts.find((c) => c.name === 'ComprehensiveContract')
			expect(contract).toBeDefined()
		})

		it('should parse libraries correctly', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const mathUtils = result.find((su) => su.absolutePath === 'lib/utils/MathUtils.sol')
			expect(mathUtils).toBeDefined()

			const library = mathUtils!.vContracts.find((c) => c.name === 'MathUtils')
			expect(library).toBeDefined()
		})

		it('should preserve contract inheritance information', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const inheritedContract = result.find((su) => su.absolutePath === 'InheritedContract.sol')
			expect(inheritedContract).toBeDefined()

			const extendedContract = inheritedContract!.vContracts.find((c) => c.name === 'ExtendedContract')
			expect(extendedContract).toBeDefined()
			expect(extendedContract!.vLinearizedBaseContracts.length).toBeGreaterThan(1)
		})

		it('should preserve pragma directives', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const comprehensiveContract = result.find((su) => su.absolutePath === 'ComprehensiveContract.sol')
			expect(comprehensiveContract).toBeDefined()

			const hasPragma = comprehensiveContract!.children.some((node) => node.type === 'PragmaDirective')
			expect(hasPragma).toBe(true)
		})

		it('should preserve license identifiers', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const comprehensiveContract = result.find((su) => su.absolutePath === 'ComprehensiveContract.sol')
			expect(comprehensiveContract).toBeDefined()
			expect((comprehensiveContract as any).license).toBe('MIT')
		})

		it('should preserve using directives', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const comprehensiveContract = result.find((su) => su.absolutePath === 'ComprehensiveContract.sol')
			expect(comprehensiveContract).toBeDefined()

			const contract = comprehensiveContract!.vContracts.find((c) => c.name === 'ComprehensiveContract')
			expect(contract).toBeDefined()
			expect(contract!.vUsingForDirectives.length).toBeGreaterThan(0)
		})

		it('should preserve function definitions', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const comprehensiveContract = result.find((su) => su.absolutePath === 'ComprehensiveContract.sol')
			expect(comprehensiveContract).toBeDefined()

			const contract = comprehensiveContract!.vContracts.find((c) => c.name === 'ComprehensiveContract')
			expect(contract).toBeDefined()
			expect(contract!.vFunctions.length).toBeGreaterThan(0)
		})

		it('should preserve state variables', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const comprehensiveContract = result.find((su) => su.absolutePath === 'ComprehensiveContract.sol')
			expect(comprehensiveContract).toBeDefined()

			const contract = comprehensiveContract!.vContracts.find((c) => c.name === 'ComprehensiveContract')
			expect(contract).toBeDefined()
			expect(contract!.vStateVariables.length).toBeGreaterThan(0)
		})

		it('should preserve event definitions', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const comprehensiveContract = result.find((su) => su.absolutePath === 'ComprehensiveContract.sol')
			expect(comprehensiveContract).toBeDefined()

			const contract = comprehensiveContract!.vContracts.find((c) => c.name === 'ComprehensiveContract')
			expect(contract).toBeDefined()
			expect(contract!.vEvents.length).toBeGreaterThan(0)
		})
	})

	describe('error handling', () => {
		it('should throw AstParseError on invalid sources structure', () => {
			const invalidSources = {
				'Test.sol': {
					id: 1,
				} as unknown as SolcSourceEntry,
			}

			expect(() => solcSourcesToAstNodes(invalidSources, mockLogger)).toThrow(AstParseError)
		})

		it('should throw AstParseError on malformed AST', () => {
			const malformedSources = {
				'Test.sol': {
					ast: {
						nodeType: 'InvalidNodeType',
						id: 1,
					},
				} as unknown as SolcSourceEntry,
			}

			expect(() => solcSourcesToAstNodes(malformedSources, mockLogger)).toThrow(AstParseError)
		})

		it('should throw AstParseError with correct error code parse_failed', () => {
			const invalidSources = {
				'Test.sol': {
					id: 1,
				} as unknown as SolcSourceEntry,
			}

			try {
				solcSourcesToAstNodes(invalidSources, mockLogger)
			} catch (error) {
				expect(error).toBeInstanceOf(AstParseError)
				expect((error as AstParseError).meta?.code).toBe('parse_failed')
				expect(mockLogger.error).toHaveBeenCalledWith('Failed to parse sources into AST nodes')
			}
		})

		it('should throw AstParseError with code empty_ast when no source units returned', () => {
			vi.spyOn(ASTReader.prototype, 'read').mockReturnValue([])

			try {
				solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)
			} catch (error) {
				expect(error).toBeInstanceOf(AstParseError)
				expect((error as AstParseError).message).toBe('Parsed AST contains no source units')
				expect((error as AstParseError).meta?.code).toBe('empty_ast')
				expect(mockLogger.error).toHaveBeenCalledWith('Parsed AST contains no source units')
			}

			vi.restoreAllMocks()
		})

		it('should include all source paths in error metadata', () => {
			const invalidSources = {
				'Test1.sol': { id: 1 } as unknown as SolcSourceEntry,
				'Test2.sol': { id: 2 } as unknown as SolcSourceEntry,
			}

			try {
				solcSourcesToAstNodes(invalidSources, mockLogger)
			} catch (error) {
				expect(error).toBeInstanceOf(AstParseError)
				expect((error as AstParseError).meta?.sources).toEqual(['Test1.sol', 'Test2.sol'])
			}
		})

		it('should include cause in error when parse fails', () => {
			const originalError = new TypeError('Invalid AST structure')
			vi.spyOn(ASTReader.prototype, 'read').mockImplementation(() => {
				throw originalError
			})

			try {
				solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)
			} catch (error) {
				expect(error).toBeInstanceOf(AstParseError)
				expect((error as AstParseError).cause).toBe(originalError)
			}

			vi.restoreAllMocks()
		})

		it('should set correct error tags for AstParseError', () => {
			vi.spyOn(ASTReader.prototype, 'read').mockReturnValue([])

			try {
				solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)
			} catch (error) {
				expect((error as AstParseError).name).toBe('AstParseError')
				expect((error as AstParseError)._tag).toBe('AstParseError')
			}

			vi.restoreAllMocks()
		})
	})

	describe('logger integration', () => {
		it('should call debug logger for successful parsing', () => {
			const sources = {
				'lib/utils/MathUtils.sol': InheritedContract.solcOutput.sources?.[`lib/utils/MathUtils.sol`] as SolcSourceEntry,
			}

			solcSourcesToAstNodes(sources, mockLogger)

			expect(mockLogger.debug).toHaveBeenCalledTimes(2)
			expect(mockLogger.debug).toHaveBeenNthCalledWith(1, 'Parsing 1 source file(s) into AST nodes')
			expect(mockLogger.debug).toHaveBeenNthCalledWith(2, 'Parsed 1 source unit(s) from sources')
		})

		it('should call debug logger with correct count for multiple sources', () => {
			solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const sourcePaths = Object.keys(InheritedContract.solcOutput.sources ?? {})
			expect(mockLogger.debug).toHaveBeenCalledWith(`Parsing ${sourcePaths.length} source file(s) into AST nodes`)
		})

		it('should call error logger when parsing fails', () => {
			vi.spyOn(ASTReader.prototype, 'read').mockImplementation(() => {
				throw new Error('Parse error')
			})

			try {
				solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)
			} catch {
				expect(mockLogger.error).toHaveBeenCalledWith('Failed to parse sources into AST nodes')
			}

			vi.restoreAllMocks()
		})

		it('should not call info or warn loggers', () => {
			const sources = {
				'lib/utils/MathUtils.sol': InheritedContract.solcOutput.sources?.[`lib/utils/MathUtils.sol`] as SolcSourceEntry,
			}

			solcSourcesToAstNodes(sources, mockLogger)

			expect(mockLogger.info).not.toHaveBeenCalled()
			expect(mockLogger.warn).not.toHaveBeenCalled()
		})
	})

	describe('edge cases', () => {
		it('should handle empty sources object', () => {
			const emptySources = {}

			try {
				solcSourcesToAstNodes(emptySources, mockLogger)
			} catch (error) {
				expect(error).toBeInstanceOf(AstParseError)
				expect((error as AstParseError).meta?.code).toBe('empty_ast')
			}
		})

		it('should handle source units with complex dependency graphs', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const comprehensiveContract = result.find((su) => su.absolutePath === 'ComprehensiveContract.sol')
			expect(comprehensiveContract).toBeDefined()

			const inheritedContract = result.find((su) => su.absolutePath === 'InheritedContract.sol')
			expect(inheritedContract).toBeDefined()

			const mathUtils = result.find((su) => su.absolutePath === 'lib/utils/MathUtils.sol')
			expect(mathUtils).toBeDefined()

			expect(result.length).toBeGreaterThan(3)
		})

		it('should handle files with multiple contracts', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const inheritedContract = result.find((su) => su.absolutePath === 'InheritedContract.sol')
			expect(inheritedContract).toBeDefined()

			const contractNames = inheritedContract!.vContracts.map((c) => c.name)
			expect(contractNames).toContain('ExtendedContract')
			expect(contractNames).toContain('WrapperContract')
		})

		it('should maintain cross-references between source units', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const allSourceUnitIds = new Set(result.map((su) => su.id))

			result.forEach((sourceUnit) => {
				const imports = sourceUnit.children.filter((node) => node.type === 'ImportDirective')
				imports.forEach((imp: any) => {
					if (imp.vSourceUnit) {
						expect(allSourceUnitIds.has(imp.vSourceUnit.id)).toBe(true)
					}
				})
			})
		})
	})

	describe('comprehensive fixture coverage', () => {
		it('should parse all fixture sources without errors', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			expect(result.length).toBe(Object.keys(InheritedContract.solcOutput.sources ?? {}).length)
			expect(mockLogger.error).not.toHaveBeenCalled()
		})

		it('should handle contracts with ERC20 inheritance', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const comprehensiveContract = result.find((su) => su.absolutePath === 'ComprehensiveContract.sol')
			expect(comprehensiveContract).toBeDefined()

			const contract = comprehensiveContract!.vContracts.find((c) => c.name === 'ComprehensiveContract')
			expect(contract).toBeDefined()
			expect(contract!.vLinearizedBaseContracts.length).toBeGreaterThan(1)
		})

		it('should handle contracts with complex type mappings', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			const comprehensiveContract = result.find((su) => su.absolutePath === 'ComprehensiveContract.sol')
			expect(comprehensiveContract).toBeDefined()

			const contract = comprehensiveContract!.vContracts.find((c) => c.name === 'ComprehensiveContract')
			expect(contract).toBeDefined()

			const stakesVar = contract!.vStateVariables.find((v) => v.name === 'stakes')
			expect(stakesVar).toBeDefined()
		})

		it('should produce valid SourceUnit array that can be processed further', () => {
			const result = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)

			expect(result).toBeInstanceOf(Array)
			expect(result.every((su) => su instanceof SourceUnit)).toBe(true)
			expect(result.every((su) => su.absolutePath)).toBe(true)
			expect(result.every((su) => su.id >= 0)).toBe(true)
		})
	})
})
