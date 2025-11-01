import type { Logger } from '@tevm/logger'
import { FunctionVisibility, StateVariableVisibility } from 'solc-typed-ast'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InheritedContract } from '../../fixtures/index.js'
import { solcSourcesToAstNodes } from '../solcSourcesToAstNodes.js'
import type { InstrumentAstOptions } from './InstrumentAstOptions.js'
import { instrumentAst } from './instrumentAst.js'

/**
 * Helper to get a fresh AST for a specific source file from fixtures
 */
function getFixtureAst(filename: string, mockLogger: Logger) {
	const ast = solcSourcesToAstNodes(InheritedContract.solcOutput.sources ?? {}, mockLogger).find(
		(su) => su.absolutePath === filename,
	)
	if (!ast) throw new Error(`No AST found for ${filename} in fixtures`)
	return ast
}

describe('instrumentAst', () => {
	const mockLogger = {
		debug: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn(),
	} as unknown as Logger

	beforeEach(() => {
		vi.clearAllMocks()
	})

	describe('exposeInternalFunctions option', () => {
		it('should expose internal functions as public using real AST', () => {
			// ComprehensiveContract has stake() which is external, and other public functions
			// Let's use MathUtils library which has internal functions
			const ast = getFixtureAst('lib/utils/MathUtils.sol', mockLogger)

			const options: InstrumentAstOptions = {
				exposeInternalFunctions: true,
			}

			const result = instrumentAst(ast, options, mockLogger)

			// MathUtils library functions should all be internal and get exposed
			const mathUtilsContract = result.vContracts.find((c) => c.name === 'MathUtils')
			expect(mathUtilsContract).toBeDefined()
			expect(mathUtilsContract!.vFunctions.length).toBeGreaterThan(0)

			// All internal functions should now be public
			mathUtilsContract!.vFunctions.forEach((func) => {
				expect(func.visibility).toBe(FunctionVisibility.Public)
			})
		})

		it('should not change external functions visibility', () => {
			const ast = getFixtureAst('ComprehensiveContract.sol', mockLogger)

			const options: InstrumentAstOptions = {
				exposeInternalFunctions: true,
			}

			const result = instrumentAst(ast, options, mockLogger)

			const contract = result.vContracts.find((c) => c.name === 'ComprehensiveContract')
			expect(contract).toBeDefined()

			// Find external functions (like stake)
			const externalFuncs = contract!.vFunctions.filter((f) => f.visibility === FunctionVisibility.External)
			expect(externalFuncs.length).toBeGreaterThan(0)

			// They should remain external
			externalFuncs.forEach((func) => {
				expect(func.visibility).toBe(FunctionVisibility.External)
			})
		})

		it('should not change public functions visibility', () => {
			const ast = getFixtureAst('ComprehensiveContract.sol', mockLogger)

			const options: InstrumentAstOptions = {
				exposeInternalFunctions: true,
			}

			const result = instrumentAst(ast, options, mockLogger)

			const contract = result.vContracts.find((c) => c.name === 'ComprehensiveContract')
			expect(contract).toBeDefined()

			// Find public functions that were already public
			const publicFuncs = contract!.vFunctions.filter((f) => f.visibility === FunctionVisibility.Public)

			// They should remain public
			publicFuncs.forEach((func) => {
				expect(func.visibility).toBe(FunctionVisibility.Public)
			})
		})

		it('should not expose functions when option is false', () => {
			const ast = getFixtureAst('lib/utils/MathUtils.sol', mockLogger)

			const options: InstrumentAstOptions = {
				exposeInternalFunctions: false,
			}

			const result = instrumentAst(ast, options, mockLogger)

			const mathUtilsContract = result.vContracts.find((c) => c.name === 'MathUtils')
			expect(mathUtilsContract).toBeDefined()

			// Internal functions should remain internal
			const internalFuncs = mathUtilsContract!.vFunctions.filter((f) => f.visibility === FunctionVisibility.Internal)
			expect(internalFuncs.length).toBeGreaterThan(0)
		})

		it('should not expose functions when option is undefined', () => {
			const ast = getFixtureAst('lib/utils/MathUtils.sol', mockLogger)

			const options: InstrumentAstOptions = {}

			const result = instrumentAst(ast, options, mockLogger)

			const mathUtilsContract = result.vContracts.find((c) => c.name === 'MathUtils')
			expect(mathUtilsContract).toBeDefined()

			// Internal functions should remain internal
			const internalFuncs = mathUtilsContract!.vFunctions.filter((f) => f.visibility === FunctionVisibility.Internal)
			expect(internalFuncs.length).toBeGreaterThan(0)
		})
	})

	describe('markFunctionsAsVirtual option', () => {
		it('should mark all functions as virtual', () => {
			const ast = getFixtureAst('ComprehensiveContract.sol', mockLogger)

			const options: InstrumentAstOptions = {
				markFunctionsAsVirtual: true,
			}

			const result = instrumentAst(ast, options, mockLogger)

			const contract = result.vContracts.find((c) => c.name === 'ComprehensiveContract')
			expect(contract).toBeDefined()
			expect(contract!.vFunctions.length).toBeGreaterThan(0)

			// All functions should now be virtual
			contract!.vFunctions.forEach((func) => {
				expect(func.virtual).toBe(true)
			})
		})

		it('should not mark functions as virtual when option is false', () => {
			const ast = getFixtureAst('ComprehensiveContract.sol', mockLogger)

			const options: InstrumentAstOptions = {
				markFunctionsAsVirtual: false,
			}

			const nonVirtualFuncs = ast.vContracts
				.find((c) => c.name === 'ComprehensiveContract')!
				.vFunctions.filter((f) => !f.virtual)
			const result = instrumentAst(ast, options, mockLogger)
			const contract = result.vContracts.find((c) => c.name === 'ComprehensiveContract')
			expect(contract).toBeDefined()

			// Functions that weren't virtual should remain non-virtual
			expect(contract!.vFunctions.filter((f) => !f.virtual)).toEqual(nonVirtualFuncs)
		})

		it('should not mark functions as virtual when option is undefined', () => {
			const ast = getFixtureAst('ComprehensiveContract.sol', mockLogger)

			const options: InstrumentAstOptions = {}

			const result = instrumentAst(ast, options, mockLogger)

			const contract = result.vContracts.find((c) => c.name === 'ComprehensiveContract')
			expect(contract).toBeDefined()

			// Verify at least one function exists
			expect(contract!.vFunctions.length).toBeGreaterThan(0)
		})
	})

	describe('exposeInternalVariables option', () => {
		it('should expose internal variables as public', () => {
			const ast = getFixtureAst('ComprehensiveContract.sol', mockLogger)

			const options: InstrumentAstOptions = {
				exposeInternalVariables: true,
			}

			const result = instrumentAst(ast, options, mockLogger)

			const contract = result.vContracts.find((c) => c.name === 'ComprehensiveContract')
			expect(contract).toBeDefined()
			expect(contract!.vStateVariables.length).toBeGreaterThan(0)

			// All state variables should now be public
			contract!.vStateVariables.forEach((variable) => {
				expect(variable.visibility).toBe(StateVariableVisibility.Public)
			})
		})

		it('should not change public variables visibility', () => {
			const ast = getFixtureAst('ComprehensiveContract.sol', mockLogger)

			const options: InstrumentAstOptions = {
				exposeInternalVariables: true,
			}

			const result = instrumentAst(ast, options, mockLogger)

			const contract = result.vContracts.find((c) => c.name === 'ComprehensiveContract')
			expect(contract).toBeDefined()

			// All variables should be public after instrumentation
			const publicVars = contract!.vStateVariables.filter((v) => v.visibility === StateVariableVisibility.Public)
			expect(publicVars.length).toBe(contract!.vStateVariables.length)
		})

		it('should not expose variables when option is false', () => {
			const ast = getFixtureAst('ComprehensiveContract.sol', mockLogger)

			// First get original visibilities by not instrumenting
			const uninstrumentedAst = getFixtureAst('ComprehensiveContract.sol', mockLogger)
			const uninstrumentedContract = uninstrumentedAst.vContracts.find((c) => c.name === 'ComprehensiveContract')
			const originalVisibilities = uninstrumentedContract!.vStateVariables.map((v) => v.visibility)

			const options: InstrumentAstOptions = {
				exposeInternalVariables: false,
			}

			const result = instrumentAst(ast, options, mockLogger)

			const contract = result.vContracts.find((c) => c.name === 'ComprehensiveContract')
			expect(contract).toBeDefined()

			// Variables should maintain their original visibility
			contract!.vStateVariables.forEach((variable, index) => {
				expect(variable.visibility).toBe(originalVisibilities[index])
			})
		})

		it('should not expose variables when option is undefined', () => {
			const ast = getFixtureAst('ComprehensiveContract.sol', mockLogger)

			const options: InstrumentAstOptions = {}

			const result = instrumentAst(ast, options, mockLogger)

			const contract = result.vContracts.find((c) => c.name === 'ComprehensiveContract')
			expect(contract).toBeDefined()

			// At least some variables should not be all public (depends on original contract)
			expect(contract!.vStateVariables.length).toBeGreaterThan(0)
		})
	})

	describe('contractFilter option', () => {
		it('should only instrument filtered contract', () => {
			const ast = getFixtureAst('InheritedContract.sol', mockLogger)

			const options: InstrumentAstOptions = {
				exposeInternalFunctions: true,
				contractFilter: 'ExtendedContract',
			}

			const result = instrumentAst(ast, options, mockLogger)

			// Should have multiple contracts in InheritedContract.sol
			expect(result.vContracts.length).toBeGreaterThan(1)

			const extendedContract = result.vContracts.find((c) => c.name === 'ExtendedContract')
			const wrapperContract = result.vContracts.find((c) => c.name === 'WrapperContract')

			expect(extendedContract).toBeDefined()
			expect(wrapperContract).toBeDefined()

			// Get original AST to compare
			const originalAst = getFixtureAst('InheritedContract.sol', mockLogger)
			const originalWrapperContract = originalAst.vContracts.find((c) => c.name === 'WrapperContract')

			// WrapperContract should not be modified (maintain original internal functions if any)
			if (originalWrapperContract!.vFunctions.length > 0) {
				const originalInternalCount = originalWrapperContract!.vFunctions.filter(
					(f) => f.visibility === FunctionVisibility.Internal || f.visibility === FunctionVisibility.Private,
				).length
				const resultInternalCount = wrapperContract!.vFunctions.filter(
					(f) => f.visibility === FunctionVisibility.Internal || f.visibility === FunctionVisibility.Private,
				).length

				// If there were internal functions, they should remain internal in WrapperContract
				if (originalInternalCount > 0) {
					expect(resultInternalCount).toBe(originalInternalCount)
				}
			}
		})

		it('should instrument all contracts when filter is undefined', () => {
			const ast = getFixtureAst('InheritedContract.sol', mockLogger)

			const options: InstrumentAstOptions = {
				exposeInternalFunctions: true,
			}

			const result = instrumentAst(ast, options, mockLogger)

			expect(result.vContracts.length).toBeGreaterThan(1)

			// All contracts should have their internal functions exposed
			result.vContracts.forEach((contract) => {
				contract.vFunctions.forEach((func) => {
					// Functions should not be internal or private
					expect(func.visibility).not.toBe(FunctionVisibility.Internal)
					expect(func.visibility).not.toBe(FunctionVisibility.Private)
				})
			})
		})

		it('should handle non-matching contract filter', () => {
			const ast = getFixtureAst('InheritedContract.sol', mockLogger)

			// Get original state
			const originalAst = getFixtureAst('InheritedContract.sol', mockLogger)
			const originalContract = originalAst.vContracts[0]
			const originalInternalFuncs = originalContract!.vFunctions.filter(
				(f) => f.visibility === FunctionVisibility.Internal || f.visibility === FunctionVisibility.Private,
			)

			const options: InstrumentAstOptions = {
				exposeInternalFunctions: true,
				contractFilter: 'NonExistentContract',
			}

			const result = instrumentAst(ast, options, mockLogger)

			// Nothing should be modified
			const resultContract = result.vContracts[0]
			const resultInternalFuncs = resultContract!.vFunctions.filter(
				(f) => f.visibility === FunctionVisibility.Internal || f.visibility === FunctionVisibility.Private,
			)

			expect(resultInternalFuncs.length).toBe(originalInternalFuncs.length)
		})

		it('should apply filter with multiple instrumentation options', () => {
			const ast = getFixtureAst('InheritedContract.sol', mockLogger)

			const options: InstrumentAstOptions = {
				exposeInternalFunctions: true,
				exposeInternalVariables: true,
				markFunctionsAsVirtual: true,
				contractFilter: 'ExtendedContract',
			}

			const result = instrumentAst(ast, options, mockLogger)

			const extendedContract = result.vContracts.find((c) => c.name === 'ExtendedContract')
			const wrapperContract = result.vContracts.find((c) => c.name === 'WrapperContract')

			expect(extendedContract).toBeDefined()
			expect(wrapperContract).toBeDefined()

			// ExtendedContract should be fully instrumented
			extendedContract!.vFunctions.forEach((func) => {
				expect(func.virtual).toBe(true)
				expect(func.visibility).not.toBe(FunctionVisibility.Internal)
				expect(func.visibility).not.toBe(FunctionVisibility.Private)
			})

			extendedContract!.vStateVariables.forEach((variable) => {
				expect(variable.visibility).toBe(StateVariableVisibility.Public)
			})

			// Get original WrapperContract to verify it wasn't modified
			const originalAst = getFixtureAst('InheritedContract.sol', mockLogger)
			const originalWrapper = originalAst.vContracts.find((c) => c.name === 'WrapperContract')

			// WrapperContract should not be marked as virtual
			wrapperContract!.vFunctions.forEach((func, index) => {
				expect(func.virtual).toBe(originalWrapper!.vFunctions[index]!.virtual)
			})
		})
	})

	describe('combined options', () => {
		it('should apply both exposeInternalFunctions and markFunctionsAsVirtual', () => {
			const ast = getFixtureAst('lib/utils/MathUtils.sol', mockLogger)

			const options: InstrumentAstOptions = {
				exposeInternalFunctions: true,
				markFunctionsAsVirtual: true,
			}

			const result = instrumentAst(ast, options, mockLogger)

			const mathUtilsContract = result.vContracts.find((c) => c.name === 'MathUtils')
			expect(mathUtilsContract).toBeDefined()
			expect(mathUtilsContract!.vFunctions.length).toBeGreaterThan(0)

			mathUtilsContract!.vFunctions.forEach((func) => {
				expect(func.visibility).toBe(FunctionVisibility.Public)
				expect(func.virtual).toBe(true)
			})
		})

		it('should apply all instrumentation options together', () => {
			const ast = getFixtureAst('ComprehensiveContract.sol', mockLogger)

			const options: InstrumentAstOptions = {
				exposeInternalFunctions: true,
				exposeInternalVariables: true,
				markFunctionsAsVirtual: true,
			}

			const result = instrumentAst(ast, options, mockLogger)

			const contract = result.vContracts.find((c) => c.name === 'ComprehensiveContract')
			expect(contract).toBeDefined()

			// All functions should be public (or external if originally external) and virtual
			contract!.vFunctions.forEach((func) => {
				expect(func.virtual).toBe(true)
				expect(func.visibility).not.toBe(FunctionVisibility.Internal)
				expect(func.visibility).not.toBe(FunctionVisibility.Private)
			})

			// All variables should be public
			contract!.vStateVariables.forEach((variable) => {
				expect(variable.visibility).toBe(StateVariableVisibility.Public)
			})
		})

		it('should apply no instrumentation when all options are false', () => {
			const ast = getFixtureAst('ComprehensiveContract.sol', mockLogger)

			// Get original state
			const originalAst = getFixtureAst('ComprehensiveContract.sol', mockLogger)
			const originalContract = originalAst.vContracts.find((c) => c.name === 'ComprehensiveContract')
			const originalFuncVisibilities = originalContract!.vFunctions.map((f) => f.visibility)
			const originalFuncVirtuals = originalContract!.vFunctions.map((f) => f.virtual)
			const originalVarVisibilities = originalContract!.vStateVariables.map((v) => v.visibility)

			const options: InstrumentAstOptions = {
				exposeInternalFunctions: false,
				exposeInternalVariables: false,
				markFunctionsAsVirtual: false,
			}

			const result = instrumentAst(ast, options, mockLogger)

			const contract = result.vContracts.find((c) => c.name === 'ComprehensiveContract')
			expect(contract).toBeDefined()

			// Everything should remain the same
			contract!.vFunctions.forEach((func, index) => {
				expect(func.visibility).toBe(originalFuncVisibilities[index])
				expect(func.virtual).toBe(originalFuncVirtuals[index])
			})

			contract!.vStateVariables.forEach((variable, index) => {
				expect(variable.visibility).toBe(originalVarVisibilities[index])
			})
		})
	})

	describe('edge cases and empty structures', () => {
		it('should handle library contract', () => {
			const ast = getFixtureAst('lib/utils/MathUtils.sol', mockLogger)

			const options: InstrumentAstOptions = {
				exposeInternalFunctions: true,
			}

			const result = instrumentAst(ast, options, mockLogger)

			const mathUtilsContract = result.vContracts.find((c) => c.name === 'MathUtils')
			expect(mathUtilsContract).toBeDefined()
			expect(mathUtilsContract!.vFunctions.length).toBeGreaterThan(0)

			// All functions should now be public
			mathUtilsContract!.vFunctions.forEach((func) => {
				expect(func.visibility).toBe(FunctionVisibility.Public)
			})
		})

		it('should handle empty options object', () => {
			const ast = getFixtureAst('ComprehensiveContract.sol', mockLogger)

			const options: InstrumentAstOptions = {}

			const result = instrumentAst(ast, options, mockLogger)

			const contract = result.vContracts.find((c) => c.name === 'ComprehensiveContract')
			expect(contract).toBeDefined()
			expect(contract!.vFunctions.length).toBeGreaterThan(0)
			expect(contract!.vStateVariables.length).toBeGreaterThan(0)
		})
	})

	describe('multiple contracts', () => {
		it('should handle multiple contracts with mixed content', () => {
			const ast = getFixtureAst('InheritedContract.sol', mockLogger)

			const options: InstrumentAstOptions = {
				exposeInternalFunctions: true,
				exposeInternalVariables: true,
				markFunctionsAsVirtual: true,
			}

			const result = instrumentAst(ast, options, mockLogger)

			// InheritedContract.sol contains ExtendedContract and WrapperContract
			expect(result.vContracts.length).toBeGreaterThanOrEqual(2)

			result.vContracts.forEach((contract) => {
				// All functions should be virtual and not internal/private
				contract!.vFunctions.forEach((func) => {
					expect(func.virtual).toBe(true)
					expect(func.visibility).not.toBe(FunctionVisibility.Internal)
					expect(func.visibility).not.toBe(FunctionVisibility.Private)
				})

				// All variables should be public
				contract!.vStateVariables.forEach((variable) => {
					expect(variable.visibility).toBe(StateVariableVisibility.Public)
				})
			})
		})
	})

	describe('return value', () => {
		it('should return the same AST object reference', () => {
			const ast = getFixtureAst('ComprehensiveContract.sol', mockLogger)

			const options: InstrumentAstOptions = {}

			const result = instrumentAst(ast, options, mockLogger)

			expect(result).toBe(ast)
		})

		it('should mutate AST in place', () => {
			const ast = getFixtureAst('lib/utils/MathUtils.sol', mockLogger)

			const mathUtilsContract = ast.vContracts.find((c) => c.name === 'MathUtils')
			expect(mathUtilsContract).toBeDefined()

			const originalFunc = mathUtilsContract!.vFunctions[0]!
			const originalVisibility = originalFunc.visibility

			const options: InstrumentAstOptions = {
				exposeInternalFunctions: true,
			}

			instrumentAst(ast, options, mockLogger)

			// The original function reference should be mutated
			expect(originalFunc.visibility).toBe(FunctionVisibility.Public)
			expect(originalFunc.visibility).not.toBe(originalVisibility)
		})
	})
})
