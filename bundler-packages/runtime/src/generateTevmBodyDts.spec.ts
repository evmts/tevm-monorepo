import { runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'
import { generateDtsBody } from './generateTevmBodyDts.js'

describe('generateDtsBody', () => {
	const artifacts = {
		MyContract: {
			abi: [{ type: 'constructor', inputs: [], stateMutability: 'payable' }],
			evm: {
				bytecode: '0x420',
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
				bytecode: '0x420',
			} as any,
			userdoc: {
				kind: 'user',
				version: 1,
				notice: 'MyContract',
			},
		},
		MissingContract: {
			abi: [],
			evm: {
				bytecode: '0x420',
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
	} as const

	it('should generate correct body without bytecode', () => {
		expect(runSync(generateDtsBody(artifacts, false))).toMatchInlineSnapshot(`
			"const _abiMyContract = ["constructor() payable"] as const;
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
			export const AnotherContract: Contract<typeof _nameAnotherContract, typeof _abiAnotherContract, undefined, undefined, undefined, undefined>;
			const _abiMissingContract = [] as const;
			const _nameMissingContract = "MissingContract" as const;
			/**
			 * MissingContract Contract (no bytecode)
			 * change file name or add file that ends in '.s.sol' extension if you wish to compile the bytecode
			 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
			 * @notice MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const MissingContract: Contract<typeof _nameMissingContract, typeof _abiMissingContract, undefined, undefined, undefined, undefined>;"
		`)
	})

	it('should generate correct body with bytecode', () => {
		expect(runSync(generateDtsBody(artifacts, true))).toMatchInlineSnapshot(`
			"const _nameMyContract = "MyContract" as const;
			const _abiMyContract = [
			  "constructor() payable"
			] as const;
			/**
			 * MyContract Contract (with bytecode)
			 * @notice MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
			 */
			export const MyContract: Contract<
			  typeof _nameMyContract,
			  typeof _abiMyContract,
			  undefined,
			  \`0x\${string}\`,
			  \`0x\${string}\`,
			  undefined,
			>;
			const _nameAnotherContract = "AnotherContract" as const;
			const _abiAnotherContract = [] as const;
			/**
			 * AnotherContract Contract (with bytecode)
			 * @notice MyContract
			 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
			 */
			export const AnotherContract: Contract<
			  typeof _nameAnotherContract,
			  typeof _abiAnotherContract,
			  undefined,
			  \`0x\${string}\`,
			  \`0x\${string}\`,
			  undefined,
			>;
			const _nameMissingContract = "MissingContract" as const;
			const _abiMissingContract = [] as const;
			/**
			 * MissingContract Contract (with bytecode)
			 * @notice MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
			 */
			export const MissingContract: Contract<
			  typeof _nameMissingContract,
			  typeof _abiMissingContract,
			  undefined,
			  \`0x\${string}\`,
			  \`0x\${string}\`,
			  undefined,
			>;"
		`)
	})
})
