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

	const config = {
		localContracts: {
			contracts: [
				{
					name: 'MyContract',
					addresses: {
						test: '0x123',
					},
				},
			],
		},
	}

	it('should generate correct body for cjs module', () => {
		const result = generateEvmtsBody(artifacts, config as any, 'cjs')
		expect(result).toMatchInlineSnapshot(`
			"const _MyContract = {\\"name\\":\\"MyContract\\",\\"abi\\":[],\\"addresses\\":{\\"test\\":\\"0x123\\"}}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			module.exports.MyContract = evmtsContractFactory(_MyContract)
			const _AnotherContract = {\\"name\\":\\"AnotherContract\\",\\"abi\\":[],\\"addresses\\":{}}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			module.exports.AnotherContract = evmtsContractFactory(_AnotherContract)"
		`)
	})

	it('should generate correct body for mjs module', () => {
		const result = generateEvmtsBody(artifacts, config as any, 'mjs')
		expect(result).toMatchInlineSnapshot(`
			"const _MyContract = {\\"name\\":\\"MyContract\\",\\"abi\\":[],\\"addresses\\":{\\"test\\":\\"0x123\\"}}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const MyContract = evmtsContractFactory(_MyContract)
			const _AnotherContract = {\\"name\\":\\"AnotherContract\\",\\"abi\\":[],\\"addresses\\":{}}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const AnotherContract = evmtsContractFactory(_AnotherContract)"
		`)
	})

	it('should generate correct body for ts module', () => {
		const result = generateEvmtsBody(artifacts, config as any, 'ts')
		expect(result).toMatchInlineSnapshot(`
			"const _MyContract = {\\"name\\":\\"MyContract\\",\\"abi\\":[],\\"addresses\\":{\\"test\\":\\"0x123\\"}} as const
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const MyContract = evmtsContractFactory(_MyContract)
			const _AnotherContract = {\\"name\\":\\"AnotherContract\\",\\"abi\\":[],\\"addresses\\":{}} as const
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const AnotherContract = evmtsContractFactory(_AnotherContract)"
		`)
	})

	it('should generate correct body for dts module', () => {
		const result = generateEvmtsBody(artifacts, config as any, 'dts')
		expect(result).toMatchInlineSnapshot(`
			"const _abiMyContract = [] as const;
			const _chainAddressMapMyContract = {\\"test\\":\\"0x123\\"} as const;
			const _nameMyContract = \\"MyContract\\" as const;
			/**
			 * MyContract EvmtsContract
			 * @notice MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const MyContract: EvmtsContract<typeof _nameMyContract, typeof _chainAddressMapMyContract, typeof _abiMyContract>;
			const _abiAnotherContract = [] as const;
			const _chainAddressMapAnotherContract = {} as const;
			const _nameAnotherContract = \\"AnotherContract\\" as const;
			/**
			 * AnotherContract EvmtsContract
			 * @notice MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const AnotherContract: EvmtsContract<typeof _nameAnotherContract, typeof _chainAddressMapAnotherContract, typeof _abiAnotherContract>;"
		`)
	})

	it('should handle contract not having addresses in config', () => {
		const configNoAddress = {
			localContracts: {
				contracts: [
					{
						name: 'NoAddressContract',
					},
				],
			},
		}
		const result = generateEvmtsBody(artifacts, configNoAddress as any, 'cjs')
		expect(result).toMatchInlineSnapshot(`
			"const _MyContract = {\\"name\\":\\"MyContract\\",\\"abi\\":[],\\"addresses\\":{}}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			module.exports.MyContract = evmtsContractFactory(_MyContract)
			const _AnotherContract = {\\"name\\":\\"AnotherContract\\",\\"abi\\":[],\\"addresses\\":{}}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			module.exports.AnotherContract = evmtsContractFactory(_AnotherContract)"
		`)
	})
})
