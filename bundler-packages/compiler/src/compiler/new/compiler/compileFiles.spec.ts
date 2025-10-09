import type { Solc, SolcInputDescription, SolcOutput } from '@tevm/solc'
import { solcCompile } from '@tevm/solc'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ComprehensiveContract, SimpleContract, SimpleYul } from '../fixtures/index.js'
import { compileFiles } from './compileFiles.js'
import { readSourceFiles } from './internal/readSourceFiles.js'

vi.mock('@tevm/solc', async () => {
	const actual = await vi.importActual<typeof import('@tevm/solc')>('@tevm/solc')
	const { SimpleContract, SimpleYul, ComprehensiveContract } = await import('../fixtures/index.js')

	return {
		...actual,
		solcCompile: vi.fn((_solc: Solc, input: SolcInputDescription): SolcOutput => {
			const sources = input.sources
			const result: SolcOutput = {
				contracts: {},
				sources: {},
			}

			// Handle multiple sources
			for (const [sourcePath, sourceContent] of Object.entries(sources)) {
				if (!sourceContent) continue

				// Check SimpleContract
				if ('content' in sourceContent && sourceContent.content === SimpleContract.source) {
					if (!SimpleContract.solcOutput.contracts?.['SimpleContract.sol'])
						throw new Error('SimpleContract.solcOutput.contracts not found')
					if (!SimpleContract.solcOutput.sources?.['SimpleContract.sol'])
						throw new Error('SimpleContract.solcOutput.sources not found')
					result.contracts![sourcePath] = SimpleContract.solcOutput.contracts['SimpleContract.sol']
					result.sources![sourcePath] = SimpleContract.solcOutput.sources['SimpleContract.sol']
				}
				// Check ComprehensiveContract
				else if ('content' in sourceContent && sourceContent.content === ComprehensiveContract.source) {
					if (!ComprehensiveContract.solcOutput.contracts?.['ComprehensiveContract.sol'])
						throw new Error('ComprehensiveContract.solcOutput.contracts not found')
					if (!ComprehensiveContract.solcOutput.sources?.['ComprehensiveContract.sol'])
						throw new Error('ComprehensiveContract.solcOutput.sources not found')
					result.contracts![sourcePath] = ComprehensiveContract.solcOutput.contracts['ComprehensiveContract.sol']
					result.sources![sourcePath] = ComprehensiveContract.solcOutput.sources['ComprehensiveContract.sol']
				}
				// Check SimpleYul
				else if ('content' in sourceContent && sourceContent.content === SimpleYul.source) {
					if (!SimpleYul.solcOutput.contracts?.['SimpleYul.yul'])
						throw new Error('SimpleYul.solcOutput.contracts not found')
					if (!SimpleYul.solcOutput.sources?.['SimpleYul.yul'])
						throw new Error('SimpleYul.solcOutput.sources not found')
					result.contracts![sourcePath] = SimpleYul.solcOutput.contracts['SimpleYul.yul']
					result.sources![sourcePath] = SimpleYul.solcOutput.sources['SimpleYul.yul']
				}
			}

			return result
		}),
		createSolc: vi.fn().mockResolvedValue({
			version: '0.8.20',
			compile: vi.fn(),
		} as any),
	}
})

vi.mock('./internal/readSourceFiles.js', () => ({
	readSourceFiles: vi.fn(),
}))

/**
 * Tests for compileFiles function
 *
 * This file focuses on what's specific to compileFiles:
 * 1. Reading multiple files from filesystem
 * 2. Aggregating sources for compilation
 * 3. Compiling multiple files together
 * 4. Handling different file types (Solidity, Yul)
 *
 * What we DON'T test here (covered by other test files):
 * - File reading logic (readSourceFiles.spec.ts)
 * - Option validation (validateBaseOptions.spec.ts)
 * - Solc version loading (getSolc.spec.ts)
 * - Contract compilation details (compileContracts.spec.ts)
 */
