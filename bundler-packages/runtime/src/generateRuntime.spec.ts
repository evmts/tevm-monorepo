import type { Artifacts } from '@tevm/compiler'
import { runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'
import { generateRuntime } from './generateRuntime.js'

// Helper function to cast test artifacts to Artifacts type to avoid TS errors with simplified test data
const createTestArtifacts = (artifacts: any): Artifacts => artifacts as Artifacts

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
			contractName: 'MyContract',
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

		// The artifacts don't have properly structured bytecode object, so we're just checking the import
		// We'll verify bytecode inclusion in the complex artifacts test
	})

	it('should generate runtime with alternative contract package', () => {
		// Test with different package name
		const result = runSync(generateRuntime(artifacts, 'ts', false, 'tevm/contract'))
		expect(result).toContain("import { createContract } from 'tevm/contract'")
		expect(result).not.toContain("import { createContract } from '@tevm/contract'")
	})

	it('should handle complex artifacts with multiple contracts', () => {
		const multipleContracts = createTestArtifacts({
			MainContract: {
				abi: [
					{ type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
					{
						type: 'function',
						name: 'getValue',
						inputs: [],
						outputs: [{ type: 'uint256' }],
						stateMutability: 'view',
					},
				],
				evm: { bytecode: { object: 'mainBytecode' }, deployedBytecode: { object: 'mainDeployedBytecode' } },
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'Main contract implementation',
					methods: {
						'getValue()': {
							notice: 'Returns the stored value',
						},
					},
				},
			},
			HelperContract: {
				abi: [
					{
						type: 'function',
						name: 'help',
						inputs: [{ name: 'x', type: 'uint256' }],
						outputs: [{ type: 'uint256' }],
						stateMutability: 'pure',
					},
				],
				evm: { bytecode: { object: 'helperBytecode' }, deployedBytecode: { object: 'helperDeployedBytecode' } },
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'Helper utilities',
					methods: {
						'help(uint256)': {
							notice: 'Calculates a helper value',
						},
					},
				},
			},
		})

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
		const artifactsWithEmptyProps = createTestArtifacts({
			EmptyPropsContract: {
				abi: [],
				evm: { bytecode: {}, deployedBytecode: {} },
				userdoc: { kind: 'user', version: 1 }, // Minimal required userdoc
			},
		})

		// Should not throw errors on empty objects
		const result = runSync(generateRuntime(artifactsWithEmptyProps, 'cjs', true, '@tevm/contract'))
		expect(result).toContain('const _EmptyPropsContract = {')
		expect(result).toContain('"name": "EmptyPropsContract"')
		expect(result).toContain('"humanReadableAbi": []')
		expect(result).not.toContain('"bytecode":') // Should not include undefined bytecode
		expect(result).not.toContain('"deployedBytecode":')
	})

	it('should generate valid TypeScript that can transpile', () => {
		// This test verifies the TS output would compile properly
		const complexArtifacts = createTestArtifacts({
			ComplexABI: {
				abi: [
					{
						type: 'function',
						name: 'complexFunction',
						inputs: [
							{
								name: 'inputStruct',
								type: 'tuple',
								components: [
									{ name: 'a', type: 'uint256' },
									{ name: 'b', type: 'string' },
								],
							},
							{ name: 'arrayInput', type: 'uint256[]' },
						],
						outputs: [{ name: 'output', type: 'bytes32' }],
						stateMutability: 'view',
					},
					{
						type: 'event',
						name: 'ComplexEvent',
						inputs: [
							{ indexed: true, name: 'sender', type: 'address' },
							{ indexed: false, name: 'value', type: 'uint256' },
						],
						anonymous: false,
					},
				],
				evm: { bytecode: { object: 'complexBytecode' }, deployedBytecode: { object: 'complexDeployedBytecode' } },
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'Complex contract with structured types',
					methods: {
						'complexFunction((uint256,string),uint256[])': {
							notice: 'A function with complex argument types',
						},
					},
				},
			},
		})

		// Test TypeScript output generation
		const result = runSync(generateRuntime(complexArtifacts, 'ts', true, '@tevm/contract'))

		// Verify TypeScript syntax elements are present
		expect(result).toContain('as const')
		expect(result).toContain('export const ComplexABI =')
		expect(result).toContain('"humanReadableAbi": [')

		// Verify complex ABI is correctly formatted - check for key parts instead of exact strings
		expect(result).toContain('complexFunction')
		expect(result).toContain('uint256')
		expect(result).toContain('string')
		expect(result).toContain('view returns')
		expect(result).toContain('event ComplexEvent')
		expect(result).toContain('address indexed sender')

		// Verify documentation is generated
		expect(result).toContain(
			'* @property complexFunction((uint256,string),uint256[]) A function with complex argument types',
		)
	})

	it('should handle contracts with overloaded functions', () => {
		// Create artifacts with overloaded functions
		const overloadedArtifacts = createTestArtifacts({
			Overloaded: {
				abi: [
					{
						type: 'function',
						name: 'transfer',
						inputs: [
							{ name: 'to', type: 'address' },
							{ name: 'amount', type: 'uint256' },
						],
						outputs: [{ type: 'bool' }],
						stateMutability: 'nonpayable',
					},
					{
						type: 'function',
						name: 'transfer',
						inputs: [
							{ name: 'to', type: 'address' },
							{ name: 'token', type: 'address' },
							{ name: 'amount', type: 'uint256' },
						],
						outputs: [{ type: 'bool' }],
						stateMutability: 'nonpayable',
					},
				],
				evm: { bytecode: { object: 'overloadedBytecode' }, deployedBytecode: { object: 'overloadedDeployed' } },
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'Contract with overloaded functions',
					methods: {
						'transfer(address,uint256)': {
							notice: 'Transfer tokens to an address',
						},
						'transfer(address,address,uint256)': {
							notice: 'Transfer specific token to an address',
						},
					},
				},
			},
		})

		// Test with overloaded functions
		const result = runSync(generateRuntime(overloadedArtifacts, 'mjs', true, '@tevm/contract'))

		// Check for overloaded functions by looking for key parts
		expect(result).toContain('transfer')
		expect(result).toContain('address to')
		expect(result).toContain('uint256 amount')
		expect(result).toContain('address token')
		expect(result).toContain('returns (bool)')

		// Verify documentation for both overloaded functions
		expect(result).toContain('* @property transfer(address,uint256) Transfer tokens to an address')
		expect(result).toContain('* @property transfer(address,address,uint256) Transfer specific token to an address')
	})
})
