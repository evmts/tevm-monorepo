import { createLogger } from '@tevm/logger'
import type { Solc, SolcInputDescription, SolcOutput } from '@tevm/solc'
import { solcCompile } from '@tevm/solc'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SimpleContract, SimpleContractAst, SimpleYul } from '../fixtures/index.js'
import { compileSource, compileSourceInternal } from './compileSource.js'
import { defaults } from './internal/defaults.js'
import { CompilerOutputError } from './internal/errors.js'
import type { ValidatedCompileBaseOptions } from './internal/ValidatedCompileBaseOptions.js'

vi.mock('@tevm/solc', async () => {
	const actual = await vi.importActual<typeof import('@tevm/solc')>('@tevm/solc')
	const { SimpleContract, SimpleYul } = await import('../fixtures/index.js')

	return {
		...actual,
		solcCompile: vi.fn((_solc: Solc, input: SolcInputDescription): SolcOutput => {
			const sourcePath = Object.keys(input.sources)[0]
			const sourceContent = input.sources[sourcePath as string]
			if (!sourceContent) throw new Error('Source content not found')

			// Check if compiling SimpleContract source
			if ('content' in sourceContent && sourceContent.content === SimpleContract.source) {
				if (!SimpleContract.solcOutput.contracts?.['SimpleContract.sol'])
					throw new Error('SimpleContract.solcOutput.contracts not found')
				if (!SimpleContract.solcOutput.sources?.['SimpleContract.sol'])
					throw new Error('SimpleContract.solcOutput.sources not found')
				return {
					...SimpleContract.solcOutput,
					contracts: {
						[defaults.injectIntoContractPath]: SimpleContract.solcOutput.contracts['SimpleContract.sol'],
					},
					sources: {
						[defaults.injectIntoContractPath]: SimpleContract.solcOutput.sources['SimpleContract.sol'],
					},
				}
			}

			// Check if compiling SimpleYul source
			if ('content' in sourceContent && sourceContent.content === SimpleYul.source) {
				if (!SimpleYul.solcOutput.contracts?.['SimpleYul.yul'])
					throw new Error('SimpleYul.solcOutput.contracts not found')
				if (!SimpleYul.solcOutput.sources?.['SimpleYul.yul']) throw new Error('SimpleYul.solcOutput.sources not found')
				return {
					...SimpleYul.solcOutput,
					contracts: {
						[defaults.injectIntoContractPath]: SimpleYul.solcOutput.contracts['SimpleYul.yul'],
					},
					sources: {
						[defaults.injectIntoContractPath]: SimpleYul.solcOutput.sources['SimpleYul.yul'],
					},
				}
			}

			// Check if compiling SimpleContract AST
			if ('ast' in sourceContent) {
				if (!SimpleContractAst.solcOutput.contracts?.['SimpleContract.sol'])
					throw new Error('SimpleContract.solcOutput.contracts not found')
				if (!SimpleContractAst.solcOutput.sources?.['SimpleContract.sol'])
					throw new Error('SimpleContract.solcOutput.sources not found')
				return {
					...SimpleContractAst.solcOutput,
					contracts: {
						[defaults.injectIntoContractPath]: SimpleContractAst.solcOutput.contracts['SimpleContract.sol'],
					},
					// AST input doesn't return sources in the output
					sources: {
						[defaults.injectIntoContractPath]: SimpleContractAst.solcOutput.sources['SimpleContract.sol'],
					},
				}
			}

			return input as any
		}),
		createSolc: vi.fn().mockResolvedValue({
			version: '0.8.20',
			compile: vi.fn(),
		} as any),
	}
})

/**
 * Tests for compileSource function
 *
 * This file focuses on what's specific to compileSource:
 * 1. Wrapping source in defaults.injectIntoContractPath path and unwrapping result
 * 2. Error handling when source output is missing
 * 3. Support for different languages (Solidity, Yul, SolidityAST)
 *
 * What we DON'T test here (covered by other test files):
 * - Option validation (validateBaseOptions.spec.ts)
 * - Solc version loading (getSolc.spec.ts)
 * - Contract compilation details (compileContracts.spec.ts)
 * - Compilation output selections (compileContracts.spec.ts)
 * - Optimizer, viaIR, remappings settings (compileContracts.spec.ts)
 */