describe('compileFiles', () => {
	let mockSolcCompile: ReturnType<typeof vi.fn>
	let mockReadSourceFiles: ReturnType<typeof vi.fn>

	beforeEach(() => {
		mockSolcCompile = solcCompile as unknown as ReturnType<typeof vi.fn>
		mockSolcCompile.mockClear()

		mockReadSourceFiles = readSourceFiles as unknown as ReturnType<typeof vi.fn>
		mockReadSourceFiles.mockClear()
	})

	describe('basic compilation flow', () => {
		it('should compile single file and return correct structure', async () => {
			mockReadSourceFiles.mockResolvedValue({
				'./contracts/SimpleContract.sol': SimpleContract.source,
			})

			const result = await compileFiles(['./contracts/SimpleContract.sol'], {
				language: 'Solidity',
				solcVersion: '0.8.20',
			})

			expect(result).toBeDefined()
			expect(result.compilationResult).toBeDefined()
			expect(result.compilationResult['./contracts/SimpleContract.sol']).toBeDefined()
			expect(result.compilationResult['./contracts/SimpleContract.sol']?.contract).toBeDefined()
			expect(result.compilationResult['./contracts/SimpleContract.sol']?.contract['SimpleContract']).toBeDefined()

			expect(mockReadSourceFiles).toHaveBeenCalledWith(
				['./contracts/SimpleContract.sol'],
				'Solidity',
				expect.anything(),
			)
			expect(mockSolcCompile).toHaveBeenCalledOnce()
		})

		it('should compile multiple files and return all results', async () => {
			mockReadSourceFiles.mockResolvedValue({
				'./contracts/SimpleContract.sol': SimpleContract.source,
				'./contracts/ComprehensiveContract.sol': ComprehensiveContract.source,
			})

			const result = await compileFiles(['./contracts/SimpleContract.sol', './contracts/ComprehensiveContract.sol'], {
				language: 'Solidity',
				solcVersion: '0.8.20',
			})

			expect(result).toBeDefined()
			expect(result.compilationResult).toBeDefined()
			expect(Object.keys(result.compilationResult).length).toBe(2)
			expect(result.compilationResult['./contracts/SimpleContract.sol']).toBeDefined()
			expect(result.compilationResult['./contracts/ComprehensiveContract.sol']).toBeDefined()
		})

		it('should compile Yul files', async () => {
			mockReadSourceFiles.mockResolvedValue({
				'./contracts/SimpleYul.yul': SimpleYul.source,
			})

			const result = await compileFiles(['./contracts/SimpleYul.yul'], {
				language: 'Yul',
				solcVersion: '0.8.20',
			})

			expect(result).toBeDefined()
			expect(result.compilationResult['./contracts/SimpleYul.yul']).toBeDefined()
			expect(result.compilationResult['./contracts/SimpleYul.yul']?.contract['SimpleYul']).toBeDefined()
			expect(result.compilationResult['./contracts/SimpleYul.yul']?.ast?.nodeType).toBe('YulObject')
		})
	})

	describe('result structure', () => {
		it('should include AST when requested in compilationOutput', async () => {
			mockReadSourceFiles.mockResolvedValue({
				'SimpleContract.sol': SimpleContract.source,
			})

			const result = await compileFiles(['SimpleContract.sol'], {
				solcVersion: '0.8.20',
				compilationOutput: ['ast', 'abi'],
			})

			expect(result.compilationResult['SimpleContract.sol']?.ast).toBeDefined()
			expect(result.compilationResult['SimpleContract.sol']?.ast.nodeType).toBe('SourceUnit')
		})

		it('should preserve file path keys in result', async () => {
			const paths = ['./contracts/file1.sol', './contracts/file2.sol']
			mockReadSourceFiles.mockResolvedValue({
				'./contracts/file1.sol': SimpleContract.source,
				'./contracts/file2.sol': ComprehensiveContract.source,
			})

			const result = await compileFiles(paths, {
				solcVersion: '0.8.20',
			})

			expect(Object.keys(result.compilationResult)).toEqual(['./contracts/file1.sol', './contracts/file2.sol'])
		})
	})

	describe('error handling', () => {
		it('should handle compilation errors gracefully when throwOnCompilationError is false', async () => {
			mockReadSourceFiles.mockResolvedValue({
				'Contract.sol': SimpleContract.source,
			})

			mockSolcCompile.mockImplementationOnce(() => ({
				errors: [
					{
						severity: 'error',
						message: 'Compilation failed',
						type: 'TypeError',
						component: 'general',
						formattedMessage: 'TypeError: Compilation failed',
						sourceLocation: {
							file: 'Contract.sol',
							start: 0,
							end: 10,
						},
					},
				],
				contracts: {
					'Contract.sol': {},
				},
				sources: {
					'Contract.sol': {
						id: 0,
						ast: {
							nodeType: 'SourceUnit',
							nodes: [],
							src: '0:0:0',
							absolutePath: 'Contract.sol',
							id: 0,
							exportedSymbols: {},
						},
					},
				},
			}))

			const result = await compileFiles(['Contract.sol'], {
				solcVersion: '0.8.20',
				throwOnCompilationError: false,
			})

			expect(result.errors).toBeDefined()
			expect(result.errors!.length).toBeGreaterThan(0)
			expect(result.errors!.some((e) => e.severity === 'error')).toBe(true)
		})

		it('should propagate file reading errors', async () => {
			mockReadSourceFiles.mockRejectedValue(new Error('File not found'))

			await expect(
				compileFiles(['./nonexistent.sol'], {
					solcVersion: '0.8.20',
				}),
			).rejects.toThrow('File not found')
		})
	})
})
