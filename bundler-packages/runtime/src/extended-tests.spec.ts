import type { Artifacts } from '@tevm/compiler'
import { runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'
import { generateRuntime } from './generateRuntime.js'
import { generateTevmBody } from './generateTevmBody.js'
import { generateDtsBody } from './generateTevmBodyDts.js'

// Helper function to cast test artifacts to Artifacts type to avoid TS errors with simplified test data
const createTestArtifacts = (artifacts: any): Artifacts => artifacts as Artifacts

describe('Advanced Code Generation Tests', () => {
	it('should handle contracts with special characters in names', () => {
		const specialCharsArtifact = createTestArtifacts({
			Special$Contract_123: {
				abi: [
					{
						type: 'function',
						name: 'special$Method_123',
						inputs: [{ name: 'unusual_param$', type: 'uint256' }],
						outputs: [{ type: 'string' }],
						stateMutability: 'view',
					},
				],
				evm: {
					bytecode: { object: 'specialBytecode' },
					deployedBytecode: { object: 'specialDeployedBytecode' },
				},
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'Contract with special characters',
				},
				contractName: 'Special$Contract_123',
			},
		})

		const result = runSync(generateTevmBody(specialCharsArtifact, 'ts', true))
		expect(result).toContain('"name": "Special$Contract_123"')
		expect(result).toContain('function special$Method_123(uint256 unusual_param$) view returns (string)')
		expect(result).toContain('* Contract with special characters')
		expect(result).toContain('export const Special$Contract_123 = createContract(_Special$Contract_123)')
	})

	it('should handle complex nested structs and arrays in ABI', () => {
		const complexStructsArtifact = createTestArtifacts({
			ComplexStructsContract: {
				abi: [
					{
						type: 'function',
						name: 'complexStructFunction',
						inputs: [
							{
								name: 'structParam',
								type: 'tuple',
								components: [
									{ name: 'value', type: 'uint256' },
									{ name: 'name', type: 'string' },
									{
										name: 'nestedStruct',
										type: 'tuple',
										components: [
											{ name: 'flag', type: 'bool' },
											{ name: 'values', type: 'uint256[]' },
										],
									},
								],
							},
							{
								name: 'structArrayParam',
								type: 'tuple[]',
								components: [
									{ name: 'id', type: 'uint256' },
									{ name: 'enabled', type: 'bool' },
								],
							},
						],
						outputs: [{ type: 'bool' }],
						stateMutability: 'nonpayable',
					},
				],
				evm: {
					bytecode: { object: 'complexStructsBytecode' },
					deployedBytecode: { object: 'complexStructsDeployedBytecode' },
				},
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'Contract with complex nested structs',
				},
				contractName: 'ComplexStructsContract',
			},
		})

		const result = runSync(generateTevmBody(complexStructsArtifact, 'ts', true))
		expect(result).toContain('"name": "ComplexStructsContract"')
		expect(result).toContain('function complexStructFunction(')
		expect(result).toContain('structParam')
		expect(result).toContain('structArrayParam')
		expect(result).toContain('* Contract with complex nested structs')

		// Also test DTS generation with complex structs
		const dtsResult = runSync(generateDtsBody(complexStructsArtifact, true))
		expect(dtsResult).toContain('const _nameComplexStructsContract = "ComplexStructsContract" as const')
		expect(dtsResult).toContain('typeof _abiComplexStructsContract')
	})

	it('should handle overloaded functions in ABI', () => {
		const overloadedFunctionsArtifact = createTestArtifacts({
			OverloadedContract: {
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
							{ name: 'tokenId', type: 'uint256' },
							{ name: 'data', type: 'bytes' },
						],
						outputs: [{ type: 'bool' }],
						stateMutability: 'nonpayable',
					},
					{
						type: 'function',
						name: 'transfer',
						inputs: [
							{ name: 'from', type: 'address' },
							{ name: 'to', type: 'address' },
							{ name: 'amount', type: 'uint256' },
						],
						outputs: [{ type: 'bool' }],
						stateMutability: 'nonpayable',
					},
				],
				evm: {
					bytecode: { object: 'overloadedBytecode' },
					deployedBytecode: { object: 'overloadedDeployedBytecode' },
				},
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'Contract with overloaded functions',
					methods: {
						'transfer(address,uint256)': {
							notice: 'Standard ERC20 transfer',
						},
						'transfer(address,uint256,bytes)': {
							notice: 'ERC721 transfer with data',
						},
						'transfer(address,address,uint256)': {
							notice: 'Transfer from a specific address',
						},
					},
				},
				contractName: 'OverloadedContract',
			},
		})

		const result = runSync(generateTevmBody(overloadedFunctionsArtifact, 'ts', true))
		expect(result).toContain('"name": "OverloadedContract"')
		expect(result).toContain('function transfer(address to, uint256 amount) returns (bool)')
		expect(result).toContain('function transfer(address to, uint256 tokenId, bytes data) returns (bool)')
		expect(result).toContain('function transfer(address from, address to, uint256 amount) returns (bool)')
		expect(result).toContain('* @property transfer(address,uint256) Standard ERC20 transfer')
		expect(result).toContain('* @property transfer(address,uint256,bytes) ERC721 transfer with data')
		expect(result).toContain('* @property transfer(address,address,uint256) Transfer from a specific address')

		// Test the full runtime generation as well
		const runtimeResult = runSync(generateRuntime(overloadedFunctionsArtifact, 'ts', true, '@tevm/contract'))
		expect(runtimeResult).toContain('import { createContract } from')
		expect(runtimeResult).toContain('Standard ERC20 transfer')
		expect(runtimeResult).toContain('ERC721 transfer with data')
		expect(runtimeResult).toContain('Transfer from a specific address')
	})

	it('should handle extremely large bytecode', () => {
		// Create a long bytecode string (10KB+)
		const largeBytecode = 'a'.repeat(10000)

		const largeBytecodeArtifact = createTestArtifacts({
			LargeContract: {
				abi: [
					{
						type: 'function',
						name: 'simpleFunction',
						inputs: [],
						outputs: [{ type: 'uint256' }],
						stateMutability: 'view',
					},
				],
				evm: {
					bytecode: { object: largeBytecode },
					deployedBytecode: { object: largeBytecode },
				},
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'Contract with large bytecode',
				},
				contractName: 'LargeContract',
			},
		})

		const result = runSync(generateTevmBody(largeBytecodeArtifact, 'ts', true))
		expect(result).toContain('"name": "LargeContract"')
		expect(result).toContain(`"bytecode": "0x${largeBytecode}"`)
		expect(result).toContain(`"deployedBytecode": "0x${largeBytecode}"`)
		expect(result).toContain('function simpleFunction() view returns (uint256)')
	})

	it('should handle ABI with all major Solidity types', () => {
		const allTypesArtifact = createTestArtifacts({
			AllTypesContract: {
				abi: [
					{
						type: 'function',
						name: 'allTypes',
						inputs: [
							{ name: 'uintParam', type: 'uint256' },
							{ name: 'intParam', type: 'int256' },
							{ name: 'boolParam', type: 'bool' },
							{ name: 'addressParam', type: 'address' },
							{ name: 'bytesParam', type: 'bytes' },
							{ name: 'bytes32Param', type: 'bytes32' },
							{ name: 'stringParam', type: 'string' },
							{ name: 'uint8ArrayParam', type: 'uint8[]' },
							{ name: 'addressArrayParam', type: 'address[]' },
							{ name: 'fixedArrayParam', type: 'uint256[3]' },
							{ name: 'enumParam', type: 'uint8' }, // Enums are represented as uint8 in ABI
							{ name: 'fixedBytesParam', type: 'bytes16' },
						],
						outputs: [{ type: 'bytes' }],
						stateMutability: 'nonpayable',
					},
				],
				evm: {
					bytecode: { object: 'allTypesBytecode' },
					deployedBytecode: { object: 'allTypesDeployedBytecode' },
				},
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'Contract with all major Solidity types',
				},
				contractName: 'AllTypesContract',
			},
		})

		const result = runSync(generateTevmBody(allTypesArtifact, 'ts', true))
		expect(result).toContain('"name": "AllTypesContract"')
		expect(result).toContain(
			'function allTypes(uint256 uintParam, int256 intParam, bool boolParam, address addressParam, bytes bytesParam, bytes32 bytes32Param, string stringParam, uint8[] uint8ArrayParam, address[] addressArrayParam, uint256[3] fixedArrayParam, uint8 enumParam, bytes16 fixedBytesParam) returns (bytes)',
		)
		expect(result).toContain('* Contract with all major Solidity types')
	})

	it('should handle multiple artifacts with varying complexity', () => {
		const multipleArtifacts = createTestArtifacts({
			SimpleContract: {
				abi: [
					{
						type: 'function',
						name: 'simple',
						inputs: [],
						outputs: [{ type: 'bool' }],
						stateMutability: 'view',
					},
				],
				evm: {
					bytecode: { object: 'simpleBytecode' },
					deployedBytecode: { object: 'simpleDeployedBytecode' },
				},
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'Simple contract',
				},
				contractName: 'SimpleContract',
			},
			ComplexContract: {
				abi: [
					{
						type: 'constructor',
						inputs: [{ name: 'initialValue', type: 'uint256' }],
						stateMutability: 'payable',
					},
					{
						type: 'function',
						name: 'complex',
						inputs: [{ name: 'input', type: 'uint256[]' }],
						outputs: [{ name: 'output', type: 'string' }],
						stateMutability: 'nonpayable',
					},
					{
						type: 'event',
						name: 'ComplexEvent',
						inputs: [
							{ name: 'sender', type: 'address', indexed: true },
							{ name: 'value', type: 'uint256', indexed: false },
						],
						anonymous: false,
					},
				],
				evm: {
					bytecode: { object: 'complexBytecode' },
					deployedBytecode: { object: 'complexDeployedBytecode' },
				},
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'Complex contract',
				},
				contractName: 'ComplexContract',
			},
		})

		const result = runSync(generateTevmBody(multipleArtifacts, 'ts', true))

		// Check SimpleContract
		expect(result).toContain('"name": "SimpleContract"')
		expect(result).toContain('function simple() view returns (bool)')
		expect(result).toContain('* Simple contract')

		// Check ComplexContract
		expect(result).toContain('"name": "ComplexContract"')
		expect(result).toContain('constructor(uint256 initialValue) payable')
		expect(result).toContain('function complex(uint256[] input) returns (string output)')
		expect(result).toContain('event ComplexEvent(address indexed sender, uint256 value)')
		expect(result).toContain('* Complex contract')
	})

	it('should handle anonymous events correctly', () => {
		const anonymousEventsArtifact = createTestArtifacts({
			EventsContract: {
				abi: [
					{
						type: 'event',
						name: 'StandardEvent',
						inputs: [
							{ name: 'from', type: 'address', indexed: true },
							{ name: 'value', type: 'uint256', indexed: false },
						],
						anonymous: false,
					},
					{
						type: 'event',
						name: 'AnonymousEvent',
						inputs: [
							{ name: 'user', type: 'address', indexed: true },
							{ name: 'action', type: 'string', indexed: false },
						],
						anonymous: true,
					},
				],
				evm: {
					bytecode: { object: 'eventsBytecode' },
					deployedBytecode: { object: 'eventsDeployedBytecode' },
				},
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'Contract with anonymous events',
				},
				contractName: 'EventsContract',
			},
		})

		const result = runSync(generateTevmBody(anonymousEventsArtifact, 'ts', true))
		expect(result).toContain('"name": "EventsContract"')
		expect(result).toContain('event StandardEvent(address indexed from, uint256 value)')
		expect(result).toContain('event AnonymousEvent(address indexed user, string action)')
		expect(result).toContain('* Contract with anonymous events')
	})

	it('should handle JavaScript keyword conflicts in function names', () => {
		const keywordConflictsArtifact = createTestArtifacts({
			KeywordContract: {
				abi: [
					{
						type: 'function',
						name: 'delete',
						inputs: [{ name: 'id', type: 'uint256' }],
						outputs: [{ type: 'bool' }],
						stateMutability: 'nonpayable',
					},
					{
						type: 'function',
						name: 'class',
						inputs: [{ name: 'name', type: 'string' }],
						outputs: [{ type: 'uint256' }],
						stateMutability: 'view',
					},
					{
						type: 'function',
						name: 'function',
						inputs: [],
						outputs: [{ type: 'bool' }],
						stateMutability: 'view',
					},
				],
				evm: {
					bytecode: { object: 'keywordBytecode' },
					deployedBytecode: { object: 'keywordDeployedBytecode' },
				},
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'Contract with JavaScript keyword conflicts',
				},
				contractName: 'KeywordContract',
			},
		})

		const result = runSync(generateTevmBody(keywordConflictsArtifact, 'ts', true))
		expect(result).toContain('"name": "KeywordContract"')
		expect(result).toContain('function delete(uint256 id) returns (bool)')
		expect(result).toContain('function class(string name) view returns (uint256)')
		expect(result).toContain('function function() view returns (bool)')
		expect(result).toContain('* Contract with JavaScript keyword conflicts')
	})

	it('should properly escape special characters in documentation', () => {
		const specialCharsDocArtifact = createTestArtifacts({
			SpecialDocContract: {
				abi: [
					{
						type: 'function',
						name: 'test',
						inputs: [],
						outputs: [{ type: 'string' }],
						stateMutability: 'view',
					},
				],
				evm: {
					bytecode: { object: 'specialDocBytecode' },
					deployedBytecode: { object: 'specialDocDeployedBytecode' },
				},
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'Contract with special chars in docs: * & < > " \'',
					methods: {
						'test()': {
							notice: 'Method with special chars: * & < > " \'',
						},
					},
				},
				contractName: 'SpecialDocContract',
			},
		})

		const result = runSync(generateTevmBody(specialCharsDocArtifact, 'ts', true))
		expect(result).toContain('"name": "SpecialDocContract"')
		expect(result).toContain('* Contract with special chars in docs: * & < > " \'')
		expect(result).toContain('* @property test() Method with special chars: * & < > " \'')
	})

	it('should handle interfaces with empty string bytecode correctly', () => {
		// This test reproduces the bug where interfaces in .s.sol files produce empty string
		// bytecode, which was not handled correctly by the runtime
		const interfaceArtifact = createTestArtifacts({
			ICounter: {
				abi: [
					{
						type: 'function',
						name: 'count',
						inputs: [],
						outputs: [{ type: 'uint256' }],
						stateMutability: 'view',
					},
					{
						type: 'function',
						name: 'increment',
						inputs: [],
						outputs: [],
						stateMutability: 'nonpayable',
					},
				],
				evm: {
					// Empty string bytecode (what happens with interfaces in .s.sol files)
					bytecode: { object: '' },
					deployedBytecode: { object: '' },
				},
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'Counter Interface',
					methods: {
						'increment()': {
							notice: 'Increments the counter',
						},
						'count()': {
							notice: 'Returns the current count',
						},
					},
				},
				contractName: 'ICounter',
			},
		})

		// Test with includeBytecode=true (as it would be for .s.sol files)
		const result = runSync(generateTevmBody(interfaceArtifact, 'ts', true))

		// Should include the interface functions
		expect(result).toContain('function count() view returns (uint256)')
		expect(result).toContain('function increment()')

		// Should not include bytecode when it's an empty string
		expect(result).not.toContain('"bytecode": "0x"')
		expect(result).not.toContain('"deployedBytecode": "0x"')

		// Should still include proper documentation
		expect(result).toContain('@property increment() Increments the counter')
		expect(result).toContain('@property count() Returns the current count')

		// Test the full runtime generation as well
		const runtimeResult = runSync(generateRuntime(interfaceArtifact, 'ts', true, '@tevm/contract'))
		expect(runtimeResult).toContain('function count() view returns (uint256)')
		expect(runtimeResult).toContain('function increment()')
		expect(runtimeResult).toMatchSnapshot()
	})
})
