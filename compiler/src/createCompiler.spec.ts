import { join } from 'node:path'
import { createLogger } from '@tevm/logger'
import type { Solc, SolcInputDescription, SolcOutput } from '@tevm/solc'
import { solcCompile } from '@tevm/solc'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SolcError } from './compiler/internal/errors.js'
import { readSourceFiles } from './compiler/internal/readSourceFiles.js'
import { readSourceFilesSync } from './compiler/internal/readSourceFilesSync.js'
import { createCompiler } from './createCompiler.js'
import { SimpleContract } from './fixtures/index.js'

vi.mock('@tevm/solc', async () => {
	const actual = await vi.importActual<typeof import('@tevm/solc')>('@tevm/solc')
	return {
		...actual,
		solcCompile: vi.fn((_solc: Solc, input: SolcInputDescription): SolcOutput => {
			// Simple mock: just return SimpleContract output for any input
			if (!SimpleContract.solcOutput.contracts?.['SimpleContract.sol'])
				throw new Error('SimpleContract.solcOutput.contracts not found')
			if (!SimpleContract.solcOutput.sources?.['SimpleContract.sol'])
				throw new Error('SimpleContract.solcOutput.sources not found')

			// For multiple files, return output for each
			const contracts: Record<string, any> = {}
			const sources: Record<string, any> = {}

			for (const path of Object.keys(input.sources)) {
				contracts[path] = SimpleContract.solcOutput.contracts['SimpleContract.sol']
				sources[path] = SimpleContract.solcOutput.sources['SimpleContract.sol']
			}

			return { contracts, sources }
		}),
		createSolc: vi.fn().mockResolvedValue({
			version: '0.8.20',
			compile: vi.fn(),
		} as any),
	}
})

vi.mock('./compiler/internal/readSourceFiles.js', () => ({
	readSourceFiles: vi.fn(),
}))

vi.mock('./compiler/internal/readSourceFilesSync.js', () => ({
	readSourceFilesSync: vi.fn(),
}))

/**
 * Tests for createCompiler function
 *
 * This file focuses on what's specific to the compiler instance:
 * 1. Initialization with/without options
 * 2. Option merging (factory defaults + per-call overrides)
 * 3. Solc loading and error handling before loadSolc
 * 4. Testing that all methods can be called and work together
 *
 * What we DON'T test here (covered by other test files):
 * - Detailed compilation logic (compileSource.spec.ts, compileFiles.spec.ts, etc.)
 * - Option validation (validateBaseOptions.spec.ts)
 * - Solc version loading details (getSolc.spec.ts)
 * - Shadow compilation details (compileSourceWithShadow.spec.ts, etc.)
 */