describe('compileSource', () => {
	let mockLogger: ReturnType<typeof createLogger>
	let mockSolc: Solc
	let mockSolcCompile: ReturnType<typeof vi.fn>

	beforeEach(() => {
		mockLogger = {
			debug: vi.fn(),
			info: vi.fn(),
			warn: vi.fn(),
			error: vi.fn(),
		} as unknown as ReturnType<typeof createLogger>

		mockSolc = {
			compile: vi.fn(),
		} as unknown as Solc

		mockSolcCompile = solcCompile as unknown as ReturnType<typeof vi.fn>
		mockSolcCompile.mockClear()
	})

	describe('basic compilation flow', () => {
		it('should compile simple Solidity source and return correct structure', async () => {
			const result = await compileSource(SimpleContract.source, {
				language: 'Solidity',
				solcVersion: '0.8.20',
			})

			// Verify result structure
			expect(result).toBeDefined()
			expect(result.compilationResult).toBeDefined()
			expect(result.compilationResult.contract).toBeDefined()
			expect(result.compilationResult.contract['SimpleContract']).toBeDefined()

			// Verify contract has expected properties
			const contract = result.compilationResult.contract['SimpleContract']
			expect(contract?.abi).toBeInstanceOf(Array)
			expect(contract?.abi.length).toBeGreaterThan(0)
			expect(contract?.evm).toBeDefined()
			expect(contract?.evm.bytecode).toBeDefined()

			// Verify solcCompile was called with defaults.injectIntoContractPath path
			expect(mockSolcCompile).toHaveBeenCalledOnce()
			expect(mockSolcCompile).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					sources: {
						[defaults.injectIntoContractPath]: { content: SimpleContract.source },
					},
				}),
			)
		})

		it('should compile Yul source code', async () => {
			const result = await compileSource(SimpleYul.source, {
				language: 'Yul',
				solcVersion: '0.8.20',
			})

			expect(result).toBeDefined()
			expect(result.compilationResult.contract).toBeDefined()
			expect(result.compilationResult.contract['SimpleYul']).toBeDefined()
			expect(result.compilationResult.contract['SimpleYul']?.evm?.bytecode).toBeDefined()
			expect(result.compilationResult.ast).toBeDefined()
			expect(result.compilationResult.ast?.nodeType).toBe('YulObject')
		})

		it('should compile from Solidity AST', async () => {
			const ast = SimpleContract.solcOutput.sources!['SimpleContract.sol']!.ast

			const result = await compileSource(ast, {
				language: 'SolidityAST',
				solcVersion: '0.8.20',
			})

			expect(result).toBeDefined()
			expect(result.compilationResult.contract['SimpleContract']).toBeDefined()
			expect(result.compilationResult.contract['SimpleContract']?.abi).toBeDefined()
		})
	})

	describe('result structure transformation', () => {
		it('should extract anonymous source result correctly', () => {
			const options: ValidatedCompileBaseOptions = {
				language: 'Solidity',
				hardfork: 'cancun',
				compilationOutput: ['abi', 'ast', 'evm.bytecode', 'evm.deployedBytecode', 'storageLayout'],
				solcVersion: '0.8.20',
				throwOnVersionMismatch: true,
				throwOnCompilationError: false,
			}

			const result = compileSourceInternal(mockSolc, SimpleContract.source, options, mockLogger)

			// Should have unwrapped the defaults.injectIntoContractPath source
			expect(result.compilationResult).toBeDefined()
			expect(result.compilationResult.contract).toBeDefined()
			expect(result.compilationResult.contract['SimpleContract']).toBeDefined()

			// Should not have the wrapper path in the result
			expect(result.compilationResult).not.toHaveProperty(defaults.injectIntoContractPath)
		})

		it('should include AST in result when present', async () => {
			const result = await compileSource(SimpleContract.source, {
				solcVersion: '0.8.20',
				compilationOutput: ['ast', 'abi'],
			})

			expect(result.compilationResult.ast).toBeDefined()
			expect(result.compilationResult.ast.nodeType).toBe('SourceUnit')
		})
	})

	describe('error handling', () => {
		it('should handle compilation errors gracefully when throwOnCompilationError is false', async () => {
			// Mock error output - override the default fixture behavior
			mockSolcCompile.mockImplementationOnce(() => ({
				errors: [
					{
						severity: 'error',
						message: 'Expected ";"',
						type: 'ParserError',
						component: 'general',
						formattedMessage: 'ParserError: Expected ";"',
						sourceLocation: {
							file: defaults.injectIntoContractPath,
							start: 0,
							end: 10,
						},
					},
				],
				sources: {
					[defaults.injectIntoContractPath]: {
						id: 0,
						ast: {
							nodeType: 'SourceUnit',
							nodes: [],
							src: '0:0:0',
							absolutePath: defaults.injectIntoContractPath,
							id: 0,
							exportedSymbols: {},
						},
					},
				},
				contracts: {
					[defaults.injectIntoContractPath]: {},
				},
			}))

			const result = await compileSource(SimpleContract.source, {
				solcVersion: '0.8.20',
				throwOnCompilationError: false,
			})

			expect(result).toBeDefined()
			expect(result.errors).toBeDefined()
			expect(result.errors!.length).toBeGreaterThan(0)
			expect(result.errors!.some((e) => e.severity === 'error')).toBe(true)
		})

		it('should throw compilation errors when throwOnCompilationError is true', async () => {
			// Mock error output - override the default fixture behavior
			mockSolcCompile.mockImplementationOnce(() => ({
				errors: [
					{
						severity: 'error',
						message: 'Expected ";"',
						type: 'ParserError',
						component: 'general',
						formattedMessage: 'ParserError: Expected ";"',
						sourceLocation: {
							file: defaults.injectIntoContractPath,
							start: 0,
							end: 10,
						},
					},
				],
				sources: {
					[defaults.injectIntoContractPath]: {
						id: 0,
						ast: {
							nodeType: 'SourceUnit',
							nodes: [],
							src: '0:0:0',
							absolutePath: defaults.injectIntoContractPath,
							id: 0,
							exportedSymbols: {},
						},
					},
				},
				contracts: {
					[defaults.injectIntoContractPath]: {},
				},
			}))

			await expect(
				compileSource(SimpleContract.source, {
					solcVersion: '0.8.20',
					throwOnCompilationError: true,
				}),
			).rejects.toThrow(CompilerOutputError)
		})

		it('should include warnings in result without throwing', async () => {
			// Mock warning output - override the default fixture behavior
			mockSolcCompile.mockImplementationOnce(() => ({
				errors: [
					{
						severity: 'warning',
						message: 'Function state mutability can be restricted',
						type: 'Warning',
						component: 'general',
						formattedMessage: 'Warning: Function state mutability can be restricted',
						sourceLocation: {
							file: defaults.injectIntoContractPath,
							start: 0,
							end: 10,
						},
					},
				],
				contracts: {
					[defaults.injectIntoContractPath]: SimpleContract.solcOutput.contracts!['SimpleContract.sol'],
				},
				sources: {
					[defaults.injectIntoContractPath]: SimpleContract.solcOutput.sources!['SimpleContract.sol'],
				},
			}))

			const result = await compileSource(SimpleContract.source, {
				solcVersion: '0.8.20',
			})

			expect(result).toBeDefined()
			expect(result.errors).toBeDefined()
			expect(result.errors!.length).toBeGreaterThan(0)
			expect(result.errors!.every((e) => e.severity === 'warning')).toBe(true)
		})
	})

	describe('compileSourceInternal', () => {
		it('should handle empty compilation output gracefully', () => {
			// Mock empty source output - compileContracts always creates an entry, even if empty
			mockSolcCompile.mockImplementationOnce(() => ({
				contracts: {},
				sources: {},
			}))

			const options: ValidatedCompileBaseOptions = {
				language: 'Solidity',
				hardfork: 'cancun',
				compilationOutput: ['abi'],
				solcVersion: '0.8.20',
				throwOnVersionMismatch: true,
				throwOnCompilationError: false,
			}

			const result = compileSourceInternal(mockSolc, SimpleContract.source, options, mockLogger)

			// Even with empty solc output, compileContracts creates an entry
			expect(result.compilationResult).toBeDefined()
			expect(result.compilationResult.contract).toEqual({})
		})

		it('should wrap source in anonymous path for compilation', () => {
			const options: ValidatedCompileBaseOptions = {
				language: 'Solidity',
				hardfork: 'cancun',
				compilationOutput: ['abi'],
				solcVersion: '0.8.20',
				throwOnVersionMismatch: true,
				throwOnCompilationError: false,
			}

			compileSourceInternal(mockSolc, SimpleContract.source, options, mockLogger)

			// Verify compileContracts was called with source wrapped in defaults.injectIntoContractPath
			expect(mockSolcCompile).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					sources: {
						[defaults.injectIntoContractPath]: {
							content: SimpleContract.source,
						},
					},
				}),
			)
		})
	})
})
