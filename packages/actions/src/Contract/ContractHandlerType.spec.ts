import { describe, expect, it } from 'vitest'
import type { ContractHandler } from './ContractHandlerType.js'
import type { ContractParams } from './ContractParams.js'
import type { ContractResult } from './ContractResult.js'

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

		await expect(
			contractHandler(
				goodAction satisfies ContractParams<(typeof goodAction)['abi'], (typeof goodAction)['functionName']>,
			) satisfies Promise<ContractResult<(typeof goodAction)['abi'], (typeof goodAction)['functionName']>>,
		).resolves.toBe(mockReturn)

		contractHandler({
			...goodAction,
			// @ts-expect-error
			args: [5],
		})
	})
})
