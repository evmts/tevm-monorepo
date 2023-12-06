import { generateTevmBody } from './generateTevmBody.js'
import { runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'

describe('generateTevmBody', () => {
	const artifacts = {
		MyContract: {
			abi: [],
			evm: {
				bytecode: '0x0',
				deployedBytecode: '0x0420',
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
				bytecode: '0x0',
				deployedBytecode: '0x0420',
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
			"const _MyContract = {\\"name\\":\\"MyContract\\",\\"humanReadableAbi\\":[]}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			module.exports.MyContract = createTevmContract(_MyContract)
			const _AnotherContract = {\\"name\\":\\"AnotherContract\\",\\"humanReadableAbi\\":[]}
			/**
			 * MyContract
			 */
			module.exports.AnotherContract = createTevmContract(_AnotherContract)"
		`)
	})

	it('should generate correct body for mjs module', () => {
		const result = runSync(generateTevmBody(artifacts, 'mjs', false))
		expect(result).toMatchInlineSnapshot(`
			"const _MyContract = {\\"name\\":\\"MyContract\\",\\"humanReadableAbi\\":[]}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const MyContract = createTevmContract(_MyContract)
			const _AnotherContract = {\\"name\\":\\"AnotherContract\\",\\"humanReadableAbi\\":[]}
			/**
			 * MyContract
			 */
			export const AnotherContract = createTevmContract(_AnotherContract)"
		`)
	})

	it('should generate correct body for ts module', () => {
		const result = runSync(generateTevmBody(artifacts, 'ts', false))
		expect(result).toMatchInlineSnapshot(`
			"const _MyContract = {\\"name\\":\\"MyContract\\",\\"humanReadableAbi\\":[]} as const
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const MyContract = createTevmContract(_MyContract)
			const _AnotherContract = {\\"name\\":\\"AnotherContract\\",\\"humanReadableAbi\\":[]} as const
			/**
			 * MyContract
			 */
			export const AnotherContract = createTevmContract(_AnotherContract)"
		`)
	})

	it('should generate correct body for dts module', () => {
		const result = runSync(generateTevmBody(artifacts, 'dts', false))
		expect(result).toMatchInlineSnapshot(`
			"const _abiMyContract = [] as const;
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
			export const AnotherContract: TevmContract<typeof _nameAnotherContract, typeof _abiAnotherContract, undefined, undefined>;"
		`)
	})
})
