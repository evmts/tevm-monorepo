import type { SolcContractOutput } from '@tevm/solc'
import type { Abi } from 'abitype'
import { describe, expectTypeOf, it } from 'vitest'
import type { CompilationOutputOption } from '../CompilationOutputOption.js'
import type { CompileSourceResult } from '../CompileSourceResult.js'
import type { CompiledSource } from './CompiledSource.js'

/**
 * Mock function that mimics compileSource signature for type testing
 */
const mockCompileSource = <TCompilationOutput extends CompilationOutputOption[] | undefined>(
	_source: string,
	_options?: { compilationOutput?: TCompilationOutput },
): CompileSourceResult<TCompilationOutput> => {
	return {
		compilationResult: {
			contract: {
				Test: {},
			},
		} as unknown as CompiledSource<TCompilationOutput>,
	}
}

describe('CompiledSourceContractOutput type tests', () => {
	describe('undefined compilationOutput (defaults)', () => {
		it('should have default fields: abi, evm, storageLayout', () => {
			const result = mockCompileSource('contract Test {}')
			const contract = result.compilationResult.contract['Test']!

			// Should have these fields
			expectTypeOf(contract.abi).toEqualTypeOf<Abi>()
			expectTypeOf(contract.evm).toEqualTypeOf<SolcContractOutput['evm']>()
			expectTypeOf(contract.storageLayout).toEqualTypeOf<SolcContractOutput['storageLayout']>()
			// Should not have other fields
			// @ts-expect-error - metadata should not exist
			expectTypeOf(contract.metadata).toBeNever()
		})
	})

	describe("['*'] compilationOutput (everything)", () => {
		it('should have all SolcContractOutput fields', () => {
			const result = mockCompileSource('contract Test {}', { compilationOutput: ['*'] })
			const contract = result.compilationResult.contract['Test']!

			expectTypeOf(contract).toEqualTypeOf<SolcContractOutput>()

			// Should have all fields
			expectTypeOf(contract.abi).toEqualTypeOf<SolcContractOutput['abi']>()
			expectTypeOf(contract.metadata).toEqualTypeOf<SolcContractOutput['metadata']>()
			expectTypeOf(contract.evm).toEqualTypeOf<SolcContractOutput['evm']>()
			expectTypeOf(contract.devdoc).toEqualTypeOf<SolcContractOutput['devdoc']>()
			expectTypeOf(contract.userdoc).toEqualTypeOf<SolcContractOutput['userdoc']>()
			expectTypeOf(contract.storageLayout).toEqualTypeOf<SolcContractOutput['storageLayout']>()
			expectTypeOf(contract.ir).toEqualTypeOf<SolcContractOutput['ir']>()
			expectTypeOf(contract.ewasm).toEqualTypeOf<SolcContractOutput['ewasm']>()
		})
	})

	describe("['abi'] compilationOutput (single selection)", () => {
		it('should only have abi field', () => {
			const result = mockCompileSource('contract Test {}', { compilationOutput: ['abi'] })
			const contract = result.compilationResult.contract['Test']!

			expectTypeOf(contract.abi).toEqualTypeOf<Abi>()

			// Should not have other fields
			// @ts-expect-error - evm should not exist
			expectTypeOf(contract.evm).toBeNever()
			// @ts-expect-error - metadata should not exist
			expectTypeOf(contract.metadata).toBeNever()
		})
	})

	describe('multiple selections', () => {
		it("['abi', 'evm.bytecode'] compilationOutput: should have both abi and evm fields", () => {
			const result = mockCompileSource('contract Test {}', { compilationOutput: ['abi', 'evm.bytecode'] })
			const contract = result.compilationResult.contract['Test']!

			// Should have these fields
			expectTypeOf(contract.abi).toEqualTypeOf<Abi>()
			expectTypeOf(contract.evm).toEqualTypeOf<SolcContractOutput['evm']>()

			// Should not have other fields
			// @ts-expect-error - metadata should not exist
			expectTypeOf(contract.metadata).toBeNever()
			// @ts-expect-error - devdoc should not exist
			expectTypeOf(contract.devdoc).toBeNever()
		})
	})

	it("['abi', 'metadata', 'devdoc'] compilationOutput: should have abi, metadata, and devdoc fields", () => {
		const result = mockCompileSource('contract Test {}', {
			compilationOutput: ['abi', 'metadata', 'devdoc'],
		})
		const contract = result.compilationResult.contract['Test']!

		// Should have these fields
		expectTypeOf(contract.abi).toEqualTypeOf<Abi>()
		expectTypeOf(contract.metadata).toEqualTypeOf<string>()
		expectTypeOf(contract.devdoc).toEqualTypeOf<SolcContractOutput['devdoc']>()

		// Should not have other fields
		// @ts-expect-error - evm should not exist
		expectTypeOf(contract.evm).toBeNever()
		// @ts-expect-error - userdoc should not exist
		expectTypeOf(contract.userdoc).toBeNever()
	})

	it("['abi', 'evm.bytecode', 'evm.deployedBytecode'] multiple nested paths: should have abi and evm fields", () => {
		const result = mockCompileSource('contract Test {}', {
			compilationOutput: ['abi', 'evm.bytecode', 'evm.deployedBytecode'],
		})
		const contract = result.compilationResult.contract['Test']!

		// Should have these fields
		expectTypeOf(contract.abi).toEqualTypeOf<Abi>()
		expectTypeOf(contract.evm).toEqualTypeOf<SolcContractOutput['evm']>()
	})

	describe("['*', 'abi'] compilationOutput (star takes precedence)", () => {
		it('should have all SolcContractOutput fields (star overrides everything)', () => {
			const result = mockCompileSource('contract Test {}', { compilationOutput: ['*', 'abi'] })
			const contract = result.compilationResult.contract['Test']!

			expectTypeOf(contract).toEqualTypeOf<SolcContractOutput>()

			// Should have all fields
			expectTypeOf(contract.abi).toEqualTypeOf<SolcContractOutput['abi']>()
			expectTypeOf(contract.metadata).toEqualTypeOf<SolcContractOutput['metadata']>()
			expectTypeOf(contract.evm).toEqualTypeOf<SolcContractOutput['evm']>()
		})
	})

	describe('all output selections combined', () => {
		it('should have all specified fields when multiple selections are provided', () => {
			const result = mockCompileSource('contract Test {}', {
				compilationOutput: [
					'abi',
					'metadata',
					'userdoc',
					'devdoc',
					'ir',
					'storageLayout',
					'evm.bytecode',
					'ewasm.wasm',
				],
			})
			const contract = result.compilationResult.contract['Test']!

			// All fields should be present
			expectTypeOf(contract.abi).toEqualTypeOf<Abi>()
			expectTypeOf(contract.metadata).toEqualTypeOf<string>()
			expectTypeOf(contract.userdoc).toEqualTypeOf<SolcContractOutput['userdoc']>()
			expectTypeOf(contract.devdoc).toEqualTypeOf<SolcContractOutput['devdoc']>()
			expectTypeOf(contract.ir).toEqualTypeOf<string>()
			expectTypeOf(contract.storageLayout).toEqualTypeOf<SolcContractOutput['storageLayout']>()
			expectTypeOf(contract.evm).toEqualTypeOf<SolcContractOutput['evm']>()
			expectTypeOf(contract.ewasm).toEqualTypeOf<SolcContractOutput['ewasm']>()
		})
	})
})
