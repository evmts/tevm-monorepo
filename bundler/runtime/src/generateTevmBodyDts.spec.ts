import { generateDtsBody } from './generateTevmBodyDts.js'
import { runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'

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

	it('should generate correct body with etherscan links', () => {
		expect(runSync(generateDtsBody(artifacts, false))).toMatchInlineSnapshot(`
			"const _abiMyContract = [\\"constructor() payable\\"] as const;
			const _nameMyContract = \\"MyContract\\" as const;
			/**
			 * MyContract TevmContract
			 * @notice MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const MyContract: TevmContract<typeof _nameMyContract, typeof _abiMyContract, undefined, undefined>;
			const _abiAnotherContract = [] as const;
			const _nameAnotherContract = \\"AnotherContract\\" as const;
			/**
			 * AnotherContract TevmContract
			 * @notice MyContract
			 */
			export const AnotherContract: TevmContract<typeof _nameAnotherContract, typeof _abiAnotherContract, undefined, undefined>;
			const _abiMissingContract = [] as const;
			const _nameMissingContract = \\"MissingContract\\" as const;
			/**
			 * MissingContract TevmContract
			 * @notice MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const MissingContract: TevmContract<typeof _nameMissingContract, typeof _abiMissingContract, undefined, undefined>;"
		`)
	})
})
