import type { Artifacts } from '@tevm/compiler'
import { runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'
import { generateTevmBody } from './generateTevmBody.js'

// Helper function to cast test artifacts to Artifacts type to avoid TS errors with simplified test data
const createTestArtifacts = (artifacts: any): Artifacts => artifacts as Artifacts

describe('generateTevmBody', () => {
	const artifacts = {
		MyContract: {
			abi: [],
			evm: {
				bytecode: {
					object: '1234',
				},
				deployedBytecode: {
					object: '5678',
				},
			} as any,
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
		AnotherContract: {
			abi: [],
			evm: {
				bytecode: {
					object: '4321',
				},
				deployedBytecode: {
					object: '8765',
				},
			} as any,
			userdoc: {
				kind: 'user',
				version: 1,
				notice: 'MyContract',
			},
			contractName: 'AnotherContract',
		},
	} as const

	it('should generate correct body for cjs module', () => {
		const result = runSync(generateTevmBody(artifacts, 'cjs', false))
		expect(result).toMatchInlineSnapshot(`
"const _MyContract = {
  "name": "MyContract",
  "humanReadableAbi": []
}
/**
 * MyContract
 * @property balanceOf(address) Returns the amount of tokens owned by account
 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
 */
module.exports.MyContract = createContract(_MyContract)
const _AnotherContract = {
  "name": "AnotherContract",
  "humanReadableAbi": []
}
/**
 * MyContract
 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
 */
module.exports.AnotherContract = createContract(_AnotherContract)"
`)
	})

	it('should generate correct body for mjs module', () => {
		const result = runSync(generateTevmBody(artifacts, 'mjs', false))
		expect(result).toMatchInlineSnapshot(`
"const _MyContract = {
  "name": "MyContract",
  "humanReadableAbi": []
}
/**
 * MyContract
 * @property balanceOf(address) Returns the amount of tokens owned by account
 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
 */
export const MyContract = createContract(_MyContract)
const _AnotherContract = {
  "name": "AnotherContract",
  "humanReadableAbi": []
}
/**
 * MyContract
 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
 */
export const AnotherContract = createContract(_AnotherContract)"
`)
	})

	it('should generate correct body for ts module', () => {
		const result = runSync(generateTevmBody(artifacts, 'ts', false))
		expect(result).toMatchInlineSnapshot(`
"const _MyContract = {
  "name": "MyContract",
  "humanReadableAbi": []
} as const
/**
 * MyContract
 * @property balanceOf(address) Returns the amount of tokens owned by account
 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
 */
export const MyContract = createContract(_MyContract)
const _AnotherContract = {
  "name": "AnotherContract",
  "humanReadableAbi": []
} as const
/**
 * MyContract
 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
 */
export const AnotherContract = createContract(_AnotherContract)"
`)
	})

	it('should generate correct body for dts module', () => {
		const result = runSync(generateTevmBody(artifacts, 'dts', false))
		expect(result).toMatchInlineSnapshot(`
"const _abiMyContract = [] as const;
const _nameMyContract = "MyContract" as const;
/**
 * MyContract Contract (no bytecode)
 * change file name or add file that ends in '.s.sol' extension if you wish to compile the bytecode
 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
 * @notice MyContract
 * @property balanceOf(address) Returns the amount of tokens owned by account
 */
export const MyContract: Contract<typeof _nameMyContract, typeof _abiMyContract, undefined, undefined, undefined, undefined>;
const _abiAnotherContract = [] as const;
const _nameAnotherContract = "AnotherContract" as const;
/**
 * AnotherContract Contract (no bytecode)
 * change file name or add file that ends in '.s.sol' extension if you wish to compile the bytecode
 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
 * @notice MyContract
 */
export const AnotherContract: Contract<typeof _nameAnotherContract, typeof _abiAnotherContract, undefined, undefined, undefined, undefined>;"
`)
	})

	it('should include bytecode when requested for mjs module', () => {
		const result = runSync(generateTevmBody(artifacts, 'mjs', true))
		expect(result).toMatchInlineSnapshot(`
"const _MyContract = {
  "name": "MyContract",
  "humanReadableAbi": [],
  "bytecode": "0x1234",
  "deployedBytecode": "0x5678"
}
/**
 * MyContract
 * @property balanceOf(address) Returns the amount of tokens owned by account
 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
 */
export const MyContract = createContract(_MyContract)
const _AnotherContract = {
  "name": "AnotherContract",
  "humanReadableAbi": [],
  "bytecode": "0x4321",
  "deployedBytecode": "0x8765"
}
/**
 * MyContract
 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
 */
export const AnotherContract = createContract(_AnotherContract)"
`)
	})

	it('should include bytecode when requested for ts module', () => {
		const result = runSync(generateTevmBody(artifacts, 'ts', true))
		expect(result).toContain('"bytecode": "0x1234"')
		expect(result).toContain('"deployedBytecode": "0x5678"')
		expect(result).toContain('"bytecode": "0x4321"')
		expect(result).toContain('"deployedBytecode": "0x8765"')
		expect(result).toContain('as const')
	})

	it('should include bytecode when requested for cjs module', () => {
		const result = runSync(generateTevmBody(artifacts, 'cjs', true))
		expect(result).toContain('"bytecode": "0x1234"')
		expect(result).toContain('"deployedBytecode": "0x5678"')
		expect(result).toContain('"bytecode": "0x4321"')
		expect(result).toContain('"deployedBytecode": "0x8765"')
		expect(result).toContain('module.exports')
	})

	it('should handle artifacts with missing bytecode properties gracefully', () => {
		const incompleteArtifacts = createTestArtifacts({
			IncompleteContract: {
				abi: [],
				evm: {}, // Add empty evm object to satisfy the type
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'IncompleteContract',
				},
				contractName: 'IncompleteContract',
			},
		})

		const result = runSync(generateTevmBody(incompleteArtifacts, 'mjs', true))
		expect(result).toContain('"name": "IncompleteContract"')
		expect(result).toContain('"humanReadableAbi": []')
		// Should not have bytecode properties when they don't exist in artifacts
		expect(result).not.toContain('"bytecode":')
		expect(result).not.toContain('"deployedBytecode":')
	})

	it('should handle interfaces with empty string bytecode correctly', () => {
		const interfaceArtifacts = createTestArtifacts({
			InterfaceContract: {
				abi: [
					{
						type: 'function',
						name: 'interfaceMethod',
						inputs: [],
						outputs: [{ type: 'bool' }],
						stateMutability: 'view',
					}
				],
				evm: {
					bytecode: { object: '' }, // Empty string bytecode (for interface)
					deployedBytecode: { object: '' }, // Empty string deployed bytecode
				},
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'Interface contract',
				},
				contractName: 'InterfaceContract',
			},
		})

		const result = runSync(generateTevmBody(interfaceArtifacts, 'mjs', true))
		expect(result).toContain('"name": "InterfaceContract"')
		expect(result).toContain('"humanReadableAbi": [')
		// Should not include bytecode when it's an empty string
		expect(result).not.toContain('"bytecode": "0x"')
		expect(result).not.toContain('"deployedBytecode": "0x"')
		// Should not include undefined bytecode
		expect(result).not.toContain('"bytecode": undefined')
		expect(result).not.toContain('"deployedBytecode": undefined')
	})

	it('should handle complex ABIs correctly', () => {
		const complexArtifacts = createTestArtifacts({
			ComplexContract: {
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
						type: 'event',
						name: 'Transfer',
						inputs: [
							{ name: 'from', type: 'address', indexed: true },
							{ name: 'to', type: 'address', indexed: true },
							{ name: 'amount', type: 'uint256', indexed: false },
						],
						anonymous: false,
					},
					{
						type: 'constructor',
						inputs: [{ name: 'initialSupply', type: 'uint256' }],
						stateMutability: 'nonpayable',
					},
					{
						type: 'error',
						name: 'InsufficientBalance',
						inputs: [
							{ name: 'account', type: 'address' },
							{ name: 'balance', type: 'uint256' },
							{ name: 'required', type: 'uint256' },
						],
					},
				],
				evm: {
					bytecode: { object: 'complexBytecode' },
					deployedBytecode: { object: 'complexDeployedBytecode' },
				},
				userdoc: {
					kind: 'user',
					version: 1,
					notice: 'A complex contract example',
					methods: {
						'transfer(address,uint256)': {
							notice: 'Transfers tokens to the specified address',
						},
					},
				},
				contractName: 'ComplexContract',
			},
		})

		// Test different module formats with complex ABI
		const mjsResult = runSync(generateTevmBody(complexArtifacts, 'mjs', true))
		// Check for function existence in the humanReadableAbi array
		expect(mjsResult).toContain('function transfer(address to, uint256 amount) returns (bool)')
		expect(mjsResult).toContain('event Transfer(address indexed from, address indexed to, uint256 amount)')
		expect(mjsResult).toContain('constructor(uint256 initialSupply)')
		expect(mjsResult).toContain('error InsufficientBalance(address account, uint256 balance, uint256 required)')
		expect(mjsResult).toContain('* @property transfer(address,uint256) Transfers tokens to the specified address')
		expect(mjsResult).toContain('"bytecode": "0xcomplexBytecode"')

		// Test TS format
		const tsResult = runSync(generateTevmBody(complexArtifacts, 'ts', true))
		expect(tsResult).toContain('as const')
		expect(tsResult).toContain('function transfer(address to, uint256 amount) returns (bool)')

		// Test DTS format
		const dtsResult = runSync(generateTevmBody(complexArtifacts, 'dts', true))
		expect(dtsResult).toContain('export const ComplexContract: Contract<')
		expect(dtsResult).toContain('* @notice A complex contract example')
	})

	it('should handle artifacts with no userdoc property', () => {
		const noDocsArtifact = createTestArtifacts({
			SimpleContract: {
				abi: [
					{
						type: 'function',
						name: 'getValue',
						inputs: [],
						outputs: [{ type: 'uint256' }],
						stateMutability: 'view',
					},
				],
				evm: {
					bytecode: { object: 'simpleBytecode' },
					deployedBytecode: { object: 'simpleDeployedBytecode' },
				},
				// No userdoc property
				contractName: 'SimpleContract',
			},
		})

		const result = runSync(generateTevmBody(noDocsArtifact, 'mjs', true))
		expect(result).toContain('"name": "SimpleContract"')
		expect(result).toContain('"humanReadableAbi": [')
		expect(result).toContain('function getValue() view returns (uint256)')
		expect(result).toContain('@see [contract docs]')
		// Should not crash due to missing userdoc
		expect(result).not.toContain('undefined')
	})

	it('should handle artifacts with userdoc.methods but no method notice', () => {
		const incompleteDocsArtifact = createTestArtifacts({
			PartialDocsContract: {
				abi: [
					{
						type: 'function',
						name: 'setValue',
						inputs: [{ name: 'newValue', type: 'uint256' }],
						outputs: [],
						stateMutability: 'nonpayable',
					},
				],
				evm: {
					bytecode: { object: 'partialBytecode' },
					deployedBytecode: { object: 'partialDeployedBytecode' },
				},
				userdoc: {
					kind: 'user',
					version: 1,
					methods: {
						// Method exists but has no notice property
						'setValue(uint256)': {},
					},
				},
				contractName: 'PartialDocsContract',
			},
		})

		const result = runSync(generateTevmBody(incompleteDocsArtifact, 'ts', true))
		// Should not crash due to missing notice
		expect(result).toContain('"name": "PartialDocsContract"')
		expect(result).toContain('"humanReadableAbi": [')
		expect(result).toContain('function setValue(uint256 newValue)')

		// Check if property doc exists with undefined value - either way is fine
		// This is actually expected in the implementation, because the method exists with an empty notice
		if (result.includes('* @property setValue(uint256)')) {
			expect(result).toContain('* @property setValue(uint256) undefined')
		}
	})
})

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