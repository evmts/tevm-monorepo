import { generateRuntime } from './generateRuntime.js'
import type { Artifacts } from '@tevm/solc'
import { runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'

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
		},
	}

	it('should throw an error for unknown module types', () => {
		expect(() =>
			runSync(generateRuntime(artifacts, 'invalidType' as any, false)),
		).toThrowErrorMatchingInlineSnapshot(
			'"Unknown module type: invalidType. Valid module types include cjs, dts, ts, mjs"',
		)
	})

	it('should handle no artifacts found case', () => {
		expect(() =>
			runSync(generateRuntime({}, 'cjs', false)),
		).toThrowErrorMatchingInlineSnapshot(
			'"No artifacts provided to generateRuntime"',
		)
	})

	it('should handle artifacts being null', () => {
		expect(() =>
			runSync(generateRuntime(null as any, 'dts', false)),
		).toThrowErrorMatchingInlineSnapshot(
			'"No artifacts provided to generateRuntime"',
		)
	})

	it('should handle commonjs module type', () => {
		const result = runSync(generateRuntime(artifacts, 'cjs', false))
		expect(result).toMatchInlineSnapshot(`
			"const { createTevmContract } = require('@tevm/contract')
			const _MyContract = {\\"name\\":\\"MyContract\\",\\"humanReadableAbi\\":[\\"constructor() payable\\"]}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			module.exports.MyContract = createTevmContract(_MyContract)"
		`)
	})

	it('should handle dts module type', () => {
		const result = runSync(generateRuntime(artifacts, 'dts', false))
		expect(result).toMatchInlineSnapshot(`
			"import { TevmContract } from '@tevm/contract'
			const _abiMyContract = [\\"constructor() payable\\"] as const;
			const _nameMyContract = \\"MyContract\\" as const;
			/**
			 * MyContract TevmContract
			 * @notice MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const MyContract: TevmContract<typeof _nameMyContract, typeof _abiMyContract, undefined, undefined>;"
		`)
	})

	it('should handle ts module type', () => {
		const result = runSync(generateRuntime(artifacts, 'ts', false))
		expect(result).toMatchInlineSnapshot(`
			"import { createTevmContract } from '@tevm/contract'
			const _MyContract = {\\"name\\":\\"MyContract\\",\\"humanReadableAbi\\":[\\"constructor() payable\\"]} as const
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const MyContract = createTevmContract(_MyContract)"
		`)
	})

	it('should handle mjs module type', () => {
		const result = runSync(generateRuntime(artifacts, 'mjs', false))
		expect(result).toMatchInlineSnapshot(`
			"import { createTevmContract } from '@tevm/contract'
			const _MyContract = {\\"name\\":\\"MyContract\\",\\"humanReadableAbi\\":[\\"constructor() payable\\"]}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const MyContract = createTevmContract(_MyContract)"
		`)
	})
})
