import type { ScriptParams, ScriptResult } from '../index.js'
import type { ScriptHandler } from './ScriptHandler.js'
import { describe, expect, it } from 'bun:test'

describe('ScriptHandler', () => {
	it('Is a generic type that infers the abi function name arg and return type and requires deployedBytecode', async () => {
		const mockReturn = {} as any
		const contractHandler: ScriptHandler = async () => {
			return mockReturn
		}

		const goodAction = {
			abi: [
				{
					constant: true,
					inputs: [
						{
							name: '_owner',
							type: 'address',
						},
					],
					name: 'balanceOf',
					outputs: [
						{
							name: 'balance',
							type: 'uint256',
						},
					],
					payable: false,
					stateMutability: 'view',
					type: 'function',
				},
			] as const,
			args: ['0x123'] as const,
			functionName: 'balanceOf' as const,
			deployedBytecode: '0x420',
		} as const

		expect(
			contractHandler(
				goodAction satisfies ScriptParams<
					typeof goodAction['abi'],
					typeof goodAction['functionName']
				>,
			) satisfies Promise<
				ScriptResult<
					typeof goodAction['abi'],
					typeof goodAction['functionName']
				>
			>,
		).resolves.toBe(mockReturn)

		contractHandler({
			...goodAction,
			// @ts-expect-error
			args: [5],
		})
		const { deployedBytecode: _, ...badAction } = goodAction
		// @ts-expect-error
		contractHandler(badAction)
	})
})
