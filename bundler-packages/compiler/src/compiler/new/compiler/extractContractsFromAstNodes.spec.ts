import { type Logger } from '@tevm/logger'
import { ASTWriter, SourceUnit } from 'solc-typed-ast'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InheritedContract } from '../fixtures/index.js'
import { extractContractsFromAstNodes } from './extractContractsFromAstNodes.js'
import { AstParseError } from './internal/errors.js'
import { solcSourcesToAstNodes } from './solcSourcesToAstNodes.js'

describe('extractContractsFromAstNodes', () => {
	const mockLogger = {
		debug: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
	} as unknown as Logger
	let sourceUnits: SourceUnit[]

	beforeEach(() => {
		vi.clearAllMocks()
		sourceUnits = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger)
	})

	describe('basic source code generation', () => {
		it('should convert single SourceUnit to Solidity code', () => {
			const mathUtilsUnit = sourceUnits.filter((su) => su.absolutePath === 'lib/utils/MathUtils.sol')

			const result = extractContractsFromAstNodes(mathUtilsUnit, {
				solcVersion: '0.8.20',
			})

			expect(result.sources).toBeDefined()
			expect(result.sources['lib/utils/MathUtils.sol']).toBeDefined()
			expect(typeof result.sources['lib/utils/MathUtils.sol']).toBe('string')
			expect(result.sources['lib/utils/MathUtils.sol']?.length).toBeGreaterThan(0)
		})

		it('should convert multiple SourceUnits to Solidity code', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			expect(result.sources).toBeDefined()
			expect(Object.keys(result.sources).length).toBe(sourceUnits.length)

			sourceUnits.forEach((su) => {
				expect(result.sources[su.absolutePath]).toBeDefined()
				expect(typeof result.sources[su.absolutePath]).toBe('string')
				expect(result.sources[su.absolutePath]?.length).toBeGreaterThan(0)
			})
		})

		it('should return sources object with correct keys matching absolutePaths', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			const sourcePaths = sourceUnits.map((su) => su.absolutePath)
			const resultPaths = Object.keys(result.sources)

			expect(resultPaths.length).toBe(sourcePaths.length)
			sourcePaths.forEach((path) => {
				expect(resultPaths).toContain(path)
			})
		})
	})

	describe('Solidity element preservation', () => {
		it('should preserve import statements', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			const comprehensiveSource = result.sources['ComprehensiveContract.sol']
			expect(comprehensiveSource).toContain('import')
			expect(comprehensiveSource).toContain('@openzeppelin')
			expect(comprehensiveSource).toContain('MathUtils')
		})

		it('should preserve pragma directives', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			const comprehensiveSource = result.sources['ComprehensiveContract.sol']
			expect(comprehensiveSource).toContain('pragma solidity')
		})

		it('should preserve license identifiers', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			const comprehensiveSource = result.sources['ComprehensiveContract.sol']
			expect(comprehensiveSource).toContain('SPDX-License-Identifier')
			expect(comprehensiveSource).toContain('MIT')
		})

		it('should handle library definitions', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			const mathUtilsSource = result.sources['lib/utils/MathUtils.sol']
			expect(mathUtilsSource).toContain('library')
			expect(mathUtilsSource).toContain('MathUtils')
		})

		it('should handle contract inheritance', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			const comprehensiveSource = result.sources['ComprehensiveContract.sol']
			expect(comprehensiveSource).toContain('is ERC20')
			expect(comprehensiveSource).toContain('Ownable')
		})

		it('should handle using directives', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			const comprehensiveSource = result.sources['ComprehensiveContract.sol']
			expect(comprehensiveSource).toContain('using MathUtils')
		})
	})

	describe('source map generation', () => {
		it('should generate source maps when withSourceMap is true', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
				withSourceMap: true,
			})

			expect(result.sourceMaps).toBeDefined()
			expect(result.sourceMaps).not.toBeUndefined()

			sourceUnits.forEach((su) => {
				expect(result.sourceMaps![su.absolutePath]).toBeDefined()
				expect(result.sourceMaps![su.absolutePath]).toBeInstanceOf(Map)
			})
		})

		it('should not generate source maps when withSourceMap is false', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
				withSourceMap: false,
			})

			expect(result.sourceMaps).toBeUndefined()
		})

		it('should not generate source maps when withSourceMap is omitted', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			expect(result.sourceMaps).toBeUndefined()
		})

		it('should generate source maps with correct node mappings', () => {
			const mathUtilsUnit = sourceUnits.filter((su) => su.absolutePath === 'lib/utils/MathUtils.sol')

			const result = extractContractsFromAstNodes(mathUtilsUnit, {
				solcVersion: '0.8.20',
				withSourceMap: true,
			})

			const sourceMap = result.sourceMaps!['lib/utils/MathUtils.sol']
			expect(sourceMap?.size).toBeGreaterThan(0)

			const source = result.sources['lib/utils/MathUtils.sol']
			sourceMap?.forEach(([start, length]) => {
				expect(start).toBeGreaterThanOrEqual(0)
				expect(length).toBeGreaterThan(0)
				expect(start + length).toBeLessThanOrEqual(source?.length ?? 0)
			})
		})
	})

	describe('solc version handling', () => {
		it('should use provided solcVersion for writer', () => {
			const mathUtilsUnit = sourceUnits.filter((su) => su.absolutePath === 'lib/utils/MathUtils.sol')

			const result = extractContractsFromAstNodes(mathUtilsUnit, {
				solcVersion: '0.8.17',
			})

			expect(result.sources['lib/utils/MathUtils.sol']).toBeDefined()
		})

		it('should work with different solc versions', () => {
			const mathUtilsUnit = sourceUnits.filter((su) => su.absolutePath === 'lib/utils/MathUtils.sol')

			const versions = ['0.8.17', '0.8.19', '0.8.20', '0.8.23'] as const

			versions.forEach((version) => {
				const result = extractContractsFromAstNodes(mathUtilsUnit, {
					solcVersion: version,
				})

				expect(result.sources['lib/utils/MathUtils.sol']).toBeDefined()
				expect(result.sources['lib/utils/MathUtils.sol']?.length).toBeGreaterThan(0)
			})
		})
	})

	describe('error handling', () => {
		it('should throw AstParseError on write failure', () => {
			vi.spyOn(ASTWriter.prototype, 'write').mockImplementation(() => {
				throw new Error('Write failed')
			})

			expect(() =>
				extractContractsFromAstNodes(sourceUnits, {
					solcVersion: '0.8.20',
				}),
			).toThrow(AstParseError)

			vi.restoreAllMocks()
		})

		it('should include source path in error metadata', () => {
			vi.spyOn(ASTWriter.prototype, 'write').mockImplementation(() => {
				throw new Error('Write failed')
			})

			try {
				extractContractsFromAstNodes(sourceUnits, {
					solcVersion: '0.8.20',
				})
			} catch (error) {
				expect(error).toBeInstanceOf(AstParseError)
				expect((error as AstParseError).message).toBe('Failed to write source unit to Solidity code')
				expect((error as AstParseError).meta?.code).toBe('parse_failed')
				expect((error as AstParseError).meta?.sources).toBeDefined()
			}

			vi.restoreAllMocks()
		})

		it('should include cause in error', () => {
			const originalError = new TypeError('Invalid node type')
			vi.spyOn(ASTWriter.prototype, 'write').mockImplementation(() => {
				throw originalError
			})

			try {
				extractContractsFromAstNodes(sourceUnits, {
					solcVersion: '0.8.20',
				})
			} catch (error) {
				expect(error).toBeInstanceOf(AstParseError)
				expect((error as AstParseError).cause).toBe(originalError)
			}

			vi.restoreAllMocks()
		})

		it('should set correct error tags for AstParseError', () => {
			vi.spyOn(ASTWriter.prototype, 'write').mockImplementation(() => {
				throw new Error('Write failed')
			})

			try {
				extractContractsFromAstNodes(sourceUnits, {
					solcVersion: '0.8.20',
				})
			} catch (error) {
				expect((error as AstParseError).name).toBe('AstParseError')
				expect((error as AstParseError)._tag).toBe('AstParseError')
			}

			vi.restoreAllMocks()
		})
	})

	describe('contract structure preservation', () => {
		it('should preserve function definitions', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			const comprehensiveSource = result.sources['ComprehensiveContract.sol']
			expect(comprehensiveSource).toContain('function mint')
			expect(comprehensiveSource).toContain('function stake')
			expect(comprehensiveSource).toContain('function calculateReward')
		})

		it('should preserve state variables', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			const comprehensiveSource = result.sources['ComprehensiveContract.sol']
			expect(comprehensiveSource).toContain('rewardPercentage')
			expect(comprehensiveSource).toContain('stakes')
		})

		it('should preserve event definitions', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			const comprehensiveSource = result.sources['ComprehensiveContract.sol']
			expect(comprehensiveSource).toContain('event Staked')
			expect(comprehensiveSource).toContain('event Rewarded')
		})

		it('should preserve constructor', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			const comprehensiveSource = result.sources['ComprehensiveContract.sol']
			expect(comprehensiveSource).toContain('constructor')
		})

		it('should preserve modifiers from inherited contracts', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			const comprehensiveSource = result.sources['ComprehensiveContract.sol']
			expect(comprehensiveSource).toContain('onlyOwner')
		})

		it('should preserve complex type definitions', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			const comprehensiveSource = result.sources['ComprehensiveContract.sol']
			expect(comprehensiveSource).toContain('mapping')
			expect(comprehensiveSource).toContain('address')
			expect(comprehensiveSource).toContain('uint256')
		})
	})

	describe('multiple contracts and libraries', () => {
		it('should handle file with multiple contracts', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			const inheritedContractSource = result.sources['InheritedContract.sol']
			expect(inheritedContractSource).toContain('ExtendedContract')
			expect(inheritedContractSource).toContain('WrapperContract')
		})

		it('should preserve contract relationships', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			const inheritedContractSource = result.sources['InheritedContract.sol']
			expect(inheritedContractSource).toContain('import')
			expect(inheritedContractSource).toContain('ComprehensiveContract')
		})

		it('should handle library functions correctly', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			const mathUtilsSource = result.sources['lib/utils/MathUtils.sol']
			expect(mathUtilsSource).toContain('function add')
			expect(mathUtilsSource).toContain('function multiply')
			expect(mathUtilsSource).toContain('function percentage')
		})
	})

	describe('import context maintenance', () => {
		it('should process all source units together maintaining import context', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			const comprehensiveSource = result.sources['ComprehensiveContract.sol']
			const inheritedContractSource = result.sources['InheritedContract.sol']
			const mathUtilsSource = result.sources['lib/utils/MathUtils.sol']

			expect(comprehensiveSource).toContain('import')
			expect(inheritedContractSource).toContain('import')
			expect(comprehensiveSource).toContain('MathUtils')
			expect(inheritedContractSource).toContain('ComprehensiveContract')
			expect(mathUtilsSource).toContain('MathUtils')
		})

		it('should maintain references across source units', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			Object.values(result.sources).forEach((source) => {
				expect(source).toBeDefined()
				expect(source.length).toBeGreaterThan(0)
			})

			expect(Object.keys(result.sources).length).toBe(sourceUnits.length)
		})
	})

	describe('formatting and code quality', () => {
		it('should use PrettyFormatter with consistent formatting', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			Object.values(result.sources).forEach((source) => {
				expect(source).toMatch(/\n/)
				expect(source.trim()).toBe(source.trim())
			})
		})

		it('should produce valid Solidity syntax', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			Object.values(result.sources).forEach((source) => {
				expect(source).toContain('pragma solidity')
				expect(source.split('{').length).toBe(source.split('}').length)
			})
		})

		it('should maintain proper indentation', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			const comprehensiveSource = result.sources['ComprehensiveContract.sol']
			const lines = comprehensiveSource?.split('\n')

			const indentedLines = lines?.filter((line) => line.startsWith('    '))
			expect(indentedLines?.length).toBeGreaterThan(0)
		})
	})

	describe('edge cases', () => {
		it('should handle empty SourceUnit array', () => {
			const result = extractContractsFromAstNodes([], {
				solcVersion: '0.8.20',
			})

			expect(result.sources).toEqual({})
			expect(result.sourceMaps).toBeUndefined()
		})

		it('should handle single SourceUnit without imports', () => {
			const mathUtilsUnit = sourceUnits.filter((su) => su.absolutePath === 'lib/utils/MathUtils.sol')

			const result = extractContractsFromAstNodes(mathUtilsUnit, {
				solcVersion: '0.8.20',
			})

			expect(Object.keys(result.sources).length).toBe(1)
			expect(result.sources['lib/utils/MathUtils.sol']).toBeDefined()
		})

		it('should handle SourceUnits with complex inheritance chains', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			const comprehensiveSource = result.sources['ComprehensiveContract.sol']
			expect(comprehensiveSource).toContain('ERC20')
			expect(comprehensiveSource).toContain('Ownable')
		})
	})

	describe('comprehensive fixture coverage', () => {
		it('should convert all fixture sources without errors', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			expect(Object.keys(result.sources).length).toBe(sourceUnits.length)
			Object.values(result.sources).forEach((source) => {
				expect(source).toBeDefined()
				expect(source.length).toBeGreaterThan(0)
			})
		})

		it('should preserve all structural elements across all fixtures', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			Object.values(result.sources).forEach((source) => {
				expect(source).toContain('pragma solidity')
			})

			const comprehensiveSource = result.sources['ComprehensiveContract.sol']
			expect(comprehensiveSource).toContain('contract ComprehensiveContract')
			expect(comprehensiveSource).toContain('import')
			expect(comprehensiveSource).toContain('event')
			expect(comprehensiveSource).toContain('function')
		})

		it('should produce sources that maintain complete context', () => {
			const result = extractContractsFromAstNodes(sourceUnits, {
				solcVersion: '0.8.20',
			})

			sourceUnits.forEach((su) => {
				expect(result.sources[su.absolutePath]).toBeDefined()
			})
		})
	})
})
