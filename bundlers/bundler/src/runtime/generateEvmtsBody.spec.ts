import { generateEvmtsBody } from './generateEvmtsBody' // replace with your actual module path
import { describe, expect, it } from 'vitest'

describe('generateEvmtsBody', () => {
	const artifacts = {
		MyContract: {
			abi: [],
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

	it('should generate correct body for cjs module', () => {
		const result = generateEvmtsBody(artifacts, 'cjs')
		expect(result).toMatchInlineSnapshot(`
			"const _MyContract = {\\"name\\":\\"MyContract\\",\\"abi\\":[]}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			module.exports.MyContract = evmtsContractFactory(_MyContract)
			const _AnotherContract = {\\"name\\":\\"AnotherContract\\",\\"abi\\":[]}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			module.exports.AnotherContract = evmtsContractFactory(_AnotherContract)"
		`)
	})

	it('should generate correct body for mjs module', () => {
		const result = generateEvmtsBody(artifacts, 'mjs')
		expect(result).toMatchInlineSnapshot(`
			"const _MyContract = {\\"name\\":\\"MyContract\\",\\"abi\\":[]}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const MyContract = evmtsContractFactory(_MyContract)
			const _AnotherContract = {\\"name\\":\\"AnotherContract\\",\\"abi\\":[]}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const AnotherContract = evmtsContractFactory(_AnotherContract)"
		`)
	})

	it('should generate correct body for ts module', () => {
		const result = generateEvmtsBody(artifacts, 'ts')
		expect(result).toMatchInlineSnapshot(`
			"const _MyContract = {\\"name\\":\\"MyContract\\",\\"abi\\":[]} as const
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const MyContract = evmtsContractFactory(_MyContract)
			const _AnotherContract = {\\"name\\":\\"AnotherContract\\",\\"abi\\":[]} as const
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const AnotherContract = evmtsContractFactory(_AnotherContract)"
		`)
	})

	it('should generate correct body for dts module', () => {
		const result = generateEvmtsBody(artifacts, 'dts')
		expect(result).toMatchInlineSnapshot(`
			"const _abiMyContract = [] as const;
			const _nameMyContract = \\"MyContract\\" as const;
			/**
			 * MyContract EvmtsContract
			 * @notice MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const MyContract: EvmtsContract<typeof _nameMyContract, typeof _chainAddressMapMyContract, typeof _abiMyContract>;
			const _abiAnotherContract = [] as const;
			const _nameAnotherContract = \\"AnotherContract\\" as const;
			/**
			 * AnotherContract EvmtsContract
			 * @notice MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const AnotherContract: EvmtsContract<typeof _nameAnotherContract, typeof _chainAddressMapAnotherContract, typeof _abiAnotherContract>;"
		`)
	})
})
