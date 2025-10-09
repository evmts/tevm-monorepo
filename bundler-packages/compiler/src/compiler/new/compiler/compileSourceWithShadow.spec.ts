import { describe, expect, it } from 'vitest'
import { SimpleContract } from '../fixtures/index.js'
import { compileSourceWithShadow } from './compileSourceWithShadow.js'

/**
 * Tests for compileSourceWithShadow function
 *
 * This file focuses on what's specific to compileSourceWithShadow:
 * 1. Injecting shadow code into a single source
 * 2. Safe mode: direct injection at original source location
 * 3. Replace mode: instrumentation + injection at instrumented location
 * 4. Error handling for missing injection points
 * 5. Handling different source languages (Solidity, SolidityAST)
 *
 * What we DON'T test here (covered by other test files):
 * - Shadow option validation (validateShadowOptions.spec.ts)
 * - AST instrumentation (instrumentAst.spec.ts)
 * - Contract extraction (extractContractsFromAstNodes.spec.ts)
 * - Base compilation (compileContracts.spec.ts)
 */
describe('compileSourceWithShadow', () => {
	describe('basic shadow injection', () => {
		it('should inject shadow code into Solidity source in safe mode', async () => {
			const shadow = 'function shadowFunction() public {}'

			const result = await compileSourceWithShadow(SimpleContract.source, shadow, {
				sourceLanguage: 'Solidity',
				shadowLanguage: 'Solidity',
				solcVersion: '0.8.20',
				injectIntoContractName: 'SimpleContract',
				shadowMergeStrategy: 'safe',
			})

			expect(result).toBeDefined()
			expect(result.compilationResult).toBeDefined()
			expect(result.compilationResult.contract).toBeDefined()
			expect(result.compilationResult.contract['SimpleContract']).toBeDefined()

			// Verify the shadow function is in the ABI
			const abi = result.compilationResult.contract['SimpleContract']?.abi
			expect(abi?.some((item) => item.type === 'function' && item.name === 'shadowFunction')).toBe(true)
		})

		it('should inject shadow code into Solidity source in replace mode', async () => {
			const shadow = 'function shadowFunction() public {}'

			const result = await compileSourceWithShadow(SimpleContract.source, shadow, {
				sourceLanguage: 'Solidity',
				shadowLanguage: 'Solidity',
				solcVersion: '0.8.20',
				injectIntoContractName: 'SimpleContract',
				shadowMergeStrategy: 'replace',
			})

			expect(result).toBeDefined()
			expect(result.compilationResult.contract['SimpleContract']).toBeDefined()

			// In replace mode, the AST is instrumented and shadow code is injected
			const abi = result.compilationResult.contract['SimpleContract']?.abi
			expect(abi?.some((item) => item.type === 'function' && item.name === 'shadowFunction')).toBe(true)
		})
	})

	describe('error handling', () => {
		it('should handle compilation errors gracefully when throwOnCompilationError is false', async () => {
			const shadow = 'function shadowFunction() public { invalid_syntax }'

			const result = await compileSourceWithShadow(SimpleContract.source, shadow, {
				sourceLanguage: 'Solidity',
				solcVersion: '0.8.20',
				injectIntoContractName: 'SimpleContract',
				throwOnCompilationError: false,
			})

			expect(result).toBeDefined()
			expect(result.errors).toBeDefined()
			expect(result.errors).toMatchInlineSnapshot(`
				[
				  {
				    "component": "general",
				    "errorCode": "2314",
				    "formattedMessage": "ParserError: Expected ';' but got '}'
				  --> <anonymous>:40:51:
				   |
				40 | function shadowFunction() public { invalid_syntax }
				   |                                                   ^

				",
				    "message": "Expected ';' but got '}'",
				    "severity": "error",
				    "sourceLocation": {
				      "end": 941,
				      "file": "<anonymous>",
				      "start": 940,
				    },
				    "type": "ParserError",
				  },
				]
			`)
		})

		it('should throw compilation errors when throwOnCompilationError is true', async () => {
			const shadow = 'function shadowFunction() public { invalid_syntax }'

			await expect(
				compileSourceWithShadow(SimpleContract.source, shadow, {
					sourceLanguage: 'Solidity',
					solcVersion: '0.8.20',
					injectIntoContractName: 'SimpleContract',
					throwOnCompilationError: true,
				}),
			).rejects.toThrow()
		})
	})

	describe('method name conflicts', () => {
		it('should error when shadow function conflicts with existing function in safe mode', async () => {
			// SimpleContract has a doubleValue() function, so this should conflict
			const shadow = 'function doubleValue() public {}'

			const result = await compileSourceWithShadow(SimpleContract.source, shadow, {
				sourceLanguage: 'Solidity',
				solcVersion: '0.8.20',
				injectIntoContractName: 'SimpleContract',
				shadowMergeStrategy: 'safe',
				throwOnCompilationError: false,
			})

			expect(result.errors).toMatchInlineSnapshot(`
				[
				  {
				    "component": "general",
				    "errorCode": "1686",
				    "formattedMessage": "DeclarationError: Function with same name and parameter types defined twice.
				  --> <anonymous>:29:2:
				   |
				29 | 	function doubleValue() external {
				   | 	^ (Relevant source part starts here and spans across multiple lines).
				Note: Other declaration is here:
				  --> <anonymous>:40:1:
				   |
				40 | function doubleValue() public {}
				   | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

				",
				    "message": "Function with same name and parameter types defined twice.",
				    "secondarySourceLocations": [
				      {
				        "end": 922,
				        "file": "<anonymous>",
				        "message": "Other declaration is here:",
				        "start": 890,
				      },
				    ],
				    "severity": "error",
				    "sourceLocation": {
				      "end": 780,
				      "file": "<anonymous>",
				      "start": 699,
				    },
				    "type": "DeclarationError",
				  },
				]
			`)
		})

		it('should error when shadow function conflicts in replace mode without override keyword', async () => {
			// In replace mode, functions are marked virtual but shadow code is still injected into the same contract
			// So duplicate function names still cause errors (replace mode marks functions as virtual for future use)
			const shadow = 'function doubleValue() public {}'

			const result = await compileSourceWithShadow(SimpleContract.source, shadow, {
				sourceLanguage: 'Solidity',
				solcVersion: '0.8.20',
				injectIntoContractName: 'SimpleContract',
				shadowMergeStrategy: 'replace',
				throwOnCompilationError: false,
			})

			expect(result.errors).toMatchInlineSnapshot(`
				[
				  {
				    "component": "general",
				    "errorCode": "1686",
				    "formattedMessage": "DeclarationError: Function with same name and parameter types defined twice.
				  --> <anonymous>:29:2:
				   |
				29 | 	function doubleValue() external {
				   | 	^ (Relevant source part starts here and spans across multiple lines).
				Note: Other declaration is here:
				  --> <anonymous>:40:1:
				   |
				40 | function doubleValue() public {}
				   | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

				",
				    "message": "Function with same name and parameter types defined twice.",
				    "secondarySourceLocations": [
				      {
				        "end": 922,
				        "file": "<anonymous>",
				        "message": "Other declaration is here:",
				        "start": 890,
				      },
				    ],
				    "severity": "error",
				    "sourceLocation": {
				      "end": 780,
				      "file": "<anonymous>",
				      "start": 699,
				    },
				    "type": "DeclarationError",
				  },
				]
			`)
		})

		it('should successfully add new function with replace mode', async () => {
			// Replace mode marks functions as virtual - test that new functions work correctly
			const shadow = 'function tripleValue() public { value = value * 3; emit ValueSet(value); }'

			const result = await compileSourceWithShadow(SimpleContract.source, shadow, {
				sourceLanguage: 'Solidity',
				solcVersion: '0.8.20',
				injectIntoContractName: 'SimpleContract',
				shadowMergeStrategy: 'replace',
			})

			expect(result).toBeDefined()
			expect(result.compilationResult.contract['SimpleContract']).toBeDefined()

			// Verify the shadow function was added to the ABI
			const abi = result.compilationResult.contract['SimpleContract']?.abi
			expect(abi?.some((item) => item.type === 'function' && item.name === 'tripleValue')).toBe(true)

			// Should not have errors
			expect(!result.errors || result.errors.length === 0 || result.errors.every((e) => e.severity !== 'error')).toBe(
				true,
			)
		})
	})
})
