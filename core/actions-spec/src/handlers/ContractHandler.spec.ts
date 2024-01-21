import type { ContractParams, ContractResult } from '../index.js'
import type { ContractHandler } from './ContractHandler.js'
import { describe, expect, it } from 'bun:test'

describe('ContractHandler', () => {
	it('Is a generic type that infers the abi function name arg and return type', async () => {
		const mockReturn = {} as any
		const contractHandler: ContractHandler = async () => {
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
			to: '0x123' as const,
		} as const

		expect(
			contractHandler(
				goodAction satisfies ContractParams<
					typeof goodAction['abi'],
					typeof goodAction['functionName']
				>,
			) satisfies Promise<
				ContractResult<
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
	})
})
