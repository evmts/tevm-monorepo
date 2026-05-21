import type { Solc, SolcInputDescription, SolcOutput } from '@tevm/solc'
import { describe, expect, it, vi } from 'vitest'
import { ComprehensiveContract, SimpleContract, SimpleYul } from '../fixtures/index.js'
import { compileSources } from './compileSources.js'

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

			for (const [sourcePath, sourceContent] of Object.entries(sources)) {
				if (!sourceContent) continue

				if ('content' in sourceContent && sourceContent.content === SimpleContract.source) {
					if (!SimpleContract.solcOutput.contracts?.['SimpleContract.sol'])
						throw new Error('SimpleContract.solcOutput.contracts not found')
					if (!SimpleContract.solcOutput.sources?.['SimpleContract.sol'])
						throw new Error('SimpleContract.solcOutput.sources not found')
					result.contracts![sourcePath] = SimpleContract.solcOutput.contracts['SimpleContract.sol']
					result.sources![sourcePath] = SimpleContract.solcOutput.sources['SimpleContract.sol']
				} else if ('content' in sourceContent && sourceContent.content === ComprehensiveContract.source) {
					if (!ComprehensiveContract.solcOutput.contracts?.['ComprehensiveContract.sol'])
						throw new Error('ComprehensiveContract.solcOutput.contracts not found')
					if (!ComprehensiveContract.solcOutput.sources?.['ComprehensiveContract.sol'])
						throw new Error('ComprehensiveContract.solcOutput.sources not found')
					result.contracts![sourcePath] = ComprehensiveContract.solcOutput.contracts['ComprehensiveContract.sol']
					result.sources![sourcePath] = ComprehensiveContract.solcOutput.sources['ComprehensiveContract.sol']
				} else if ('content' in sourceContent && sourceContent.content === SimpleYul.source) {
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

describe('compileSources', () => {
	describe('basic compilation flow', () => {
		it('should compile single source and return correct structure', async () => {
			const result = await compileSources(
				{
					'contracts/Token.sol': SimpleContract.source,
				},
				{
					language: 'Solidity',
					solcVersion: '0.8.20',
				},
			)

			expect(result).toBeDefined()
			expect(result.compilationResult).toBeDefined()
			expect(result.compilationResult['contracts/Token.sol']).toBeDefined()
			expect(result.compilationResult['contracts/Token.sol']?.contract).toBeDefined()
			expect(result.compilationResult['contracts/Token.sol']?.contract['SimpleContract']).toBeDefined()
		})

		it('should compile multiple Solidity sources and return all results', async () => {
			const result = await compileSources(
				{
					'contracts/Simple.sol': SimpleContract.source,
					'contracts/Comprehensive.sol': ComprehensiveContract.source,
				},
				{
					language: 'Solidity',
					solcVersion: '0.8.20',
				},
			)

			expect(result).toBeDefined()
			expect(result.compilationResult).toBeDefined()
			expect(Object.keys(result.compilationResult).length).toBe(2)
			expect(result.compilationResult['contracts/Simple.sol']).toBeDefined()
			expect(result.compilationResult['contracts/Comprehensive.sol']).toBeDefined()
			expect(result.compilationResult['contracts/Simple.sol']?.contract['SimpleContract']).toBeDefined()
			expect(result.compilationResult['contracts/Comprehensive.sol']?.contract['ComprehensiveContract']).toBeDefined()
		})

		it('should compile Yul sources', async () => {
			const result = await compileSources(
				{
					'contracts/SimpleYul.yul': SimpleYul.source,
				},
				{
					language: 'Yul',
					solcVersion: '0.8.20',
				},
			)

			expect(result).toBeDefined()
			expect(result.compilationResult['contracts/SimpleYul.yul']).toBeDefined()
			expect(result.compilationResult['contracts/SimpleYul.yul']?.contract['SimpleYul']).toBeDefined()
			expect(result.compilationResult['contracts/SimpleYul.yul']?.ast?.nodeType).toBe('YulObject')
		})

		it('should preserve source path keys in result', async () => {
			const sources = {
				'path/to/First.sol': SimpleContract.source,
				'different/path/Second.sol': ComprehensiveContract.source,
			}

			const result = await compileSources(sources, {
				language: 'Solidity',
				solcVersion: '0.8.20',
			})

			expect(Object.keys(result.compilationResult)).toEqual(['path/to/First.sol', 'different/path/Second.sol'])
		})
	})

	describe('result structure', () => {
		it('should return mapping of source paths to compilation results', async () => {
			const result = await compileSources(
				{
					'Main.sol': SimpleContract.source,
					'Helper.sol': ComprehensiveContract.source,
				},
				{
					language: 'Solidity',
					solcVersion: '0.8.20',
				},
			)

			expect(result.compilationResult).toMatchObject({
				'Main.sol': {
					contract: expect.any(Object),
				},
				'Helper.sol': {
					contract: expect.any(Object),
				},
			})
		})

		it('should include AST for each source when requested', async () => {
			const result = await compileSources(
				{
					'Contract.sol': SimpleContract.source,
				},
				{
					solcVersion: '0.8.20',
					compilationOutput: ['ast', 'abi'],
				},
			)

			expect(result.compilationResult['Contract.sol']?.ast).toBeDefined()
			expect(result.compilationResult['Contract.sol']?.ast.nodeType).toBe('SourceUnit')
		})

		it('should include only requested outputs', async () => {
			const result = await compileSources(
				{
					'Contract.sol': SimpleContract.source,
				},
				{
					solcVersion: '0.8.20',
					compilationOutput: ['abi'],
				},
			)

			expect(result.compilationResult['Contract.sol']?.contract['SimpleContract']?.abi).toBeDefined()
			expect(result.compilationResult['Contract.sol']?.ast).toBeUndefined()
		})
	})

	describe('compilation output options', () => {
		it('should compile with various output selections', async () => {
			const result = await compileSources(
				{
					'Contract.sol': SimpleContract.source,
				},
				{
					language: 'Solidity',
					solcVersion: '0.8.20',
					compilationOutput: ['abi', 'evm.bytecode', 'ast'],
				},
			)

			const contractResult = result.compilationResult['Contract.sol']
			expect(contractResult?.ast).toBeDefined()
			expect(contractResult?.contract['SimpleContract']?.abi).toBeDefined()
			expect(contractResult?.contract['SimpleContract']?.evm?.bytecode).toBeDefined()
		})

		it('should handle ast-only compilation', async () => {
			const result = await compileSources(
				{
					'Contract.sol': SimpleContract.source,
				},
				{
					language: 'Solidity',
					solcVersion: '0.8.20',
					compilationOutput: ['ast'],
				},
			)

			expect(result.compilationResult['Contract.sol']?.ast).toBeDefined()
		})
	})

	describe('edge cases', () => {
		it('should handle single source (equivalent to compileSource)', async () => {
			const result = await compileSources(
				{
					'Single.sol': SimpleContract.source,
				},
				{
					language: 'Solidity',
					solcVersion: '0.8.20',
				},
			)

			expect(result.compilationResult['Single.sol']).toBeDefined()
			expect(result.compilationResult['Single.sol']?.contract['SimpleContract']).toBeDefined()
		})

		it('should handle empty sources object', async () => {
			const result = await compileSources(
				{},
				{
					language: 'Solidity',
					solcVersion: '0.8.20',
				},
			)

			expect(result.compilationResult).toEqual({})
		})

		it('should handle sources with relative import paths', async () => {
			const result = await compileSources(
				{
					'./contracts/Main.sol': SimpleContract.source,
					'./contracts/lib/Helper.sol': ComprehensiveContract.source,
				},
				{
					language: 'Solidity',
					solcVersion: '0.8.20',
				},
			)

			expect(result.compilationResult['./contracts/Main.sol']).toBeDefined()
			expect(result.compilationResult['./contracts/lib/Helper.sol']).toBeDefined()
		})
	})
})
