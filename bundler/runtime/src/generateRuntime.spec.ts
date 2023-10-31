import { generateRuntime } from './generateRuntime.js'
import type { Artifacts } from '@evmts/solc'
import { runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'

describe('generateRuntime', () => {
	const artifacts: Artifacts = {
		MyContract: {
			abi: [{ type: 'constructor', inputs: [], stateMutability: 'payable' }],
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
			runSync(generateRuntime(artifacts, 'invalidType' as any)),
		).toThrowErrorMatchingInlineSnapshot(
			'"Unknown module type: invalidType. Valid module types include cjs, dts, ts, mjs"',
		)
	})

	it('should handle no artifacts found case', () => {
		expect(() =>
			runSync(generateRuntime({}, 'cjs')),
		).toThrowErrorMatchingInlineSnapshot(
			'"No artifacts provided to generateRuntime"',
		)
	})

	it('should handle artifacts being null', () => {
		expect(() =>
			runSync(generateRuntime(null as any, 'dts')),
		).toThrowErrorMatchingInlineSnapshot(
			'"No artifacts provided to generateRuntime"',
		)
	})

	it('should handle commonjs module type', () => {
		const result = runSync(generateRuntime(artifacts, 'cjs'))
		expect(result).toMatchInlineSnapshot(`
			"const { evmtsContractFactory } = require('@evmts/core')
			const _MyContract = {\\"name\\":\\"MyContract\\",\\"humanReadableAbi\\":[\\"constructor() payable\\"]}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			module.exports.MyContract = evmtsContractFactory(_MyContract)"
		`)
	})

	it('should handle dts module type', () => {
		const result = runSync(generateRuntime(artifacts, 'dts'))
		expect(result).toMatchInlineSnapshot(`
			"import { EvmtsContract } from '@evmts/core'
			const _abiMyContract = [\\"constructor() payable\\"] as const;
			const _nameMyContract = \\"MyContract\\" as const;
			/**
			 * MyContract EvmtsContract
			 * @notice MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const MyContract: EvmtsContract<typeof _nameMyContract, typeof _abiMyContract>;"
		`)
	})

	it('should handle ts module type', () => {
		const result = runSync(generateRuntime(artifacts, 'ts'))
		expect(result).toMatchInlineSnapshot(`
			"import { evmtsContractFactory } from '@evmts/core'
			const _MyContract = {\\"name\\":\\"MyContract\\",\\"humanReadableAbi\\":[\\"constructor() payable\\"]} as const
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const MyContract = evmtsContractFactory(_MyContract)"
		`)
	})

	it('should handle mjs module type', () => {
		const result = runSync(generateRuntime(artifacts, 'mjs'))
		expect(result).toMatchInlineSnapshot(`
			"import { evmtsContractFactory } from '@evmts/core'
			const _MyContract = {\\"name\\":\\"MyContract\\",\\"humanReadableAbi\\":[\\"constructor() payable\\"]}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const MyContract = evmtsContractFactory(_MyContract)"
		`)
	})
})
