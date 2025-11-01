import { describe, expect, it } from 'vitest'
import { SimpleContract } from '../fixtures/index.js'
import { compileSourcesWithShadow } from './compileSourcesWithShadow.js'

describe('compileSourcesWithShadow', () => {
	describe('basic shadow injection', () => {
		it('should inject shadow code into target source in safe mode', async () => {
			const shadow = 'function shadowFunction() public {}'

			const result = await compileSourcesWithShadow(
				{
					'Main.sol': SimpleContract.source,
				},
				shadow,
				{
					sourceLanguage: 'Solidity',
					solcVersion: '0.8.20',
					injectIntoContractName: 'SimpleContract',
					shadowMergeStrategy: 'safe',
				},
			)

			expect(result).toBeDefined()
			expect(result.compilationResult['Main.sol']).toBeDefined()

			const mainAbi = result.compilationResult['Main.sol']?.contract['SimpleContract']?.abi
			expect(mainAbi?.some((item) => item.type === 'function' && item.name === 'shadowFunction')).toBe(true)
		})

		it('should inject shadow code into target source in replace mode', async () => {
			const shadow = 'function shadowFunction() public {}'

			const result = await compileSourcesWithShadow(
				{
					'Main.sol': SimpleContract.source,
				},
				shadow,
				{
					sourceLanguage: 'Solidity',
					solcVersion: '0.8.20',
					injectIntoContractName: 'SimpleContract',
					shadowMergeStrategy: 'replace',
				},
			)

			expect(result).toBeDefined()

			const mainAbi = result.compilationResult['Main.sol']?.contract['SimpleContract']?.abi
			expect(mainAbi?.some((item) => item.type === 'function' && item.name === 'shadowFunction')).toBe(true)
		})
	})

	describe('multi-source behavior', () => {
		it('should require injectIntoContractPath when multiple sources provided', async () => {
			await expect(
				compileSourcesWithShadow(
					{
						'A.sol': SimpleContract.source,
						'B.sol': SimpleContract.source,
					},
					'function test() public {}',
					{ sourceLanguage: 'Solidity', solcVersion: '0.8.20' },
				),
			).rejects.toThrow('injectIntoContractPath is required')
		})

		it('should accept optional injectIntoContractPath when single source provided', async () => {
			const result = await compileSourcesWithShadow(
				{
					'Single.sol': SimpleContract.source,
				},
				'function shadowFunction() public {}',
				{
					sourceLanguage: 'Solidity',
					solcVersion: '0.8.20',
					injectIntoContractName: 'SimpleContract',
				},
			)

			expect(result).toBeDefined()
			const abi = result.compilationResult['Single.sol']?.contract['SimpleContract']?.abi
			expect(abi?.some((item) => item.type === 'function' && item.name === 'shadowFunction')).toBe(true)
		})
	})

	describe('path validation', () => {
		it('should error when injectIntoContractPath not found in sources', async () => {
			await expect(
				compileSourcesWithShadow(
					{
						'A.sol': SimpleContract.source,
					},
					'function test() public {}',
					{
						sourceLanguage: 'Solidity',
						solcVersion: '0.8.20',
						injectIntoContractPath: 'B.sol',
					},
				),
			).rejects.toThrow('injectIntoContractPath is not a valid contract file')
		})

		it('should use first source path as default when single source and no path specified', async () => {
			const result = await compileSourcesWithShadow(
				{
					'Contract.sol': SimpleContract.source,
				},
				'function shadowFunction() public {}',
				{
					sourceLanguage: 'Solidity',
					solcVersion: '0.8.20',
					injectIntoContractName: 'SimpleContract',
				},
			)

			expect(result.compilationResult['Contract.sol']).toBeDefined()
		})
	})

	describe('safe mode injection', () => {
		it('should inject at original source location', async () => {
			const result = await compileSourcesWithShadow(
				{
					'Main.sol': SimpleContract.source,
				},
				'function getConstant() public pure returns (uint256) { return 42; }',
				{
					sourceLanguage: 'Solidity',
					solcVersion: '0.8.20',
					injectIntoContractName: 'SimpleContract',
					shadowMergeStrategy: 'safe',
				},
			)

			expect(result.compilationResult['Main.sol']?.contract['SimpleContract']).toBeDefined()
			const mainAbi = result.compilationResult['Main.sol']?.contract['SimpleContract']?.abi
			expect(mainAbi?.some((item) => item.type === 'function' && item.name === 'getConstant')).toBe(true)
		})
	})

	describe('replace mode injection', () => {
		it('should instrument target AST before injection', async () => {
			const result = await compileSourcesWithShadow(
				{
					'Main.sol': SimpleContract.source,
				},
				'function shadowFunction() public {}',
				{
					sourceLanguage: 'Solidity',
					solcVersion: '0.8.20',
					injectIntoContractName: 'SimpleContract',
					shadowMergeStrategy: 'replace',
				},
			)

			expect(result).toBeDefined()
			const mainContract = result.compilationResult['Main.sol']?.contract['SimpleContract']
			expect(mainContract).toBeDefined()
		})
	})

	describe('error handling', () => {
		it('should handle compilation errors in shadow code', async () => {
			const shadow = 'function shadowFunction() public { invalid_syntax }'

			const result = await compileSourcesWithShadow(
				{
					'Main.sol': SimpleContract.source,
				},
				shadow,
				{
					sourceLanguage: 'Solidity',
					solcVersion: '0.8.20',
					injectIntoContractName: 'SimpleContract',
					throwOnCompilationError: false,
				},
			)

			expect(result).toBeDefined()
			expect(result.errors).toBeDefined()
			expect(result.errors?.some((e) => e.severity === 'error')).toBe(true)
		})
	})

	describe('result structure', () => {
		it('should include shadowed target in result', async () => {
			const result = await compileSourcesWithShadow(
				{
					'Main.sol': SimpleContract.source,
				},
				'function shadowFunction() public {}',
				{
					sourceLanguage: 'Solidity',
					solcVersion: '0.8.20',
					injectIntoContractName: 'SimpleContract',
				},
			)

			expect(result.compilationResult['Main.sol']).toBeDefined()
			const mainAbi = result.compilationResult['Main.sol']?.contract['SimpleContract']?.abi
			expect(mainAbi?.some((item) => item.type === 'function' && item.name === 'shadowFunction')).toBe(true)
		})
	})
})