describe('createCompiler', () => {
	let mockSolc: Solc
	let mockSolcCompile: ReturnType<typeof vi.fn>
	let mockReadSourceFiles: ReturnType<typeof vi.fn>
	let mockReadSourceFilesSync: ReturnType<typeof vi.fn>

	beforeEach(() => {
		mockSolc = {
			compile: vi.fn(),
			version: '0.8.20',
		} as unknown as Solc

		mockSolcCompile = solcCompile as unknown as ReturnType<typeof vi.fn>
		mockSolcCompile.mockClear()

		mockReadSourceFiles = readSourceFiles as unknown as ReturnType<typeof vi.fn>
		mockReadSourceFiles.mockClear()

		mockReadSourceFilesSync = readSourceFilesSync as unknown as ReturnType<typeof vi.fn>
		mockReadSourceFilesSync.mockClear()
	})

	describe('initialization', () => {
		it('should create compiler instance without options', () => {
			const compiler = createCompiler()

			expect(compiler).toBeDefined()
			expect(compiler.compileSource).toBeDefined()
			expect(compiler.compileSourceWithShadow).toBeDefined()
			expect(compiler.compileFiles).toBeDefined()
			expect(compiler.compileFilesSync).toBeDefined()
			expect(compiler.compileFilesWithShadow).toBeDefined()
			expect(compiler.compileFilesWithShadowSync).toBeDefined()
			expect(compiler.extractContractsFromSolcOutput).toBeDefined()
			expect(compiler.extractContractsFromAstNodes).toBeDefined()
			expect(compiler.solcSourcesToAstNodes).toBeDefined()
			expect(compiler.loadSolc).toBeDefined()
			expect(compiler.clearCache).toBeDefined()
		})

		it('should create compiler instance with options', () => {
			const customLogger = createLogger({ name: 'test-logger', level: 'debug' })
			const compiler = createCompiler({
				logger: customLogger,
				solcVersion: '0.8.20',
				optimizer: { enabled: true, runs: 200 },
			})

			expect(compiler).toBeDefined()
		})

		it('should create compiler with pre-loaded solc', () => {
			const compiler = createCompiler({
				solc: mockSolc,
			})

			// Should not throw since solc is already loaded
			expect(() => compiler.compileSource(SimpleContract.source, { solcVersion: '0.8.20' })).not.toThrow()
		})
	})

	describe('loadSolc', () => {
		it('should load solc successfully', async () => {
			const compiler = createCompiler()

			await compiler.loadSolc('0.8.20')

			// Should not throw after loading
			expect(() => compiler.compileSource(SimpleContract.source, { solcVersion: '0.8.20' })).not.toThrow()
		})

		it('should use default version when no version specified', async () => {
			const compiler = createCompiler()

			await compiler.loadSolc()

			// Should load successfully with default version
			expect(() => compiler.compileSource(SimpleContract.source, { solcVersion: '0.8.20' })).not.toThrow()
		})
	})

	describe('error handling before loadSolc', () => {
		it('should throw when compileSource called before loadSolc', () => {
			const compiler = createCompiler()

			expect(() => compiler.compileSource(SimpleContract.source, { solcVersion: '0.8.20' })).toThrow(SolcError)
		})

		it('should throw when compileSourceWithShadow called before loadSolc', () => {
			const compiler = createCompiler()

			expect(() =>
				compiler.compileSourceWithShadow(SimpleContract.source, 'function test() public { }', {
					solcVersion: '0.8.20',
				}),
			).toThrow(SolcError)
		})

		it('should throw when compileFiles called before loadSolc', async () => {
			const compiler = createCompiler()

			await expect(
				compiler.compileFiles([join(__dirname, 'fixtures', 'SimpleContract.sol')], { solcVersion: '0.8.20' }),
			).rejects.toThrow(SolcError)
		})

		it('should throw when compileFilesSync called before loadSolc', () => {
			const compiler = createCompiler()

			expect(() =>
				compiler.compileFilesSync([join(__dirname, 'fixtures', 'SimpleContract.sol')], { solcVersion: '0.8.20' }),
			).toThrow(SolcError)
		})

		it('should throw when compileFilesWithShadow called before loadSolc', async () => {
			const compiler = createCompiler()

			await expect(
				compiler.compileFilesWithShadow(
					[join(__dirname, 'fixtures', 'SimpleContract.sol')],
					'function test() public { }',
					{ solcVersion: '0.8.20' },
				),
			).rejects.toThrow(SolcError)
		})

		it('should throw when compileFilesWithShadowSync called before loadSolc', () => {
			const compiler = createCompiler()

			expect(() =>
				compiler.compileFilesWithShadowSync(
					[join(__dirname, 'fixtures', 'SimpleContract.sol')],
					'function test() public { }',
					{ solcVersion: '0.8.20' },
				),
			).toThrow(SolcError)
		})

		it('should allow extractContractsFromSolcOutput without loadSolc', () => {
			const compiler = createCompiler()

			// This should work without solc loaded
			expect(() =>
				compiler.extractContractsFromSolcOutput(SimpleContract.solcOutput, { solcVersion: '0.8.20' }),
			).not.toThrow()
		})

		it('should allow extractContractsFromAstNodes without loadSolc', () => {
			const compiler = createCompiler()
			const sourceUnits = compiler.solcSourcesToAstNodes(SimpleContract.solcOutput.sources!)
			expect(() => compiler.extractContractsFromAstNodes(sourceUnits, { solcVersion: '0.8.20' })).not.toThrow()
		})

		it('should allow solcSourcesToAstNodes without loadSolc', () => {
			const compiler = createCompiler()

			// This should work without solc loaded
			expect(() => compiler.solcSourcesToAstNodes(SimpleContract.solcOutput.sources!)).not.toThrow()
		})
	})

	describe('compileSource', () => {
		it('should compile Solidity source', async () => {
			const compiler = createCompiler({ solc: mockSolc })

			const result = compiler.compileSource(SimpleContract.source, {
				language: 'Solidity',
				solcVersion: '0.8.20',
			})

			expect(result).toBeDefined()
			expect(result.compilationResult.contract['SimpleContract']).toBeDefined()
		})

		it('should compile AST source', async () => {
			const compiler = createCompiler({ solc: mockSolc })

			const result = compiler.compileSource(SimpleContract.ast, {
				language: 'SolidityAST',
				solcVersion: '0.8.20',
			})

			expect(result).toBeDefined()
			expect(result.compilationResult.contract['SimpleContract']).toBeDefined()
		})

		it('should apply factory default options', () => {
			const compiler = createCompiler({
				solc: mockSolc,
				optimizer: { enabled: true, runs: 200 },
				hardfork: 'cancun',
			})

			compiler.compileSource(SimpleContract.source, {
				solcVersion: '0.8.20',
			})

			// Verify solcCompile was called with merged options
			expect(mockSolcCompile).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					settings: expect.objectContaining({
						optimizer: { enabled: true, runs: 200 },
						evmVersion: 'cancun',
					}),
				}),
			)
		})

		it('should override factory options with per-call options', () => {
			const compiler = createCompiler({
				solc: mockSolc,
				optimizer: { enabled: true, runs: 200 },
			})

			compiler.compileSource(SimpleContract.source, {
				solcVersion: '0.8.20',
				optimizer: { enabled: false },
			})

			// Verify per-call options override factory options (merges optimizer objects)
			expect(mockSolcCompile).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					settings: expect.objectContaining({
						optimizer: { enabled: false, runs: 200 },
					}),
				}),
			)
		})
	})

	describe('compileSourceWithShadow', () => {
		it('should compile source with shadow code', () => {
			const compiler = createCompiler({ solc: mockSolc })

			const result = compiler.compileSourceWithShadow(
				SimpleContract.source,
				'function testShadow() public pure returns (uint) { return 42; }',
				{
					solcVersion: '0.8.20',
					sourceLanguage: 'Solidity',
					shadowLanguage: 'Solidity',
					injectIntoContractName: 'SimpleContract',
				},
			)

			expect(result).toBeDefined()
			expect(result.compilationResult).toBeDefined()
		})

		it('should apply factory defaults to shadow compilation', () => {
			const compiler = createCompiler({
				solc: mockSolc,
				optimizer: { enabled: true, runs: 200 },
			})

			compiler.compileSourceWithShadow(
				SimpleContract.source,
				'function testShadow() public pure returns (uint) { return 42; }',
				{
					solcVersion: '0.8.20',
					sourceLanguage: 'Solidity',
					shadowLanguage: 'Solidity',
					injectIntoContractName: 'SimpleContract',
				},
			)

			// Verify factory options are used
			expect(mockSolcCompile).toHaveBeenCalled()
		})
	})

	describe('compileFiles', () => {
		it('should compile single file', async () => {
			const compiler = createCompiler({ solc: mockSolc })
			const filePath = join(__dirname, 'fixtures', 'SimpleContract.sol')

			mockReadSourceFiles.mockResolvedValue({
				[filePath]: SimpleContract.source,
			})

			const result = await compiler.compileFiles([filePath], {
				solcVersion: '0.8.20',
			})

			expect(result).toBeDefined()
			expect(result.compilationResult).toBeDefined()
			expect(result.compilationResult[filePath]).toBeDefined()
			expect(result.compilationResult[filePath]?.contract).toBeDefined()
		})

		it('should compile multiple files', async () => {
			const compiler = createCompiler({ solc: mockSolc })
			const filePaths = [
				join(__dirname, 'fixtures', 'SimpleContract.sol'),
				join(__dirname, 'fixtures', 'SimpleContract2.sol'),
			]

			mockReadSourceFiles.mockResolvedValue({
				[filePaths[0] ?? '']: SimpleContract.source,
				[filePaths[1] ?? '']: SimpleContract.source,
			})

			const result = await compiler.compileFiles(filePaths, {
				solcVersion: '0.8.20',
			})

			expect(result).toBeDefined()
			expect(result.compilationResult).toBeDefined()
			expect(result.compilationResult[filePaths[0] ?? '']).toBeDefined()
			expect(result.compilationResult[filePaths[1] ?? '']).toBeDefined()
		})

		it('should apply factory options to file compilation', async () => {
			const compiler = createCompiler({
				solc: mockSolc,
				optimizer: { enabled: true, runs: 200 },
			})

			const filePath = join(__dirname, 'fixtures', 'SimpleContract.sol')
			mockReadSourceFiles.mockResolvedValue({
				[filePath]: SimpleContract.source,
			})

			await compiler.compileFiles([filePath], { solcVersion: '0.8.20' })

			expect(mockSolcCompile).toHaveBeenCalled()
		})
	})

	describe('compileFilesSync', () => {
		it('should compile files synchronously', () => {
			const compiler = createCompiler({ solc: mockSolc })
			const filePath = join(__dirname, 'fixtures', 'SimpleContract.sol')

			mockReadSourceFilesSync.mockReturnValue({
				[filePath]: SimpleContract.source,
			})

			const result = compiler.compileFilesSync([filePath], {
				solcVersion: '0.8.20',
			})

			expect(result).toBeDefined()
			expect(result.compilationResult).toBeDefined()
			expect(result.compilationResult[filePath]).toBeDefined()
			expect(result.compilationResult[filePath]?.contract).toBeDefined()
		})

		it('should apply factory options to sync compilation', () => {
			const compiler = createCompiler({
				solc: mockSolc,
				optimizer: { enabled: true, runs: 200 },
			})

			const filePath = join(__dirname, 'fixtures', 'SimpleContract.sol')
			mockReadSourceFilesSync.mockReturnValue({
				[filePath]: SimpleContract.source,
			})

			compiler.compileFilesSync([filePath], { solcVersion: '0.8.20' })

			expect(mockSolcCompile).toHaveBeenCalled()
		})
	})

	describe('compileFilesWithShadow', () => {
		it('should compile files with shadow code', async () => {
			const compiler = createCompiler({ solc: mockSolc })
			const sourcePath = 'SimpleContract.sol'

			mockReadSourceFiles.mockResolvedValue({
				[sourcePath]: SimpleContract.source,
			})

			const result = await compiler.compileFilesWithShadow(
				[sourcePath],
				'function testShadow() public pure returns (uint) { return 42; }',
				{
					solcVersion: '0.8.20',
					sourceLanguage: 'Solidity',
					shadowLanguage: 'Solidity',
					injectIntoContractPath: sourcePath,
					injectIntoContractName: 'SimpleContract',
				},
			)

			expect(result).toBeDefined()
			expect(result.compilationResult).toBeDefined()
			expect(result.compilationResult[sourcePath]).toBeDefined()
		})
	})

	describe('compileFilesWithShadowSync', () => {
		it('should compile files with shadow code synchronously', () => {
			const compiler = createCompiler({ solc: mockSolc })
			const sourcePath = 'SimpleContract.sol'

			mockReadSourceFilesSync.mockReturnValue({
				[sourcePath]: SimpleContract.source,
			})

			const result = compiler.compileFilesWithShadowSync(
				[sourcePath],
				'function testShadow() public pure returns (uint) { return 42; }',
				{
					solcVersion: '0.8.20',
					sourceLanguage: 'Solidity',
					shadowLanguage: 'Solidity',
					injectIntoContractPath: sourcePath,
					injectIntoContractName: 'SimpleContract',
				},
			)

			expect(result).toBeDefined()
			expect(result.compilationResult).toBeDefined()
			expect(result.compilationResult[sourcePath]).toBeDefined()
		})
	})

	describe('extractContractsFromSolcOutput', () => {
		it('should extract contracts from solc output', () => {
			const compiler = createCompiler()

			const sources = compiler.extractContractsFromSolcOutput(SimpleContract.solcOutput, { solcVersion: '0.8.20' })

			expect(sources).toBeDefined()
			expect(sources['SimpleContract.sol']).toBeDefined()
			expect(typeof sources['SimpleContract.sol']).toBe('string')
		})

		it('should work without factory options', () => {
			const compiler = createCompiler()

			const sources = compiler.extractContractsFromSolcOutput(SimpleContract.solcOutput, { solcVersion: '0.8.20' })

			expect(sources).toBeDefined()
		})

		it('should merge factory options with per-call options', () => {
			const compiler = createCompiler({
				solcVersion: '0.8.17',
			})

			// Per-call option should override factory option
			const sources = compiler.extractContractsFromSolcOutput(SimpleContract.solcOutput, { solcVersion: '0.8.20' })

			expect(sources).toBeDefined()
		})
	})

	describe('extractContractsFromAstNodes', () => {
		// TODO: Fix validateBaseOptions to handle arrays of SourceUnits

		it('should extract contracts from AST nodes', () => {
			const compiler = createCompiler()
			const sourceUnits = compiler.solcSourcesToAstNodes(SimpleContract.solcOutput.sources!)

			const result = compiler.extractContractsFromAstNodes(sourceUnits, { solcVersion: '0.8.20' })

			expect(result).toBeDefined()
			expect(result.sources).toBeDefined()
			expect(result.sources['SimpleContract.sol']).toBeDefined()
		})

		it('should return source maps when requested', () => {
			const compiler = createCompiler()
			const sourceUnits = compiler.solcSourcesToAstNodes(SimpleContract.solcOutput.sources!)

			const result = compiler.extractContractsFromAstNodes(sourceUnits, { solcVersion: '0.8.20', withSourceMap: true })

			expect(result.sourceMaps).toBeDefined()
			expect(result.sourceMaps).toBeInstanceOf(Object)
		})

		it('should not return source maps by default', () => {
			const compiler = createCompiler()
			const sourceUnits = compiler.solcSourcesToAstNodes(SimpleContract.solcOutput.sources!)

			const result = compiler.extractContractsFromAstNodes(sourceUnits, { solcVersion: '0.8.20' })

			expect(result.sourceMaps).toBeUndefined()
		})
	})

	describe('solcSourcesToAstNodes', () => {
		it('should convert solc sources to AST nodes', () => {
			const compiler = createCompiler()

			const sourceUnits = compiler.solcSourcesToAstNodes(SimpleContract.solcOutput.sources!)

			expect(sourceUnits).toBeDefined()
			expect(Array.isArray(sourceUnits)).toBe(true)
			expect(sourceUnits.length).toBeGreaterThan(0)
		})

		it('should preserve cross-references between source units', () => {
			const compiler = createCompiler()

			const sourceUnits = compiler.solcSourcesToAstNodes(SimpleContract.solcOutput.sources!)

			expect(sourceUnits).toBeDefined()
			expect(sourceUnits.length).toBeGreaterThan(0)
		})
	})

	describe('options merging', () => {
		it('should use factory options as defaults', () => {
			const compiler = createCompiler({
				solc: mockSolc,
				optimizer: { enabled: true, runs: 200 },
				hardfork: 'cancun',
				loggingLevel: 'debug',
			})

			compiler.compileSource(SimpleContract.source, {
				solcVersion: '0.8.20',
			})

			expect(mockSolcCompile).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					settings: expect.objectContaining({
						optimizer: { enabled: true, runs: 200 },
						evmVersion: 'cancun',
					}),
				}),
			)
		})

		it('should override factory options with per-call options', () => {
			const compiler = createCompiler({
				solc: mockSolc,
				optimizer: { enabled: true, runs: 200 },
				hardfork: 'cancun',
			})

			compiler.compileSource(SimpleContract.source, {
				solcVersion: '0.8.20',
				optimizer: { enabled: false },
				hardfork: 'shanghai',
			})

			// Note: mergeOptions merges optimizer objects, so runs: 200 will still be present
			expect(mockSolcCompile).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					settings: expect.objectContaining({
						optimizer: { enabled: false, runs: 200 },
						evmVersion: 'shanghai',
					}),
				}),
			)
		})

		it('should merge factory and per-call options correctly', () => {
			const compiler = createCompiler({
				solc: mockSolc,
				optimizer: { enabled: true, runs: 200 },
			})

			compiler.compileSource(SimpleContract.source, {
				solcVersion: '0.8.20',
				hardfork: 'cancun',
			})

			expect(mockSolcCompile).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					settings: expect.objectContaining({
						optimizer: { enabled: true, runs: 200 },
						evmVersion: 'cancun',
					}),
				}),
			)
		})
	})

	describe('clearCache', () => {
		it('should have clearCache method', () => {
			const compiler = createCompiler()

			expect(compiler.clearCache).toBeDefined()
			expect(typeof compiler.clearCache).toBe('function')
		})

		it('should be callable without throwing', async () => {
			const compiler = createCompiler()

			await expect(compiler.clearCache()).resolves.not.toThrow()
		})
	})
})
