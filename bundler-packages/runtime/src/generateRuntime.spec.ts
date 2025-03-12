import type { Artifacts } from '@tevm/compiler'
import { runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'
import { generateRuntime } from './generateRuntime.js'

describe('generateRuntime', () => {
	const artifacts: Artifacts = {
		MyContract: {
			abi: [{ type: 'constructor', inputs: [], stateMutability: 'payable' }],
			evm: { bytecode: '0x420', deployedBytecode: '0x420420' } as any,
			userdoc: {
				kind: 'user',
				version: 1,
				notice: 'MyContract',
				methods: {
					'balanceOf(address)': {
						notice: 'Returns the amount of tokens owned by account',
					},
				},
			},
		},
	}

	it('should throw an error for unknown module types', () => {
		expect(() =>
			runSync(generateRuntime(artifacts, 'invalidType' as any, false, '@tevm/contract')),
		).toThrowErrorMatchingInlineSnapshot(
			`[(FiberFailure) Error: Unknown module type: invalidType. Valid module types include 'cjs', 'dts', 'ts', and 'mjs']`,
		)
	})

	it('should handle no artifacts found case', () => {
		expect(() => runSync(generateRuntime({}, 'cjs', false, '@tevm/contract'))).toThrowErrorMatchingInlineSnapshot(
			'[(FiberFailure) Error: No artifacts provided to generateRuntime]',
		)
	})

	it('should handle artifacts being null', () => {
		expect(() =>
			runSync(generateRuntime(null as any, 'dts', false, '@tevm/contract')),
		).toThrowErrorMatchingInlineSnapshot('[(FiberFailure) Error: No artifacts provided to generateRuntime]')
	})

	it('should handle commonjs module type', () => {
		const result = runSync(generateRuntime(artifacts, 'cjs', false, '@tevm/contract'))
		expect(result).toMatchInlineSnapshot(`
			"const { createContract } = require('@tevm/contract')
			const _MyContract = {
			  "name": "MyContract",
			  "humanReadableAbi": [
			    "constructor() payable"
			  ]
			}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
			 */
			module.exports.MyContract = createContract(_MyContract)"
		`)
	})

	it('should handle dts module type', () => {
		const result = runSync(generateRuntime(artifacts, 'dts', false, '@tevm/contract'))
		expect(result).toMatchInlineSnapshot(`
			"import type { Contract } from '@tevm/contract'
			const _abiMyContract = ["constructor() payable"] as const;
			const _nameMyContract = "MyContract" as const;
			/**
			 * MyContract Contract (no bytecode)
			 * change file name or add file that ends in '.s.sol' extension if you wish to compile the bytecode
			 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
			 * @notice MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const MyContract: Contract<typeof _nameMyContract, typeof _abiMyContract, undefined, undefined, undefined, undefined>;"
		`)
	})

	it('should handle ts module type', () => {
		const result = runSync(generateRuntime(artifacts, 'ts', false, '@tevm/contract'))
		expect(result).toMatchInlineSnapshot(`
			"import { createContract } from '@tevm/contract'
			const _MyContract = {
			  "name": "MyContract",
			  "humanReadableAbi": [
			    "constructor() payable"
			  ]
			} as const
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
			 */
			export const MyContract = createContract(_MyContract)"
		`)
	})

	it('should handle mjs module type', () => {
		const result = runSync(generateRuntime(artifacts, 'mjs', false, '@tevm/contract'))
		expect(result).toMatchInlineSnapshot(`
			"import { createContract } from '@tevm/contract'
			const _MyContract = {
			  "name": "MyContract",
			  "humanReadableAbi": [
			    "constructor() payable"
			  ]
			}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
			 */
			export const MyContract = createContract(_MyContract)"
		`)
	})

	it('should handle mjs module type with includeBytecode', () => {
		const result = runSync(generateRuntime(artifacts, 'mjs', true, '@tevm/contract'))
		expect(result).toBeDefined()
		expect(result).toContain('createContract')
		expect(result).toContain('import { createContract } from') // Check import statement
		expect(result).toContain('bytecode') // Should include bytecode in the output
	})

	it('should generate runtime with alternative contract package', () => {
		// Test with different package name
		const result = runSync(generateRuntime(artifacts, 'ts', false, 'tevm/contract'))
		expect(result).toContain("import { createContract } from 'tevm/contract'")
		expect(result).not.toContain("import { createContract } from '@tevm/contract'")
	})

	it('should handle complex artifacts with multiple contracts', () => {
		const multipleContracts: Artifacts = {
			MainContract: {
				abi: [
					{ type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
					{
						type: 'function',
						name: 'getValue',
						inputs: [],
						outputs: [{ type: 'uint256' }],
						stateMutability: 'view'
					}
				],
				evm: { bytecode: { object: 'mainBytecode' }, deployedBytecode: { object: 'mainDeployedBytecode' } },
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'Main contract implementation',
					methods: {
						'getValue()': {
							notice: 'Returns the stored value'
						}
					}
				}
			},
			HelperContract: {
				abi: [
					{
						type: 'function',
						name: 'help',
						inputs: [{ name: 'x', type: 'uint256' }],
						outputs: [{ type: 'uint256' }],
						stateMutability: 'pure'
					}
				],
				evm: { bytecode: { object: 'helperBytecode' }, deployedBytecode: { object: 'helperDeployedBytecode' } },
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'Helper utilities',
					methods: {
						'help(uint256)': {
							notice: 'Calculates a helper value'
						}
					}
				}
			}
		}

		// Test with multiple contracts and bytecode
		const result = runSync(generateRuntime(multipleContracts, 'ts', true, '@tevm/contract'))
		
		// Should include both contracts
		expect(result).toContain('"name": "MainContract"')
		expect(result).toContain('"name": "HelperContract"')
		
		// Should include bytecode for both contracts
		expect(result).toContain('"bytecode": "0xmainBytecode"')
		expect(result).toContain('"bytecode": "0xhelperBytecode"')
		
		// Should include documentation for both contracts
		expect(result).toContain('* @property getValue() Returns the stored value')
		expect(result).toContain('* @property help(uint256) Calculates a helper value')

		// Should export both contracts
		expect(result).toContain('export const MainContract = createContract(_MainContract)')
		expect(result).toContain('export const HelperContract = createContract(_HelperContract)')
	})

	it('should ensure correct ordering of imports and body', () => {
		const result = runSync(generateRuntime(artifacts, 'ts', true, '@tevm/contract'))
		
		// The import statement should always be the first line
		const lines = result.split('\n')
		expect(lines[0]).toContain('import { createContract } from')
		
		// The contract declaration should follow after the import
		expect(lines[1]).toContain('const _MyContract =')
	})

	it('should handle artifacts with empty object properties gracefully', () => {
		const artifactsWithEmptyProps: Artifacts = {
			EmptyPropsContract: {
				abi: [],
				evm: { bytecode: {}, deployedBytecode: {} } as any,
				userdoc: {} // Empty userdoc
			}
		}

		// Should not throw errors on empty objects
		const result = runSync(generateRuntime(artifactsWithEmptyProps, 'cjs', true, '@tevm/contract'))
		expect(result).toContain('const _EmptyPropsContract = {')
		expect(result).toContain('"name": "EmptyPropsContract"')
		expect(result).toContain('"humanReadableAbi": []')
		expect(result).not.toContain('"bytecode":') // Should not include undefined bytecode
		expect(result).not.toContain('"deployedBytecode":')
	})
})
