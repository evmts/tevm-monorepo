import { runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'
import { generateTevmBody } from './generateTevmBody.js'

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
})
