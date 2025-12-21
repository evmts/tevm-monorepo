import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { compileFilesWithShadow } from './compileFilesWithShadow.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const SIMPLE_CONTRACT_PATH = join(__dirname, '../fixtures/SimpleContract.sol')

/**
 * Tests for compileFilesWithShadow function
 *
 * This file focuses on what's specific to compileFilesWithShadow:
 * 1. Injecting shadow code into files from filesystem
 * 2. Finding target contract by name across multiple files
 * 3. Safe and replace mode injection
 * 4. Error handling for ambiguous or missing contracts
 *
 * What we DON'T test here (covered by other test files):
 * - File reading logic (readSourceFiles.spec.ts)
 * - Multiple file compilation (compileFiles.spec.ts)
 * - Shadow option validation (validateShadowOptions.spec.ts)
 * - AST instrumentation (instrumentAst.spec.ts)
 * - Contract extraction (extractContractsFromAstNodes.spec.ts)
 * - Base compilation (compileContracts.spec.ts)
 */
describe('compileFilesWithShadow', () => {
	describe('basic shadow injection', () => {
		it('should inject shadow code into file in safe mode', async () => {
			const shadow = 'function shadowFunction() public {}'

			const result = await compileFilesWithShadow([SIMPLE_CONTRACT_PATH], shadow, {
				sourceLanguage: 'Solidity',
				shadowLanguage: 'Solidity',
				solcVersion: '0.8.20',
				injectIntoContractPath: SIMPLE_CONTRACT_PATH,
				injectIntoContractName: 'SimpleContract',
				shadowMergeStrategy: 'safe',
			})

			expect(result).toBeDefined()
			expect(result.compilationResult).toBeDefined()

			// Verify shadow function was injected
			const fileResult = Object.values(result.compilationResult)[0]
			const abi = fileResult?.contract['SimpleContract']?.abi
			expect(abi?.some((item) => item.type === 'function' && item.name === 'shadowFunction')).toBe(true)
		})

		it('should inject shadow code into file in replace mode', async () => {
			const shadow = 'function shadowFunction() public {}'

			const result = await compileFilesWithShadow([SIMPLE_CONTRACT_PATH], shadow, {
				sourceLanguage: 'Solidity',
				shadowLanguage: 'Solidity',
				solcVersion: '0.8.20',
				injectIntoContractPath: SIMPLE_CONTRACT_PATH,
				injectIntoContractName: 'SimpleContract',
				shadowMergeStrategy: 'replace',
			})

			expect(result).toBeDefined()
			const fileResult = Object.values(result.compilationResult)[0]
			const abi = fileResult?.contract['SimpleContract']?.abi
			expect(abi?.some((item) => item.type === 'function' && item.name === 'shadowFunction')).toBe(true)
		})
	})

	describe('contract name search', () => {
		it('should find contract by name when not specifying path', async () => {
			const shadow = 'function shadowFunction() public {}'

			const result = await compileFilesWithShadow([SIMPLE_CONTRACT_PATH], shadow, {
				sourceLanguage: 'Solidity',
				solcVersion: '0.8.20',
				// Only provide contract name, not path
				injectIntoContractName: 'SimpleContract',
				shadowMergeStrategy: 'safe',
			})

			expect(result).toBeDefined()
			const fileResult = Object.values(result.compilationResult)[0]
			const abi = fileResult?.contract['SimpleContract']?.abi
			expect(abi?.some((item) => item.type === 'function' && item.name === 'shadowFunction')).toBe(true)
		})
	})

	describe('error handling', () => {
		it('should handle compilation errors gracefully when throwOnCompilationError is false', async () => {
			const shadow = 'function shadowFunction() public { invalid_syntax }'

			const result = await compileFilesWithShadow([SIMPLE_CONTRACT_PATH], shadow, {
				sourceLanguage: 'Solidity',
				solcVersion: '0.8.20',
				injectIntoContractPath: SIMPLE_CONTRACT_PATH,
				injectIntoContractName: 'SimpleContract',
				throwOnCompilationError: false,
			})

			expect(result.errors).toBeDefined()
			expect(result.errors!.length).toBe(1)
			expect(result.errors![0]).toMatchObject({
				severity: 'error',
				type: 'ParserError',
				message: "Expected ';' but got '}'",
				component: 'general',
				errorCode: '2314',
			})
			// File path should end with the fixture file name
			expect(result.errors![0]?.sourceLocation?.file).toMatch(/SimpleContract\.sol$/)
			expect(result.errors![0]?.formattedMessage).toContain("Expected ';' but got '}'")
		})

		it('should throw when contract name not found in any file', async () => {
			const shadow = 'function shadowFunction() public {}'

			await expect(
				compileFilesWithShadow([SIMPLE_CONTRACT_PATH], shadow, {
					sourceLanguage: 'Solidity',
					solcVersion: '0.8.20',
					injectIntoContractName: 'NonExistentContract',
				}),
			).rejects.toThrowError(/Contract 'NonExistentContract' not found in file/)
		})
	})
})
