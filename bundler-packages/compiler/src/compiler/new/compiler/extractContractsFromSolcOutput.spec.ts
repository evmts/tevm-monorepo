import type { SolcOutput } from '@tevm/solc'
import { describe, expect, it } from 'vitest'
import { InheritedContract } from '../fixtures/index.js'
import type { CompileBaseOptions } from './CompileBaseOptions.js'
import { extractContractsFromSolcOutput } from './extractContractsFromSolcOutput.js'
import { AstParseError } from './internal/errors.js'

const baseOptions = {
	solcVersion: '0.8.30',
	loggingLevel: 'warn',
} as const satisfies CompileBaseOptions

describe('extractContractsFromSolcOutput', () => {
	describe('valid solc output extraction', () => {
		it('should extract all contracts from comprehensive solc output', () => {
			const result = extractContractsFromSolcOutput(InheritedContract.solcOutput, baseOptions)

			expect(result).toBeDefined()
			expect(typeof result).toBe('object')

			// Should extract all our fixture files
			expect(result['ComprehensiveContract.sol']).toBeDefined()
			expect(result['InheritedContract.sol']).toBeDefined()
			expect(result['lib/utils/MathUtils.sol']).toBeDefined()
		})

		it('should extract ComprehensiveContract source', () => {
			const result = extractContractsFromSolcOutput(InheritedContract.solcOutput, baseOptions)

			const comprehensiveSource = result['ComprehensiveContract.sol']
			expect(comprehensiveSource).toBeDefined()
			expect(typeof comprehensiveSource).toBe('string')
			expect(comprehensiveSource).toContain('ComprehensiveContract')
		})

		it('should extract InheritedContract source with both contracts', () => {
			const result = extractContractsFromSolcOutput(InheritedContract.solcOutput, baseOptions)

			const inheritedSource = result['InheritedContract.sol']
			expect(inheritedSource).toBeDefined()
			expect(typeof inheritedSource).toBe('string')
			// Both contracts should be in the output
			expect(inheritedSource).toContain('ExtendedContract')
			expect(inheritedSource).toContain('WrapperContract')
		})

		it('should extract library source', () => {
			const result = extractContractsFromSolcOutput(InheritedContract.solcOutput, baseOptions)

			const mathUtilsSource = result['lib/utils/MathUtils.sol']
			expect(mathUtilsSource).toBeDefined()
			expect(typeof mathUtilsSource).toBe('string')
			expect(mathUtilsSource).toContain('MathUtils')
		})

		it('should use provided solc version from options', () => {
			const customOptions = {
				solcVersion: '0.8.19',
				loggingLevel: 'debug' as const,
			} as const satisfies CompileBaseOptions

			const result = extractContractsFromSolcOutput(InheritedContract.solcOutput, customOptions)

			expect(result).toBeDefined()
			expect(Object.keys(result).length).toBeGreaterThan(0)
		})

		it('should use default solc version when not provided', () => {
			const optionsWithoutVersion = {
				loggingLevel: 'warn' as const,
			}

			const result = extractContractsFromSolcOutput(InheritedContract.solcOutput, optionsWithoutVersion)

			expect(result).toBeDefined()
			expect(Object.keys(result).length).toBeGreaterThan(0)
		})

		it('should handle contracts with nested paths', () => {
			const result = extractContractsFromSolcOutput(InheritedContract.solcOutput, baseOptions)

			// MathUtils is in nested path
			expect(result['lib/utils/MathUtils.sol']).toBeDefined()
		})

		it('should use default logging level when not provided', () => {
			const optionsWithoutLogging = {
				solcVersion: '0.8.30',
			} as const satisfies CompileBaseOptions

			const result = extractContractsFromSolcOutput(InheritedContract.solcOutput, optionsWithoutLogging)

			expect(result).toBeDefined()
			expect(Object.keys(result).length).toBeGreaterThan(0)
		})
	})

	describe('empty ast error handling', () => {
		it('should return empty object when sources is empty', () => {
			const emptySolcOutput: SolcOutput = {
				sources: {},
				contracts: {},
			}

			const result = extractContractsFromSolcOutput(emptySolcOutput, baseOptions)
			expect(result).toEqual({})
		})

		it('should return empty object when sources is empty even if contracts exist', () => {
			const solcOutput: SolcOutput = {
				sources: {},
				contracts: {
					'Test.sol': {},
				},
			}

			const result = extractContractsFromSolcOutput(solcOutput, baseOptions)
			expect(result).toEqual({})
		})
	})

	describe('invalid output format error handling', () => {
		it('should return empty object when InheritedContract.solcOutput.sources is missing', () => {
			const invalidSolcOutput = {
				contracts: {},
			} as any

			const result = extractContractsFromSolcOutput(invalidSolcOutput, baseOptions)
			expect(result).toEqual({})
		})

		it('should throw AstParseError when InheritedContract.solcOutput.sources is invalid type', () => {
			const invalidSolcOutput = {
				sources: 'invalid',
				contracts: {},
			} as any

			expect(() => extractContractsFromSolcOutput(invalidSolcOutput, baseOptions)).toThrow(AstParseError)

			try {
				extractContractsFromSolcOutput(invalidSolcOutput, baseOptions)
			} catch (error) {
				expect(error).toBeInstanceOf(AstParseError)
				const astError = error as AstParseError
				expect(astError.meta?.code).toBe('parse_failed')
			}
		})

		it('should return empty object when InheritedContract.solcOutput.sources is null', () => {
			const malformedSolcOutput = {
				sources: null,
				contracts: {},
			} as any

			const result = extractContractsFromSolcOutput(malformedSolcOutput, baseOptions)
			expect(result).toEqual({})
		})
	})

	describe('edge cases', () => {
		it('should handle InheritedContract.solcOutput with errors field', () => {
			// Our fixture has no errors, but we can still test it doesn't break
			const solcOutputWithErrors: SolcOutput = {
				...InheritedContract.solcOutput,
				errors: [
					{
						type: 'Warning',
						component: 'general',
						severity: 'warning',
						message: 'Unused variable',
						formattedMessage: 'Warning: Unused variable',
					},
				],
			}

			const result = extractContractsFromSolcOutput(solcOutputWithErrors, baseOptions)

			expect(result).toBeDefined()
			expect(Object.keys(result).length).toBeGreaterThan(0)
		})

		it('should preserve source path exactly as provided in solc output', () => {
			const result = extractContractsFromSolcOutput(InheritedContract.solcOutput, baseOptions)

			// Paths should match exactly what's in the fixture
			const paths = Object.keys(result)
			expect(paths).toContain('ComprehensiveContract.sol')
			expect(paths).toContain('InheritedContract.sol')
			expect(paths).toContain('lib/utils/MathUtils.sol')
		})

		it('should handle all source files from comprehensive fixture', () => {
			const result = extractContractsFromSolcOutput(InheritedContract.solcOutput, baseOptions)

			// Count should match our fixture sources (excluding node_modules)
			const nonNodeModuleSources = Object.keys(result).filter((path) => !path.startsWith('node_modules'))
			expect(nonNodeModuleSources.length).toBeGreaterThanOrEqual(3)
		})
	})

	describe('options variations', () => {
		it('should handle minimal options', () => {
			const minimalOptions = {}

			const result = extractContractsFromSolcOutput(InheritedContract.solcOutput, minimalOptions)

			expect(result).toBeDefined()
			expect(Object.keys(result).length).toBeGreaterThan(0)
		})

		it('should handle all logging levels', () => {
			const levels = ['error', 'warn', 'info', 'debug'] as const

			for (const level of levels) {
				const result = extractContractsFromSolcOutput(InheritedContract.solcOutput, {
					solcVersion: '0.8.30',
					loggingLevel: level,
				})

				expect(result).toBeDefined()
				expect(Object.keys(result).length).toBeGreaterThan(0)
			}
		})
	})

	describe('comprehensive fixture coverage', () => {
		it('should extract all non-node_modules sources', () => {
			const result = extractContractsFromSolcOutput(InheritedContract.solcOutput, baseOptions)

			// Get only our source files (not OpenZeppelin deps)
			const ourSources = Object.keys(result).filter((path) => !path.startsWith('node_modules'))

			expect(ourSources).toContain('ComprehensiveContract.sol')
			expect(ourSources).toContain('InheritedContract.sol')
			expect(ourSources).toContain('lib/utils/MathUtils.sol')
		})

		it('should extract OpenZeppelin dependency sources', () => {
			const result = extractContractsFromSolcOutput(InheritedContract.solcOutput, baseOptions)

			// Should also extract OpenZeppelin sources (paths start with ../../../../node_modules/@openzeppelin due to remapping)
			const ozSources = Object.keys(result).filter((path) => path.includes('@openzeppelin'))

			expect(ozSources.length).toBeGreaterThan(0)
		})

		it('should handle contracts with imports', () => {
			const result = extractContractsFromSolcOutput(InheritedContract.solcOutput, baseOptions)

			// ComprehensiveContract imports from OpenZeppelin and local lib
			const comprehensiveSource = result['ComprehensiveContract.sol']
			expect(comprehensiveSource).toBeDefined()
			expect(comprehensiveSource!.length).toBeGreaterThan(0)
		})

		it('should handle contracts with inheritance', () => {
			const result = extractContractsFromSolcOutput(InheritedContract.solcOutput, baseOptions)

			// InheritedContract has inheritance
			const inheritedSource = result['InheritedContract.sol']
			expect(inheritedSource).toBeDefined()
			expect(inheritedSource).toContain('ExtendedContract')
		})

		it('should handle library contracts', () => {
			const result = extractContractsFromSolcOutput(InheritedContract.solcOutput, baseOptions)

			// MathUtils is a library
			const mathUtilsSource = result['lib/utils/MathUtils.sol']
			expect(mathUtilsSource).toBeDefined()
			expect(mathUtilsSource).toContain('MathUtils')
		})
	})
})
