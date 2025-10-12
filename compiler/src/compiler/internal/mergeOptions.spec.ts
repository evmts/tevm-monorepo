import { describe, expect, it } from 'vitest'
import type { CompileBaseOptions } from '../CompileBaseOptions.js'
import { mergeOptions } from './mergeOptions.js'

describe('mergeOptions', () => {
	describe('basic property merging', () => {
		it('should return empty object when both parameters are undefined', () => {
			const result = mergeOptions(undefined, undefined)
			expect(result).toBeDefined()
			expect(typeof result).toBe('object')
		})

		it('should return empty object when both parameters are empty', () => {
			const result = mergeOptions({}, {})
			expect(result).toBeDefined()
			expect(typeof result).toBe('object')
		})

		it('should use options when overrides are not provided', () => {
			const options = {
				language: 'Solidity',
				solcVersion: '0.8.17',
				throwOnVersionMismatch: true,
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, {})
			expect(result.language).toBe('Solidity')
			expect(result.solcVersion).toBe('0.8.17')
			expect(result.throwOnVersionMismatch).toBe(true)
		})

		it('should use overrides when options are not provided', () => {
			const overrides = {
				language: 'Yul',
				solcVersion: '0.8.19',
				throwOnVersionMismatch: false,
			} as const satisfies CompileBaseOptions
			const result = mergeOptions({}, overrides)
			expect(result.language).toBe('Yul')
			expect(result.solcVersion).toBe('0.8.19')
			expect(result.throwOnVersionMismatch).toBe(false)
		})

		it('should prefer overrides over options', () => {
			const options = {
				language: 'Solidity',
				solcVersion: '0.8.17',
				throwOnVersionMismatch: true,
				throwOnCompilationError: false,
			} as const satisfies CompileBaseOptions
			const overrides = {
				language: 'Yul',
				solcVersion: '0.8.19',
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)
			expect(result.language).toBe('Yul')
			expect(result.solcVersion).toBe('0.8.19')
			expect(result.throwOnVersionMismatch).toBe(true)
			expect(result.throwOnCompilationError).toBe(false)
		})

		it('should handle all basic properties', () => {
			const options = {
				language: 'Solidity',
				solcVersion: '0.8.17',
				throwOnVersionMismatch: true,
				throwOnCompilationError: false,
				cacheEnabled: true,
				loggingLevel: 'info',
				exposeInternalFunctions: false,
				exposeInternalVariables: false,
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, {})
			expect(result.language).toBe('Solidity')
			expect(result.solcVersion).toBe('0.8.17')
			expect(result.throwOnVersionMismatch).toBe(true)
			expect(result.throwOnCompilationError).toBe(false)
			expect(result.cacheEnabled).toBe(true)
			expect(result.loggingLevel).toBe('info')
			expect(result.exposeInternalFunctions).toBe(false)
			expect(result.exposeInternalVariables).toBe(false)
		})
	})

	describe('undefined handling', () => {
		it('should handle undefined options with defined overrides', () => {
			const overrides = {
				language: 'Yul',
				solcVersion: '0.8.19',
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(undefined, overrides)
			expect(result.language).toBe('Yul')
			expect(result.solcVersion).toBe('0.8.19')
		})

		it('should handle defined options with undefined overrides', () => {
			const options = {
				language: 'Solidity',
				solcVersion: '0.8.17',
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, undefined)
			expect(result.language).toBe('Solidity')
			expect(result.solcVersion).toBe('0.8.17')
		})

		it('should treat undefined as absent in nullish coalescing', () => {
			const options = {
				language: 'Solidity',
			} as const satisfies CompileBaseOptions
			const overrides = {
				language: undefined,
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)
			expect(result.language).toBe('Solidity')
		})

		it('should handle all properties as undefined', () => {
			const options = {
				language: undefined,
				solcVersion: undefined,
				throwOnVersionMismatch: undefined,
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, {})
			expect(result.language).toBeUndefined()
			expect(result.solcVersion).toBeUndefined()
			expect(result.throwOnVersionMismatch).toBeUndefined()
		})
	})

	describe('null handling', () => {
		it('should handle null values in options', () => {
			const options = {
				// @ts-expect-error - Testing null handling
				language: null,
				solcVersion: '0.8.17',
			} as const satisfies CompileBaseOptions
			// @ts-expect-error - Testing null handling
			const result = mergeOptions(options, {})
			expect(result.language).toBeNull()
			expect(result.solcVersion).toBe('0.8.17')
		})

		it('should treat null as nullish and fallback to options', () => {
			const options = {
				language: 'Solidity',
			} as const satisfies CompileBaseOptions
			const overrides = {
				// @ts-expect-error - Testing null handling
				language: null,
			} as const satisfies CompileBaseOptions
			// @ts-expect-error - Testing null handling
			const result = mergeOptions(options, overrides)
			// The nullish coalescing operator ?? treats null as nullish, so it falls back to options
			expect(result.language).toBe('Solidity')
		})
	})

	describe('boolean value handling', () => {
		it('should handle false boolean values correctly', () => {
			const options = {
				throwOnVersionMismatch: false,
				throwOnCompilationError: false,
				cacheEnabled: false,
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, {})
			expect(result.throwOnVersionMismatch).toBe(false)
			expect(result.throwOnCompilationError).toBe(false)
			expect(result.cacheEnabled).toBe(false)
		})

		it('should override false with true', () => {
			const options = {
				throwOnVersionMismatch: false,
			} as const satisfies CompileBaseOptions
			const overrides = {
				throwOnVersionMismatch: true,
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)
			expect(result.throwOnVersionMismatch).toBe(true)
		})

		it('should override true with false', () => {
			const options = {
				throwOnVersionMismatch: true,
			} as const satisfies CompileBaseOptions
			const overrides = {
				throwOnVersionMismatch: false,
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)
			expect(result.throwOnVersionMismatch).toBe(false)
		})
	})

	describe('conditional properties', () => {
		describe('cacheDirectory', () => {
			it('should not include cacheDirectory when not in overrides', () => {
				const result = mergeOptions({}, {})
				expect('cacheDirectory' in result).toBe(false)
			})

			it('should include cacheDirectory when in overrides', () => {
				const overrides = {
					cacheDirectory: '/path/to/cache',
				} as const satisfies CompileBaseOptions
				const result = mergeOptions({}, overrides)
				expect(result.cacheDirectory).toBe('/path/to/cache')
			})

			it('should not include cacheDirectory from options', () => {
				const options = {
					cacheDirectory: '/path/to/cache',
				} as const satisfies CompileBaseOptions
				const result = mergeOptions(options, {})
				expect('cacheDirectory' in result).toBe(false)
			})

			it('should override cacheDirectory', () => {
				const options = {
					cacheDirectory: '/old/path',
				} as const satisfies CompileBaseOptions
				const overrides = {
					cacheDirectory: '/new/path',
				} as const satisfies CompileBaseOptions
				const result = mergeOptions(options, overrides)
				expect(result.cacheDirectory).toBe('/new/path')
			})
		})

		describe('remappings', () => {
			it('should not include remappings when not in overrides', () => {
				const result = mergeOptions({}, {})
				expect('remappings' in result).toBe(false)
			})

			it('should include remappings when in overrides', () => {
				const overrides = {
					remappings: ['@openzeppelin/=lib/openzeppelin/'],
				} as const satisfies CompileBaseOptions
				const result = mergeOptions({}, overrides)
				expect(result.remappings).toEqual(['@openzeppelin/=lib/openzeppelin/'])
			})

			it('should not include remappings from options', () => {
				const options = {
					remappings: ['@openzeppelin/=lib/openzeppelin/'],
				} as const satisfies CompileBaseOptions
				const result = mergeOptions(options, {})
				expect('remappings' in result).toBe(false)
			})

			it('should override remappings completely', () => {
				const options = {
					remappings: ['@openzeppelin/=lib/openzeppelin/'],
				} as const satisfies CompileBaseOptions
				const overrides = {
					remappings: ['@solmate/=lib/solmate/'],
				} as const satisfies CompileBaseOptions
				const result = mergeOptions(options, overrides)
				expect(result.remappings).toEqual(['@solmate/=lib/solmate/'])
			})
		})

		describe('libraries', () => {
			it('should not include libraries when not in overrides', () => {
				const result = mergeOptions({}, {})
				expect('libraries' in result).toBe(false)
			})

			it('should include libraries when in overrides', () => {
				const overrides = {
					libraries: {
						'contracts/Math.sol': {
							Math: '0x1234567890123456789012345678901234567890',
						},
					},
				} as const satisfies CompileBaseOptions
				const result = mergeOptions({}, overrides)
				expect(result.libraries).toEqual({
					'contracts/Math.sol': {
						Math: '0x1234567890123456789012345678901234567890',
					},
				})
			})

			it('should not include libraries from options', () => {
				const options = {
					libraries: {
						'contracts/Math.sol': {
							Math: '0x1234567890123456789012345678901234567890',
						},
					},
				} as const satisfies CompileBaseOptions
				const result = mergeOptions(options, {})
				expect('libraries' in result).toBe(false)
			})

			it('should override libraries completely', () => {
				const options = {
					libraries: {
						'contracts/Math.sol': {
							Math: '0x1111111111111111111111111111111111111111',
						},
					},
				} as const satisfies CompileBaseOptions
				const overrides = {
					libraries: {
						'contracts/Utils.sol': {
							Utils: '0x2222222222222222222222222222222222222222',
						},
					},
				} as const satisfies CompileBaseOptions
				const result = mergeOptions(options, overrides)
				expect(result.libraries).toEqual({
					'contracts/Utils.sol': {
						Utils: '0x2222222222222222222222222222222222222222',
					},
				})
			})
		})

		describe('viaIR', () => {
			it('should not include viaIR when undefined in both', () => {
				const result = mergeOptions({}, {})
				expect('viaIR' in result).toBe(false)
			})

			it('should include viaIR when true in options', () => {
				const options = {
					viaIR: true,
				} as const satisfies CompileBaseOptions
				const result = mergeOptions(options, {})
				expect(result.viaIR).toBe(true)
			})

			it('should include viaIR when false in options', () => {
				const options = {
					viaIR: false,
				} as const satisfies CompileBaseOptions
				const result = mergeOptions(options, {})
				expect(result.viaIR).toBe(false)
			})

			it('should include viaIR when true in overrides', () => {
				const overrides = {
					viaIR: true,
				} as const satisfies CompileBaseOptions
				const result = mergeOptions({}, overrides)
				expect(result.viaIR).toBe(true)
			})

			it('should include viaIR when false in overrides', () => {
				const overrides = {
					viaIR: false,
				} as const satisfies CompileBaseOptions
				const result = mergeOptions({}, overrides)
				expect(result.viaIR).toBe(false)
			})

			it('should prefer override viaIR', () => {
				const options = {
					viaIR: false,
				} as const satisfies CompileBaseOptions
				const overrides = {
					viaIR: true,
				} as const satisfies CompileBaseOptions
				const result = mergeOptions(options, overrides)
				expect(result.viaIR).toBe(true)
			})
		})
	})

	describe('optimizer deep merge', () => {
		it('should not include optimizer when absent in both', () => {
			const result = mergeOptions({}, {})
			expect('optimizer' in result).toBe(false)
		})

		it('should include optimizer from options', () => {
			const options = {
				optimizer: {
					enabled: true,
					runs: 200,
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, {})
			expect(result.optimizer).toEqual({
				enabled: true,
				runs: 200,
			})
		})

		it('should include optimizer from overrides', () => {
			const overrides = {
				optimizer: {
					enabled: true,
					runs: 1000,
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions({}, overrides)
			expect(result.optimizer).toEqual({
				enabled: true,
				runs: 1000,
			})
		})

		it('should merge optimizer properties', () => {
			const options = {
				optimizer: {
					enabled: true,
					runs: 200,
				},
			} as const satisfies CompileBaseOptions
			const overrides = {
				optimizer: {
					runs: 1000,
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)
			expect(result.optimizer).toEqual({
				enabled: true,
				runs: 1000,
			})
		})

		it('should override optimizer enabled', () => {
			const options = {
				optimizer: {
					enabled: true,
					runs: 200,
				},
			} as const satisfies CompileBaseOptions
			const overrides = {
				optimizer: {
					enabled: false,
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)
			expect(result.optimizer).toEqual({
				enabled: false,
				runs: 200,
			})
		})

		it('should handle optimizer details', () => {
			const options = {
				optimizer: {
					enabled: true,
					details: {
						peephole: true,
						inliner: true,
					},
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, {})
			expect(result.optimizer?.details).toEqual({
				peephole: true,
				inliner: true,
			})
		})

		it('should merge optimizer details', () => {
			const options = {
				optimizer: {
					enabled: true,
					details: {
						peephole: true,
						inliner: true,
					},
				},
			} as const satisfies CompileBaseOptions
			const overrides = {
				optimizer: {
					details: {
						inliner: false,
						jumpdestRemover: true,
					},
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)
			expect(result.optimizer?.details).toEqual({
				peephole: true,
				inliner: false,
				jumpdestRemover: true,
			})
		})

		it('should handle optimizer yulDetails', () => {
			const options = {
				optimizer: {
					enabled: true,
					details: {
						yulDetails: {
							optimizerSteps: 'dhfoDgvulfnTUtnIf',
						},
					},
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, {})
			expect(result.optimizer?.details?.yulDetails).toEqual({
				optimizerSteps: 'dhfoDgvulfnTUtnIf',
			})
		})

		it('should merge optimizer yulDetails', () => {
			const options = {
				optimizer: {
					enabled: true,
					details: {
						yulDetails: {
							optimizerSteps: 'dhfoDgvulfnTUtnIf',
							stackAllocation: true,
						},
					},
				},
			} as const satisfies CompileBaseOptions
			const overrides = {
				optimizer: {
					details: {
						yulDetails: {
							optimizerSteps: 'custom',
						},
					},
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)
			expect(result.optimizer?.details?.yulDetails).toEqual({
				optimizerSteps: 'custom',
				stackAllocation: true,
			})
		})

		it('should handle deeply nested optimizer merging', () => {
			const options = {
				optimizer: {
					enabled: true,
					runs: 200,
					details: {
						peephole: true,
						yulDetails: {
							stackAllocation: true,
							optimizerSteps: 'dhfoDgvulfnTUtnIf',
						},
					},
				},
			} as const satisfies CompileBaseOptions
			const overrides = {
				optimizer: {
					runs: 1000,
					details: {
						inliner: false,
						yulDetails: {
							optimizerSteps: 'custom',
						},
					},
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)
			expect(result.optimizer).toEqual({
				enabled: true,
				runs: 1000,
				details: {
					peephole: true,
					inliner: false,
					yulDetails: {
						stackAllocation: true,
						optimizerSteps: 'custom',
					},
				},
			})
		})

		it('should not include details when absent in both', () => {
			const options = {
				optimizer: {
					enabled: true,
					runs: 200,
				},
			} as const satisfies CompileBaseOptions
			const overrides = {
				optimizer: {
					runs: 1000,
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)
			expect('details' in (result.optimizer || {})).toBe(false)
		})

		it('should not include yulDetails when absent in both', () => {
			const options = {
				optimizer: {
					enabled: true,
					details: {
						peephole: true,
					},
				},
			} as const satisfies CompileBaseOptions
			const overrides = {
				optimizer: {
					details: {
						inliner: false,
					},
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)
			expect('yulDetails' in (result.optimizer?.details || {})).toBe(false)
		})
	})

	describe('debug deep merge', () => {
		it('should not include debug when absent in both', () => {
			const result = mergeOptions({}, {})
			expect('debug' in result).toBe(false)
		})

		it('should include debug from options', () => {
			const options = {
				debug: {
					revertStrings: 'default',
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, {})
			expect(result.debug).toEqual({
				revertStrings: 'default',
			})
		})

		it('should include debug from overrides', () => {
			const overrides = {
				debug: {
					revertStrings: 'strip',
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions({}, overrides)
			expect(result.debug).toEqual({
				revertStrings: 'strip',
			})
		})

		it('should merge debug properties', () => {
			const options = {
				debug: {
					revertStrings: 'default',
					debugInfo: ['location'],
				},
			} as const satisfies CompileBaseOptions
			const overrides = {
				debug: {
					revertStrings: 'strip',
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)
			expect(result.debug).toEqual({
				revertStrings: 'strip',
				debugInfo: ['location'],
			})
		})

		it('should handle empty debug objects', () => {
			const options = {
				debug: {},
			} as const satisfies CompileBaseOptions
			const overrides = {
				debug: {},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)
			expect(result.debug).toEqual({})
		})
	})

	describe('metadata deep merge', () => {
		it('should not include metadata when absent in both', () => {
			const result = mergeOptions({}, {})
			expect('metadata' in result).toBe(false)
		})

		it('should include metadata from options', () => {
			const options = {
				metadata: {
					useLiteralContent: true,
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, {})
			expect(result.metadata).toEqual({
				useLiteralContent: true,
			})
		})

		it('should include metadata from overrides', () => {
			const overrides = {
				metadata: {
					useLiteralContent: false,
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions({}, overrides)
			expect(result.metadata).toEqual({
				useLiteralContent: false,
			})
		})

		it('should merge metadata properties', () => {
			const options = {
				metadata: {
					useLiteralContent: true,
					bytecodeHash: 'ipfs',
				},
			} as const satisfies CompileBaseOptions
			const overrides = {
				metadata: {
					useLiteralContent: false,
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)
			expect(result.metadata).toEqual({
				useLiteralContent: false,
				bytecodeHash: 'ipfs',
			})
		})

		it('should handle empty metadata objects', () => {
			const options = {
				metadata: {},
			} as const satisfies CompileBaseOptions
			const overrides = {
				metadata: {},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)
			expect(result.metadata).toEqual({})
		})
	})

	describe('modelChecker deep merge', () => {
		it('should not include modelChecker when absent in both', () => {
			const result = mergeOptions({}, {})
			expect('modelChecker' in result).toBe(false)
		})

		it('should include modelChecker from options', () => {
			const options = {
				modelChecker: {
					engine: 'chc',
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, {})
			expect(result.modelChecker).toEqual({
				engine: 'chc',
			})
		})

		it('should include modelChecker from overrides', () => {
			const overrides = {
				modelChecker: {
					engine: 'bmc',
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions({}, overrides)
			expect(result.modelChecker).toEqual({
				engine: 'bmc',
			})
		})

		it('should merge modelChecker properties', () => {
			const options = {
				modelChecker: {
					engine: 'chc',
					timeout: true,
				},
			} as const satisfies CompileBaseOptions
			const overrides = {
				modelChecker: {
					engine: 'bmc',
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)
			expect(result.modelChecker).toEqual({
				engine: 'bmc',
				timeout: true,
			})
		})

		it('should handle complex modelChecker with contracts and targets', () => {
			const options = {
				modelChecker: {
					engine: 'chc',
					contracts: {
						'contracts/A.sol': ['A'],
					},
					targets: ['assert', 'underflow'],
				},
			} as const satisfies CompileBaseOptions
			const overrides = {
				modelChecker: {
					timeout: true,
					targets: ['overflow'],
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)
			expect(result.modelChecker).toEqual({
				engine: 'chc',
				contracts: {
					'contracts/A.sol': ['A'],
				},
				timeout: true,
				targets: ['overflow'],
			})
		})

		it('should handle empty modelChecker objects', () => {
			const options = {
				modelChecker: {},
			} as const satisfies CompileBaseOptions
			const overrides = {
				modelChecker: {},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)
			expect(result.modelChecker).toEqual({})
		})
	})

	describe('complex merging scenarios', () => {
		it('should handle complete options with partial overrides', () => {
			const options = {
				language: 'Solidity',
				solcVersion: '0.8.17',
				throwOnVersionMismatch: true,
				throwOnCompilationError: false,
				cacheEnabled: true,
				cacheDirectory: '/cache',
				loggingLevel: 'info',
				hardfork: 'london',
				compilationOutput: ['abi', 'ast'],
				viaIR: false,
				optimizer: {
					enabled: true,
					runs: 200,
					details: {
						peephole: true,
						yulDetails: {
							optimizerSteps: 'dhfoDgvulfnTUtnIf',
						},
					},
				},
				debug: {
					revertStrings: 'default',
				},
				metadata: {
					useLiteralContent: true,
				},
			} as const satisfies CompileBaseOptions
			const overrides = {
				solcVersion: '0.8.19',
				hardfork: 'cancun',
				optimizer: {
					runs: 1000,
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)

			expect(result.language).toBe('Solidity')
			expect(result.solcVersion).toBe('0.8.19')
			expect(result.hardfork).toBe('cancun')
			expect(result.optimizer?.runs).toBe(1000)
			expect(result.optimizer?.enabled).toBe(true)
			expect(result.optimizer?.details?.peephole).toBe(true)
			expect(result.debug?.revertStrings).toBe('default')
			expect(result.metadata?.useLiteralContent).toBe(true)
		})

		it('should handle multiple nested object merges', () => {
			const options = {
				optimizer: {
					enabled: true,
					details: {
						peephole: true,
					},
				},
				debug: {
					revertStrings: 'default',
				},
				metadata: {
					useLiteralContent: true,
				},
				modelChecker: {
					engine: 'chc',
				},
			} as const satisfies CompileBaseOptions
			const overrides = {
				optimizer: {
					runs: 1000,
				},
				debug: {
					revertStrings: 'strip',
				},
				metadata: {
					bytecodeHash: 'none',
				},
				modelChecker: {
					timeout: true,
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)

			expect(result.optimizer).toEqual({
				enabled: true,
				runs: 1000,
				details: {
					peephole: true,
				},
			})
			expect(result.debug).toEqual({
				revertStrings: 'strip',
			})
			expect(result.metadata).toEqual({
				useLiteralContent: true,
				bytecodeHash: 'none',
			})
			expect(result.modelChecker).toEqual({
				engine: 'chc',
				timeout: true,
			})
		})

		it('should handle overrides clearing values from options', () => {
			const options = {
				language: 'Solidity',
				optimizer: {
					enabled: true,
					runs: 200,
				},
			} as const satisfies CompileBaseOptions
			const overrides = {
				optimizer: {
					enabled: false,
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)

			expect(result.optimizer?.enabled).toBe(false)
			expect(result.optimizer?.runs).toBe(200)
		})

		it('should handle merging with all properties', () => {
			const fullOptions = {
				language: 'Solidity',
				solcVersion: '0.8.17',
				throwOnVersionMismatch: true,
				throwOnCompilationError: false,
				cacheEnabled: true,
				cacheDirectory: '/cache',
				loggingLevel: 'info',
				exposeInternalFunctions: false,
				exposeInternalVariables: false,
				hardfork: 'london',
				compilationOutput: ['abi', 'ast'],
				viaIR: false,
				optimizer: {
					enabled: true,
					runs: 200,
				},
				debug: {
					revertStrings: 'default',
				},
				metadata: {
					useLiteralContent: true,
				},
				modelChecker: {
					engine: 'chc',
				},
				remappings: ['@openzeppelin/=lib/openzeppelin/'],
				libraries: {
					'contracts/Math.sol': {
						Math: '0x1234567890123456789012345678901234567890',
					},
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(fullOptions, {})

			expect(result.language).toBe('Solidity')
			expect(result.optimizer?.enabled).toBe(true)
			expect(result.debug?.revertStrings).toBe('default')
			expect(result.metadata?.useLiteralContent).toBe(true)
			expect(result.modelChecker?.engine).toBe('chc')
			// Note: remappings and libraries are not included unless in overrides
			expect('remappings' in result).toBe(false)
			expect('libraries' in result).toBe(false)
		})
	})

	describe('edge cases', () => {
		it('should handle empty string values', () => {
			const options = {
				// @ts-expect-error - Testing empty string handling
				language: '',
				// @ts-expect-error - Testing empty string handling
				solcVersion: '',
			} as const satisfies CompileBaseOptions
			// @ts-expect-error - Testing empty string handling
			const result = mergeOptions(options, {})
			expect(result.language).toBe('')
			expect(result.solcVersion).toBe('')
		})

		it('should handle zero as a valid value', () => {
			const options = {
				optimizer: {
					runs: 0,
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, {})
			expect(result.optimizer?.runs).toBe(0)
		})

		it('should not mutate input options', () => {
			const options = {
				language: 'Solidity',
				optimizer: {
					enabled: true,
					runs: 200,
				},
			} as const satisfies CompileBaseOptions
			const optionsCopy = JSON.parse(JSON.stringify(options))
			const overrides = {
				optimizer: {
					runs: 1000,
				},
			} as const satisfies CompileBaseOptions
			mergeOptions(options, overrides)

			expect(options).toEqual(optionsCopy)
		})

		it('should not mutate input overrides', () => {
			const options = {
				optimizer: {
					enabled: true,
					runs: 200,
				},
			} as const satisfies CompileBaseOptions
			const overrides = {
				optimizer: {
					runs: 1000,
				},
			} as const satisfies CompileBaseOptions
			const overridesCopy = JSON.parse(JSON.stringify(overrides))
			mergeOptions(options, overrides)

			expect(overrides).toEqual(overridesCopy)
		})

		it('should handle nested empty objects', () => {
			const options = {
				optimizer: {},
				debug: {},
				metadata: {},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, {})
			expect(result.optimizer).toEqual({})
			expect(result.debug).toEqual({})
			expect(result.metadata).toEqual({})
		})

		it('should handle mixing conditional and non-conditional properties', () => {
			const options = {
				language: 'Solidity',
				viaIR: true,
				optimizer: {
					enabled: true,
				},
			} as const satisfies CompileBaseOptions
			const overrides = {
				solcVersion: '0.8.19',
				cacheDirectory: '/new/cache',
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, overrides)

			expect(result.language).toBe('Solidity')
			expect(result.solcVersion).toBe('0.8.19')
			expect(result.viaIR).toBe(true)
			expect(result.cacheDirectory).toBe('/new/cache')
			expect(result.optimizer?.enabled).toBe(true)
		})
	})

	describe('type safety', () => {
		it('should return an object', () => {
			const result = mergeOptions({}, {})
			expect(typeof result).toBe('object')
			expect(result).not.toBeNull()
		})

		it('should handle arrays correctly', () => {
			const options = {
				compilationOutput: ['abi', 'ast'],
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, {})
			expect(Array.isArray(result.compilationOutput)).toBe(true)
		})

		it('should preserve object structure', () => {
			const options = {
				optimizer: {
					enabled: true,
					details: {
						yulDetails: {
							optimizerSteps: 'test',
						},
					},
				},
			} as const satisfies CompileBaseOptions
			const result = mergeOptions(options, {})
			expect(typeof result.optimizer).toBe('object')
			expect(typeof result.optimizer?.details).toBe('object')
			expect(typeof result.optimizer?.details?.yulDetails).toBe('object')
		})
	})
})
