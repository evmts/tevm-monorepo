import { releases } from '@tevm/solc'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { defaults } from './defaults.js'

describe('defaults', () => {
	describe('all default values are defined', () => {
		it('should have all required properties defined', () => {
			expect(defaults).toBeDefined()
			expect(defaults.language).toBeDefined()
			expect(defaults.compilationOutput).toBeDefined()
			expect(defaults.hardfork).toBeDefined()
			expect(defaults.solcVersion).toBeDefined()
			expect(defaults.throwOnVersionMismatch).toBeDefined()
			expect(defaults.throwOnCompilationError).toBeDefined()
			expect(defaults.injectIntoContractPath).toBeDefined()
			expect(defaults.shadowMergeStrategy).toBeDefined()
			expect(defaults.loggingLevel).toBeDefined()
		})

		it('should have no undefined values', () => {
			expect(defaults.language).not.toBeUndefined()
			expect(defaults.compilationOutput).not.toBeUndefined()
			expect(defaults.hardfork).not.toBeUndefined()
			expect(defaults.solcVersion).not.toBeUndefined()
			expect(defaults.throwOnVersionMismatch).not.toBeUndefined()
			expect(defaults.throwOnCompilationError).not.toBeUndefined()
			expect(defaults.injectIntoContractPath).not.toBeUndefined()
			expect(defaults.shadowMergeStrategy).not.toBeUndefined()
			expect(defaults.loggingLevel).not.toBeUndefined()
		})

		it('should have no null values', () => {
			expect(defaults.language).not.toBeNull()
			expect(defaults.compilationOutput).not.toBeNull()
			expect(defaults.hardfork).not.toBeNull()
			expect(defaults.solcVersion).not.toBeNull()
			expect(defaults.throwOnVersionMismatch).not.toBeNull()
			expect(defaults.throwOnCompilationError).not.toBeNull()
			expect(defaults.injectIntoContractPath).not.toBeNull()
			expect(defaults.shadowMergeStrategy).not.toBeNull()
			expect(defaults.loggingLevel).not.toBeNull()
		})
	})

	describe('default types are correct', () => {
		it('should have correct type for language', () => {
			expect(typeof defaults.language).toBe('string')
			expectTypeOf(defaults.language).toBeString()
		})

		it('should have correct type for compilationOutput', () => {
			expect(Array.isArray(defaults.compilationOutput)).toBe(true)
			expectTypeOf(defaults.compilationOutput).toBeArray()
		})

		it('should have correct type for hardfork', () => {
			expect(typeof defaults.hardfork).toBe('string')
			expectTypeOf(defaults.hardfork).toBeString()
		})

		it('should have correct type for solcVersion', () => {
			expect(typeof defaults.solcVersion).toBe('string')
			expectTypeOf(defaults.solcVersion).toBeString()
		})

		it('should have correct type for throwOnVersionMismatch', () => {
			expect(typeof defaults.throwOnVersionMismatch).toBe('boolean')
			expectTypeOf(defaults.throwOnVersionMismatch).toBeBoolean()
		})

		it('should have correct type for throwOnCompilationError', () => {
			expect(typeof defaults.throwOnCompilationError).toBe('boolean')
			expectTypeOf(defaults.throwOnCompilationError).toBeBoolean()
		})

		it('should have correct type for injectIntoContractPath', () => {
			expect(typeof defaults.injectIntoContractPath).toBe('string')
			expectTypeOf(defaults.injectIntoContractPath).toBeString()
		})

		it('should have correct type for shadowMergeStrategy', () => {
			expect(typeof defaults.shadowMergeStrategy).toBe('string')
			expectTypeOf(defaults.shadowMergeStrategy).toBeString()
		})

		it('should have correct type for loggingLevel', () => {
			expect(typeof defaults.loggingLevel).toBe('string')
			expectTypeOf(defaults.loggingLevel).toBeString()
		})
	})

	describe('default values match expected constants', () => {
		it('should have language set to Solidity', () => {
			expect(defaults.language).toBe('Solidity')
		})

		it('should have correct compilationOutput array', () => {
			expect(defaults.compilationOutput).toEqual([
				'abi',
				'ast',
				'evm.bytecode',
				'evm.deployedBytecode',
				'storageLayout',
			])
		})

		it('should have all expected compilationOutput items', () => {
			expect(defaults.compilationOutput).toContain('abi')
			expect(defaults.compilationOutput).toContain('ast')
			expect(defaults.compilationOutput).toContain('evm.bytecode')
			expect(defaults.compilationOutput).toContain('evm.deployedBytecode')
			expect(defaults.compilationOutput).toContain('storageLayout')
			expect(defaults.compilationOutput).toHaveLength(5)
		})

		it('should have hardfork set to cancun', () => {
			expect(defaults.hardfork).toBe('cancun')
		})

		it('should have solcVersion set to latest version from releases', () => {
			const latestVersion = Object.keys(releases)[0]
			expect(defaults.solcVersion).toBe(latestVersion)
			expect(defaults.solcVersion).toBeDefined()
		})

		it('should have solcVersion that exists in releases', () => {
			expect(Object.keys(releases)).toContain(defaults.solcVersion)
		})

		it('should have throwOnVersionMismatch set to true', () => {
			expect(defaults.throwOnVersionMismatch).toBe(true)
		})

		it('should have throwOnCompilationError set to false', () => {
			expect(defaults.throwOnCompilationError).toBe(false)
		})

		it('should have injectIntoContractPath set to <anonymous>', () => {
			expect(defaults.injectIntoContractPath).toBe('<anonymous>')
		})

		it('should have shadowMergeStrategy set to safe', () => {
			expect(defaults.shadowMergeStrategy).toBe('safe')
		})

		it('should have loggingLevel set to warn', () => {
			expect(defaults.loggingLevel).toBe('warn')
		})
	})

	describe('constants are immutable', () => {
		it('should have compilationOutput array that is not empty', () => {
			expect(defaults.compilationOutput.length).toBeGreaterThan(0)
		})

		it('should maintain reference equality for compilationOutput array', () => {
			const firstAccess = defaults.compilationOutput
			const secondAccess = defaults.compilationOutput
			expect(firstAccess).toBe(secondAccess)
		})
	})

	describe('edge cases and validation', () => {
		it('should have non-empty string values', () => {
			expect(defaults.language.length).toBeGreaterThan(0)
			expect(defaults.hardfork.length).toBeGreaterThan(0)
			expect(defaults.solcVersion.length).toBeGreaterThan(0)
			expect(defaults.injectIntoContractPath.length).toBeGreaterThan(0)
			expect(defaults.shadowMergeStrategy.length).toBeGreaterThan(0)
			expect(defaults.loggingLevel.length).toBeGreaterThan(0)
		})

		it('should have valid logging level', () => {
			const validLogLevels = ['trace', 'debug', 'info', 'warn', 'error']
			expect(validLogLevels).toContain(defaults.loggingLevel)
		})

		it('should have valid hardfork name', () => {
			// Common hardfork names - cancun should be one of them
			const commonHardforks = [
				'chainstart',
				'homestead',
				'dao',
				'tangerineWhistle',
				'spuriousDragon',
				'byzantium',
				'constantinople',
				'petersburg',
				'istanbul',
				'muirGlacier',
				'berlin',
				'london',
				'arrowGlacier',
				'grayGlacier',
				'paris',
				'shanghai',
				'cancun',
			]
			expect(commonHardforks).toContain(defaults.hardfork)
		})

		it('should have valid shadow merge strategy', () => {
			const validStrategies = ['safe', 'overwrite']
			expect(validStrategies).toContain(defaults.shadowMergeStrategy)
		})

		it('should have valid language', () => {
			const validLanguages = ['Solidity', 'Yul']
			expect(validLanguages).toContain(defaults.language)
		})

		it('should have compilationOutput with valid entries', () => {
			const validOutputs = [
				'abi',
				'ast',
				'evm.bytecode',
				'evm.deployedBytecode',
				'storageLayout',
				'userdoc',
				'devdoc',
				'metadata',
			]
			defaults.compilationOutput.forEach((output) => {
				expect(validOutputs).toContain(output)
			})
		})
	})

	describe('object structure', () => {
		it('should have exactly 9 properties', () => {
			expect(Object.keys(defaults)).toHaveLength(9)
		})

		it('should have all expected property names', () => {
			const expectedKeys = [
				'language',
				'compilationOutput',
				'hardfork',
				'solcVersion',
				'throwOnVersionMismatch',
				'throwOnCompilationError',
				'injectIntoContractPath',
				'shadowMergeStrategy',
				'loggingLevel',
			]
			expect(Object.keys(defaults).sort()).toEqual(expectedKeys.sort())
		})

		it('should not have any unexpected properties', () => {
			const expectedKeys = [
				'language',
				'compilationOutput',
				'hardfork',
				'solcVersion',
				'throwOnVersionMismatch',
				'throwOnCompilationError',
				'injectIntoContractPath',
				'shadowMergeStrategy',
				'loggingLevel',
			]
			Object.keys(defaults).forEach((key) => {
				expect(expectedKeys).toContain(key)
			})
		})
	})
})
