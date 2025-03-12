import type { Artifacts } from '@tevm/compiler'
import { runSync } from 'effect/Effect'
import { describe, expect, it } from 'vitest'
import { generateRuntime } from './generateRuntime.js'

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
			runSync(generateRuntime(artifacts, 'invalidType' as any, false, '@tevm/contract')),
		).toThrowErrorMatchingInlineSnapshot(
			`[(FiberFailure) Error: Unknown module type: invalidType. Valid module types include 'cjs', 'dts', 'ts', and 'mjs']`,
		)
	})

	it('should handle no artifacts found case', () => {
		expect(() => runSync(generateRuntime({}, 'cjs', false, '@tevm/contract'))).toThrowErrorMatchingInlineSnapshot(
			'[(FiberFailure) Error: No artifacts provided to generateRuntime]',
		)
	})

	it('should handle artifacts being null', () => {
		expect(() =>
			runSync(generateRuntime(null as any, 'dts', false, '@tevm/contract')),
		).toThrowErrorMatchingInlineSnapshot('[(FiberFailure) Error: No artifacts provided to generateRuntime]')
	})

	it('should handle commonjs module type', () => {
		const result = runSync(generateRuntime(artifacts, 'cjs', false, '@tevm/contract'))
		expect(result).toMatchInlineSnapshot(`
			"const { createContract } = require('@tevm/contract')
			const _MyContract = {
			  "name": "MyContract",
			  "humanReadableAbi": [
			    "constructor() payable"
			  ]
			}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
			 */
			module.exports.MyContract = createContract(_MyContract)"
		`)
	})

	it('should handle dts module type', () => {
		const result = runSync(generateRuntime(artifacts, 'dts', false, '@tevm/contract'))
		expect(result).toMatchInlineSnapshot(`
			"import type { Contract } from '@tevm/contract'
			const _abiMyContract = ["constructor() payable"] as const;
			const _nameMyContract = "MyContract" as const;
			/**
			 * MyContract Contract (no bytecode)
			 * change file name or add file that ends in '.s.sol' extension if you wish to compile the bytecode
			 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
			 * @notice MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 */
			export const MyContract: Contract<typeof _nameMyContract, typeof _abiMyContract, undefined, undefined, undefined, undefined>;"
		`)
	})

	it('should handle ts module type', () => {
		const result = runSync(generateRuntime(artifacts, 'ts', false, '@tevm/contract'))
		expect(result).toMatchInlineSnapshot(`
			"import { createContract } from '@tevm/contract'
			const _MyContract = {
			  "name": "MyContract",
			  "humanReadableAbi": [
			    "constructor() payable"
			  ]
			} as const
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
			 */
			export const MyContract = createContract(_MyContract)"
		`)
	})

	it('should handle mjs module type', () => {
		const result = runSync(generateRuntime(artifacts, 'mjs', false, '@tevm/contract'))
		expect(result).toMatchInlineSnapshot(`
			"import { createContract } from '@tevm/contract'
			const _MyContract = {
			  "name": "MyContract",
			  "humanReadableAbi": [
			    "constructor() payable"
			  ]
			}
			/**
			 * MyContract
			 * @property balanceOf(address) Returns the amount of tokens owned by account
			 * @see [contract docs](https://tevm.sh/learn/contracts/) for more documentation
			 */
			export const MyContract = createContract(_MyContract)"
		`)
	})

	it('should handle mjs module type with includeBytecode', () => {
		const result = runSync(generateRuntime(artifacts, 'mjs', true, '@tevm/contract'))
		expect(result).toBeDefined()
		expect(result).toContain('createContract')
		expect(result).toContain('import { createContract } from') // Check import statement
	})
})
